import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Map from "./pages/Map";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Map></Map>
    </>
  );
}

export default App;
