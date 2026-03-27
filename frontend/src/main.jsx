import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { Toaster } from "sonner"
import { Provider } from "react-redux"
import store from "./redux/store"

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        richColors
        duration={2500}
        closeButton={false}
      />

    </Provider>
  </StrictMode>
)