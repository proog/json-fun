import { connect } from "react-redux";
import { formatInput } from "../actionCreators";

function InputForm({ input, hasError, formatInput, className }) {
  let textareaClass =
    "w-full h-full border p-2 font-mono text-xs leading-tight obsidian-gray bg-obsidian-dark-gray resize-none";
  textareaClass += hasError ? " border-red-800" : " border-gray-800";

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
