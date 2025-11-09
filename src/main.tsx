import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { store } from "./store/store.js";
import { Provider } from 'react-redux';

createRoot(document.getElementById("root")!).render(<Provider store={store}>
    <App />
  </Provider>);
