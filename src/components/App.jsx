import { useSelector } from "react-redux";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { getFormatted } from "../selectors";
import FormattedOutput from "./FormattedOutput";
import InputForm from "./InputForm";
import JsonInfo from "./JsonInfo";

function App() {
  const formatted = useSelector(getFormatted);

  return (
    <div className="w-full h-full px-4">
      <div className="h-full flex flex-wrap">
        <InputForm className="w-full h-full flex flex-col py-4 md:w-1/3 md:pr-2" />
        <div className="w-full h-full py-4 md:w-2/3 md:pl-2">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={!!formatted}
              addEndListener={(node, done) =>
                node.addEventListener("transitionend", done, false)
              }
              classNames="fade"
            >
              {formatted ? <FormattedOutput /> : <JsonInfo />}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </div>
  );
}

export default App;
