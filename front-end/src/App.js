import './App.css';
import MenuComponent from "./components/MenuComponent";
import TableQRCodeList from "./components/TableQRCodeList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./components/EmployeeDashboard";
import FeedBackManagement from "./components/FeedBackManagement";
import SaleManagement from "./components/SaleManagement";
import {ToastContainer} from "react-toastify";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import CoffeeShop from "./component/home/HomePage";
import AboutUs from "./component/home/Introduction";
import News from "./component/home/News";
import EmployList from "./component/admin/EmployList";
import {HelmetProvider} from "react-helmet-async";

function App() {
    return (
        <HelmetProvider>
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<EmployeeDashboard/>}/>
                    <Route path="/manager/feedback" element={<FeedBackManagement/>} />
                    <Route path="/manager/sale" element={<SaleManagement/>}/>
                    <Route path="login" element={<Login/>}></Route>
                    <Route path="admins/register" element={<Register/>}></Route>
                    <Route path="admins/list" element={<EmployList/>}></Route>
                    <Route path="home" element={<CoffeeShop/>}></Route>
                    <Route path="/home/introduction" element={<AboutUs />} />
                    <Route path="/home/news" element={<News />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </div>
        </HelmetProvider>
    );
}

export default App;
