import "./App.css";
import TopComponent from "./components/TopComponent";
import Calculator from "./components/calculator_page/Calculator";
import Home from "./components/home_page/Home";
import Players from "./components/Players"
import Ranks from "./components/Ranks";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <TopComponent />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/ranks" element={<Ranks />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
