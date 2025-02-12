import logo from './logo.svg';
import './App.css';
import HomePage from "./component/home/HomePage";
import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="home" element={<CoffeeShop/>}></Route>
          </Routes>
        </BrowserRouter>
  );
}

export default App;
