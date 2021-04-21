import { useDispatch, useSelector } from "react-redux";
import { setAndFormatInput } from "../actions";
import { getHasError, getInput } from "../selectors";

function InputForm() {
  const input = useSelector(getInput);
  const hasError = useSelector(getHasError);
  const dispatch = useDispatch();

  let textareaClass =
    "w-full h-full border p-2 font-mono text-xs leading-tight resize-none focus:outline-none focus:ring text-atom-dark bg-atom-light dark:text-atom-light dark:bg-atom-dark";
  textareaClass += hasError
    ? " border-red-500 focus:ring-red-500"
    : " border-gray-500 focus:ring-gray-500";

  return (
    <div className="h-full flex flex-col">
      <textarea
        className={textareaClass}
        placeholder="json or xml here"
        value={input}
        onInput={(e) => dispatch(setAndFormatInput(e.target.value))}
        autoFocus
      ></textarea>
      <div className="mt-2 text-center">{input.length} characters</div>
    </div>
  );
}

export default InputForm;
