import { connect } from "react-redux";
import { formatInput } from "../actions";

function InputForm({ input, hasError, formatInput, className }) {
  let textareaClass =
    "w-full h-full border p-2 font-mono text-xs leading-tight text-obsidian-gray bg-obsidian-dark-gray resize-none focus:outline-none focus:ring";
  textareaClass += hasError
    ? " border-red-500 focus:ring-red-500"
    : " border-gray-500 focus:ring-gray-500";

  return (
    <div className={className}>
      <textarea
        className={textareaClass}
        placeholder="json or xml here"
        value={input}
        onInput={(e) => formatInput(e.target.value)}
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

export default connect(mapStateToProps, { formatInput })(InputForm);
