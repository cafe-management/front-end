import './App.css';
import CoffeeShop from "./component/home/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AboutUs from "./component/home/Introduction";
import TableQRCodeList from "./components/TableQRCodeList";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import ChangePassword from "./component/auth/ChangePassword";
import AccountInfo from "./component/auth/Information";
import Register from "./component/auth/Register";
// import LoginComponent from "./component/auth/LoginComponent";
import SaleManagement from "./components/SaleManagement";
import FeedBackManagement from "./components/FeedBackManagement";
import EmployeeDashboard from "./components/EmployeeDashboard";
import MenuComponent from "./components/MenuComponent";
import NewsCreateComponent from "./components/NewComponent";
import NewsListComponent from "./components/NewsListComponent";
// import NewsDetailComponent from "./components/NewsDetailComponent";
import NewsUpdateComponent from "./components/NewsUpdateComponent";

function App() {
    return (
        <HelmetProvider>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<TableQRCodeList />} />
                        <Route path="/menu" element={<MenuComponent />} />
                        <Route path="/dashboard" element={<EmployeeDashboard />} />
                        <Route path="/manager/feedback" element={<FeedBackManagement />} />
                        <Route path="/manager/sale" element={<SaleManagement />} />
                        {/*<Route path="/login" element={<LoginComponent />} />*/}
                        <Route path="/admins/register" element={<Register />} />
                        <Route path="/home" element={<CoffeeShop />} />
                        <Route path="/home/introduction" element={<AboutUs />} />
                        <Route path="/information" element={<AccountInfo />} />
                        <Route path="/change_password" element={<ChangePassword />} />
                        <Route path="/news" element={<NewsListComponent />} />
                        <Route path="/news/create" element={<NewsCreateComponent />} />
                        {/*<Route path="/news/:id" element={<NewsDetailComponent />} />*/}
                        <Route path="/news/edit/:id" element={<NewsUpdateComponent />} />

                    </Routes>
                </BrowserRouter>
                <ToastContainer />
            </div>
        </HelmetProvider>
    );
}

export default App;
