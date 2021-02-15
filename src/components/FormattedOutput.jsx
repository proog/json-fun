import hljs from "highlight.js/lib/core";
import { createRef, useState } from "react";
import { connect } from "react-redux";

function FormattedOutput({ hasError, formatted, language }) {
  const [notification, setNotification] = useState("Copy");
  const bufferRef = createRef();
  const highlighted = hasError
    ? formatted
    : { __html: hljs.highlight(language, formatted).value };

  function copy() {
    const selection = window.getSelection();
    selection.selectAllChildren(bufferRef.current);
    document.execCommand("copy");
    selection.removeAllRanges();

    setNotification("Copied");
    setTimeout(() => setNotification("Copy"), 1500);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full border border-gray-500 overflow-auto">
        <pre className="h-full m-0 text-sm" ref={bufferRef}>
          {hasError ? (
            <code className="h-full hljs">{highlighted}</code>
          ) : (
            <code
              className="h-full hljs"
              dangerouslySetInnerHTML={highlighted}
            ></code>
          )}
        </pre>
      </div>
      <div className="mt-2 text-center">
        <button
          className="focus:outline-none focus:ring hover:underline obsidian-orange cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            copy();
          }}
        >
          {notification} {formatted.length} characters
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  hasError: state.hasError,
  formatted: state.formatted,
  language: state.language,
});

export default connect(mapStateToProps)(FormattedOutput);
