import "./App.css";
import TopComponent from "./components/TopComponent";
import Calculator from "./components/calculator_page/Calculator";
import Home from "./components/home_page/Home";
import { MainState } from "./components/MainContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <MainState>
      <Router>
        <TopComponent />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </main>
      </Router>
    </MainState>
  );
}

export default App;
