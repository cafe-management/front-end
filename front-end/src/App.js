
import './App.css';

import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./components/MenuComponent";
import AboutUs from "./component/home/Introduction";
import TableQRCodeList from "./components/TableQRCodeList";
import FeedBackManagement from "./components/FeedBackManagement";
import SaleManagement from "./components/SaleManagement";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import EmployList from "./component/admin/EmployList";
import {ToastContainer} from "react-toastify";
import AccountInfo from "./component/auth/Information";
import ChangePassword from "./component/auth/ChangePassword";
import {HelmetProvider} from "react-helmet-async";
import NewsListComponent from "./components/NewsListComponent";
import NewsUpdateComponent from "./components/NewsUpdateComponent";
import NewComponent from "./components/NewComponent";
import DashBoardFeedback from "./Navbar/DashBoardFeedBack";
import EmployeeDashBoard from "./components/EmployeeDashboard";
import DashBoardSale from "./Navbar/DashBoardSale";

function App() {
    return (
        <HelmetProvider>
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<EmployeeDashBoard/>}/>
                    <Route path="/manager/feedback" element={<DashBoardFeedback/>} />
                    <Route path="/manager/sale" element={<DashBoardSale/>}/>
                    <Route path="login" element={<Login/>}></Route>
                    <Route path="admins/register" element={<Register/>}></Route>
                    <Route path="admins/list" element={<EmployList/>}></Route>
                    <Route path="home" element={<CoffeeShop/>}></Route>
                    <Route path="/home/introduction" element={<AboutUs />} />
                    <Route path="/information" element={<AccountInfo />} />
                    <Route path="change_password" element={<ChangePassword/>}></Route>
                    <Route path="/news" element={<NewsListComponent />} />
                    <Route path="/news/create" element={<NewComponent />} />
                    <Route path="/news/edit/:id" element={<NewsUpdateComponent />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </div>
        </HelmetProvider>
    );
}

export default App;
