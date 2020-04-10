import React, { Suspense } from "react";
import "./App.scss";
import { GlobalProvider } from "./api/fetchData";
import Header from "./components/Header";
// import Globe from "./components/Globe";
const Globe = React.lazy(() => import("./components/Globe"));
// import Cards from "./components/Cards";
const Cards = React.lazy(() => import("./components/Cards"));

function App() {
  return (
    <GlobalProvider>
      <div className="App" style={{ background: "#000" }}>
        <Header>
          <Suspense fallback={<div>Loading....</div>}>
            <section>
              <Globe />
              <Cards />
            </section>
          </Suspense>
        </Header>
      </div>
    </GlobalProvider>
  );
}

export default App;
