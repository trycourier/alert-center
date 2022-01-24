import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => loginWithRedirect()}>Log In</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
