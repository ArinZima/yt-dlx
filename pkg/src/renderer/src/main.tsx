import GlobalProviders from "./providers"
import ReactDOM from "react-dom/client"
import "./assets/main.css"
import React from "react"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalProviders>
      <App />
    </GlobalProviders>
  </React.StrictMode>
)
