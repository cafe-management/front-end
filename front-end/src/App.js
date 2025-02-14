import logo from './logo.svg';
import './App.css';
import HomePage from "./component/home/HomePage";
import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./component/menu/MenuComponent";
import Introduction from "./component/home/Introduction";
import AboutUs from "./component/home/Introduction";
import News from "./component/home/News";

function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="home" element={<CoffeeShop/>}></Route>
              <Route path="/home/menu" element={<MenuComponent />} />
              <Route path="/home/introduction" element={<AboutUs />} />
              <Route path="/home/news" element={<News />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
