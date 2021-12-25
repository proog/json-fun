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
  jsonInfo: document.querySelector("#jsonInfo"),
  formattedOutput: document.querySelector("#formattedOutput"),
};

const elements = {
  inputTextarea: document.querySelector("textarea"),
  inputLength: document.querySelector("#inputLength"),
  formattedOutput: document.querySelector("pre code"),
  formattedLength: document.querySelector("#formattedLength"),
  copyButton: document.querySelector("#copyButton"),
  copyDescription: document.querySelector("#copyDescription"),
};

const manualInput = new Subject();

const input$ = merge(
  manualInput.pipe(
    tap((input) => {
      elements.inputTextarea.value = input;
    })
  ),
  fromEvent(elements.inputTextarea, "input").pipe(
    map((event) => event.target.value),
    debounceTime(200)
  )
).pipe(share());

const view$ = input$.pipe(
  map((value) => !!value),
  distinctUntilChanged(),
  concatMap(async (showFormattedOutput) => {
    await fadeOut(showFormattedOutput ? views.jsonInfo : views.formattedOutput);
    await fadeIn(showFormattedOutput ? views.formattedOutput : views.jsonInfo);
  })
);

const formatted$ = input$.pipe(
  tap((input) => {
    saveInputToStorage(input);
    elements.inputLength.textContent = `${input.length}`;
  }),
  map((input) => formatInput(input)),
  tap(({ hasError, formatted, language }) => {
    elements.formattedOutput.innerHTML = hasError
      ? formatted
      : highlight(formatted, language);
    elements.formattedLength.textContent = `${formatted.length}`;
    elements.inputTextarea.classList.toggle("border-red-500", hasError);
    elements.inputTextarea.classList.toggle("focus:ring-red-500", hasError);
    elements.inputTextarea.classList.toggle("border-gray-500", !hasError);
    elements.inputTextarea.classList.toggle("focus:ring-gray-500", !hasError);
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

view$.subscribe();
formatted$.subscribe();
copyFormatted$.subscribe();

manualInput.next(loadInputFromStorage());
