import { connect } from "react-redux";
import { setAndFormatInput } from "../actions";

function InputForm({ input, hasError, setAndFormatInput, className }) {
  let textareaClass =
    "w-full h-full border p-2 font-mono text-xs leading-tight resize-none focus:outline-none focus:ring text-atom-dark bg-atom-light dark:text-atom-light dark:bg-atom-dark";
  textareaClass += hasError
    ? " border-red-500 focus:ring-red-500"
    : " border-gray-500 focus:ring-gray-500";

  return (
    <div className={className}>
      <textarea
        className={textareaClass}
        placeholder="json or xml here"
        value={input}
        onInput={(e) => setAndFormatInput(e.target.value)}
        autoFocus
      ></textarea>
      <div className="mt-2 text-center">{input.length} characters</div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  input: state.input,
  hasError: state.hasError,
});

export default connect(mapStateToProps, { setAndFormatInput })(InputForm);
