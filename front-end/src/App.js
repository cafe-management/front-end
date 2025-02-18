
import './App.css';

import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./components/MenuComponent";
import AboutUs from "./component/home/Introduction";
import TableQRCodeList from "./components/TableQRCodeList";
import EmployeeDashboard from "./components/EmployeeDashboard";
import FeedBackManagement from "./components/FeedBackManagement";
import SaleManagement from "./components/SaleManagement";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import EmployList from "./component/admin/EmployList";
import {ToastContainer} from "react-toastify";
import AccountInfo from "./component/auth/Information";
import ChangePassword from "./component/auth/ChangePassword";
import {HelmetProvider} from "react-helmet-async";
import NewsCreateComponent from "./components/NewComponent";
import Navbar from "./components/EmployeeDashboard";

function App() {
    return (
        <HelmetProvider>
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<Navbar/>}/>
                    <Route path="/manager/feedback" element={<FeedBackManagement/>} />
                    <Route path="/manager/sale" element={<SaleManagement/>}/>
                    <Route path="login" element={<Login/>}></Route>
                    <Route path="admins/register" element={<Register/>}></Route>
                    <Route path="admins/list" element={<EmployList/>}></Route>
                    <Route path="home" element={<CoffeeShop/>}></Route>
                    <Route path="/home/introduction" element={<AboutUs />} />
                    <Route path="/information" element={<AccountInfo />} />
                    <Route path="change_password" element={<ChangePassword/>}></Route>
                    <Route path="/news" element={<NewsCreateComponent/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </div>
        </HelmetProvider>
    );
}

export default App;
