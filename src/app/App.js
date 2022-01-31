import "./App.css";
import PopupPage from "../popup";
import store from "../store/store";

import { Provider } from "react-redux";

function App() {
  // let url = window.location.href;
  // if (url.includes("popup.html")) {
  return (
    <Provider store={store}>
      <PopupPage />
    </Provider>
  );
  // } else {
  //   return (
  //     <ul>
  //       <li>
  //         <a href="options.html">Options Page</a>
  //       </li>
  //       <li>
  //         <a href="popup.html">Popup Page</a>
  //       </li>
  //     </ul>
  //   );
  // }
}

export default App;
