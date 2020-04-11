import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fade, CircularProgress } from "@material-ui/core";
import { GlobalProvider } from "./api/fetchData";
import Header from "./components/Header";
import Globe from "./components/Globe";
import Cards from "./components/Cards";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "auto",
    justifyContent: "center",
    minHeight: "100vh",
  },
  placeholder: {
    margin: "auto",
  },
}));

function App() {
  const classes = useStyles();
  const [query, setQuery] = useState("idle");
  const timerRef = useRef();

  useEffect(() => {
    setQuery("progress");
    timerRef.current = setTimeout(() => {
      setQuery("success");
    }, 4000);
    return () => {
      clearTimeout(timerRef);
    };
  }, []);

  return (
    <>
      {query === "success" ? (
        <GlobalProvider>
          <div
            className="App"
            style={{ background: "linear-gradient(to left, #000000, #003566)" }}
          >
            <Header>
              <section>
                <Globe />
                <Cards />
              </section>
            </Header>
          </div>
        </GlobalProvider>
      ) : (
        <div className={classes.root}>
          <div className={classes.placeholder}>
            <Fade
              in={query === "progress"}
              style={{
                transitionDelay: query === "progress" ? "800ms" : "0ms",
              }}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
          </div>
        </div>
      )}
    </>
  );
}

// const RenderingComponent = ({ query }, ref) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         margin: "auto",
//         justifyContent: "center",
//         alignItems: "center",
//         textAlign: "center",
//         height: "100vh",
//         width: "100vw",
//       }}
//     >
//       <Fade
//         in={query === "progress"}
//         style={{
//           transitionDelay: query === "progress" ? "200ms" : "0ms",
//         }}
//         unmountOnExit
//       >
//         <CircularProgress />
//       </Fade>
//     </div>
//   );
// };

export default App;
