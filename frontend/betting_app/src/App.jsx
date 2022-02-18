import "./App.css";
import TopComponent from "./components/TopComponent";
import Calculator from "./components/calculator_page/Calculator";
import Home from "./components/Home";
import Players from "./components/Players"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
function App() {
  return (
    <>
      <Router>
        <TopComponent />
        <main>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/calculator' element={<Calculator />}/>
            <Route path='/players' element={<Players />}/>
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
