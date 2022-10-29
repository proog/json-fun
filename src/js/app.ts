import {
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  share,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs";
import { formatInput } from "./formatting";
import { highlight } from "./highlighting";
import { loadInputFromStorage, saveInputToStorage } from "./storage";
import { fadeIn, fadeOut } from "./transitions";

const views = {
  jsonInfo: document.querySelector<HTMLElement>("#jsonInfo")!,
  formattedOutput: document.querySelector<HTMLElement>("#formattedOutput")!,
};

const elements = {
  inputTextarea: document.querySelector("textarea")!,
  inputLength: document.querySelector<HTMLElement>("#inputLength")!,
  formattedOutput: document.querySelector<HTMLElement>("pre code")!,
  formattedLength: document.querySelector<HTMLElement>("#formattedLength")!,
  copyButton: document.querySelector<HTMLButtonElement>("#copyButton")!,
  copyDescription: document.querySelector<HTMLElement>("#copyDescription")!,
  explainAutocompleteButton: document.querySelector<HTMLButtonElement>(
    "#explainAutocompleteButton"
  )!,
  explainDecodeButton: document.querySelector<HTMLButtonElement>(
    "#explainDecodeButton"
  )!,
};

const manualInput = new Subject<string>();

const input$ = merge(
  manualInput.pipe(
    tap((input) => {
      elements.inputTextarea.value = input;
    })
  ),
  fromEvent(elements.inputTextarea, "input").pipe(
    map((event) => (event.target as HTMLTextAreaElement).value),
    debounceTime(200)
  )
).pipe(
  tap((input) => {
    saveInputToStorage(input);
    elements.inputLength.textContent = `${input.length}`;
  }),
  share()
);

const view$ = input$.pipe(
  map((value) => !!value),
  distinctUntilChanged(),
  concatMap(async (showFormattedOutput) => {
    await fadeOut(showFormattedOutput ? views.jsonInfo : views.formattedOutput);
    await fadeIn(showFormattedOutput ? views.formattedOutput : views.jsonInfo);
  })
);

const formatted$ = input$.pipe(
  map((input) => formatInput(input)),
  tap(({ hasError, formatted, language, completed, decoded }) => {
    elements.formattedOutput.innerHTML = hasError
      ? formatted
      : highlight(formatted, language);
    elements.formattedLength.textContent = `${formatted.length}`;
    elements.inputTextarea.classList.toggle("border-red-500", hasError);
    elements.inputTextarea.classList.toggle("focus:ring-red-500", hasError);
    elements.inputTextarea.classList.toggle("border-gray-500", !hasError);
    elements.inputTextarea.classList.toggle("focus:ring-gray-500", !hasError);
    elements.explainAutocompleteButton.style.display = completed ? "" : "none";
    elements.explainDecodeButton.style.display = decoded ? "" : "none";
  }),
  share()
);

const copyFormatted$ = fromEvent(elements.copyButton, "click").pipe(
  withLatestFrom(formatted$),
  switchMap(([, { formatted }]) => navigator.clipboard.writeText(formatted)),
  tap(() => {
    elements.inputTextarea.focus();
    elements.copyDescription.textContent = "Copied";
  }),
  delay(1500),
  tap(() => {
    elements.copyDescription.textContent = "Copy";
  })
);

const explainAutocomplete$ = fromEvent(
  elements.explainAutocompleteButton,
  "click"
).pipe(
  tap(() => {
    alert(
      "It looks like the JSON input was invalid (not parseable).\n\n" +
        "This is most commonly caused by truncation, such as when copying from a database column that does not have the sufficient length to store the complete JSON structure.\n\n" +
        "An attempt was made to complete the input by inserting the necessary JSON tokens."
    );
    elements.inputTextarea.focus();
  })
);

const explainDecode$ = fromEvent(elements.explainDecodeButton, "click").pipe(
  tap(() => {
    alert(
      "The input was interpreted as a Base64 encoded string and was automatically decoded."
    );
    elements.inputTextarea.focus();
  })
);

view$.subscribe();
formatted$.subscribe();
copyFormatted$.subscribe();
explainAutocomplete$.subscribe();
explainDecode$.subscribe();

manualInput.next(loadInputFromStorage());
