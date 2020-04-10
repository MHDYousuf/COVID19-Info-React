import React from "react";
import "./App.scss";
import Globe from "./components/Globe";
import Header from "./components/Header";
import Cards from "./components/Cards";

import { GlobalProvider } from "./api/fetchData";
function App() {
  return (
    <GlobalProvider>
      <div className="App" style={{ background: "#000" }}>
        <Header>
          <Globe />
          <Cards />
        </Header>
      </div>
    </GlobalProvider>
  );
}

export default App;
