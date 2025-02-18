
import './App.css';

import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AboutUs from "./component/home/Introduction";
import TableQRCodeList from "./components/TableQRCodeList";
import { HelmetProvider } from "react-helmet-async";
import {ToastContainer} from "react-toastify";
import ChangePassword from "./component/auth/ChangePassword";
import AccountInfo from "./component/auth/Information";
import Register from "./component/auth/Register";
import {Login} from "@mui/icons-material";
import SaleManagement from "./components/SaleManagement";
import FeedBackManagement from "./components/FeedBackManagement";
import EmployeeDashboard from "./components/EmployeeDashboard";
import MenuComponent from "./components/MenuComponent";
import NewsCreateComponent from "./components/NewComponent";



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
                    {/*<Route path="admins/list" element={<EmployList/>}></Route>*/}
                    <Route path="home" element={<CoffeeShop/>}></Route>
                    <Route path="/home/introduction" element={<AboutUs />} />
                    <Route path="/information" element={<AccountInfo />} />
                    <Route path="change_password" element={<ChangePassword/>}/>
                    <Route path="/news" element={<NewsCreateComponent/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </div>
        </HelmetProvider>
    );
}

export default App;
