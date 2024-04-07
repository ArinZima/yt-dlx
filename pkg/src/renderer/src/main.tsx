import GlobalProviders from "./providers"
import ReactDOM from "react-dom/client"
import React from "react"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalProviders>
      <App />
    </GlobalProviders>
  </React.StrictMode>
)
