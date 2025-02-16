
import './App.css';

import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./component/menu/MenuComponent";
import Introduction from "./component/home/Introduction";
import AboutUs from "./component/home/Introduction";
import News from "./component/home/News";
import TableQRCodeList from "./components/TableQRCodeList";
import { HelmetProvider } from "react-helmet-async";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import EmployList from "./component/admin/EmployList";
function App() {
  return (
      <HelmetProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="login" element={<Login/>}></Route>
                  <Route path="register" element={<Register/>}></Route>
                  <Route path="admins/list" element={<EmployList/>}></Route>
                  <Route path="home" element={<CoffeeShop/>}></Route>
                  <Route path="/home/menu" element={<MenuComponent />} />
                  <Route path="/home/introduction" element={<AboutUs />} />
                  <Route path="/home/news" element={<News />} />
                  <Route path="/" element={<TableQRCodeList />} />
                  <Route path="/menu" element={<MenuComponent />} />
              </Routes>
          </BrowserRouter>
      </HelmetProvider>

  );
}

export default App;
