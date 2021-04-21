import { createRef, useState } from "react";
import { useSelector } from "react-redux";
import { getFormatted, getHasError, getHighlightedOutput } from "../selectors";

function FormattedOutput() {
  const formatted = useSelector(getFormatted);
  const hasError = useSelector(getHasError);
  const highlighted = useSelector(getHighlightedOutput);
  const [notification, setNotification] = useState("Copy");
  const bufferRef = createRef();

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
              dangerouslySetInnerHTML={{ __html: highlighted }}
            ></code>
          )}
        </pre>
      </div>
      <div className="mt-2 text-center">
        <button
          className="focus:outline-none focus:ring hover:underline text-yellow-600 cursor-pointer"
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

export default FormattedOutput;
