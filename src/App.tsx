import { useState } from "react";
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
