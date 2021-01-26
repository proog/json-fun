import { connect } from "react-redux";
import FormattedOutput from "./FormattedOutput";
import InputForm from "./InputForm";
import JsonInfo from "./JsonInfo";

function App({ formatted }) {
  return (
    <div className="w-full h-full px-4">
      <div className="h-full flex flex-wrap">
        <InputForm className="w-full h-full flex flex-col py-4 md:w-1/3 md:pr-2" />
        <div className="w-full h-full py-4 md:w-2/3 md:pl-2">
          <transition mode="out-in">
            {formatted ? <FormattedOutput /> : <JsonInfo />}
          </transition>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({ formatted: state.formatted });

export default connect(mapStateToProps)(App);
