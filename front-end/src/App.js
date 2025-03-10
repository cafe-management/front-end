
import './App.css';

import CoffeeShop from "./component/home/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./components/MenuComponent";
import AboutUs from "./component/home/Introduction";
import TableQRCodeList from "./components/TableQRCodeList";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import EmployList from "./component/admin/EmployList";
import AccountInfo from "./component/auth/Information";
import ChangePassword from "./component/auth/ChangePassword";
import {HelmetProvider} from "react-helmet-async";
import {AbilityProvider} from "./Can";
import NewsListComponent from "./components/NewsListComponent";
import NewsUpdateComponent from "./components/NewsUpdateComponent";
import NewComponent from "./components/NewComponent";
import DashBoardFeedback from "./Navbar/DashBoardFeedBack";
import EmployeeDashBoard from "./components/EmployeeDashboard";
import DashBoardSale from "./Navbar/DashBoardSale";
import NewsListMobi from "./components/NewListMobi";
import DashBoardInvoice from "./Navbar/DashBoardInvoice";
import IncomeManagement from "./components/IncomeManagement";
import DrinksManagement from "./components/DrinksManagement";
import ResetPassword from "./component/auth/ResetPassword";
import AddDrinkComponent from "./components/AddDrinkComponent";
import {ToastContainer} from "react-toastify";
import PendingNewsList from "./components/NewsNeedApprove";
import EditDrinkPage from "./components/EditDrinkPage";
import OrderManagement from "./components/OrderManagement";
import CategoryManagement from "./components/CategoryManagement";
import EditCategoryPage from "./components/EditCategoryPage";
function App() {

    return (
        <HelmetProvider>
        <div className="App">
            <AbilityProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<EmployeeDashBoard/>}/>
                    <Route path="/manager/feedback" element={<DashBoardFeedback/>} />
                    <Route path="/manager/sale" element={<DashBoardSale/>}/>
                    <Route path="login" element={<Login/>}></Route>
                    <Route path="admin/register" element={<Register/>}></Route>
                    <Route path="admin/list" element={<EmployList/>}></Route>
                    <Route path="home" element={<CoffeeShop/>}></Route>
                    <Route path="/home/introduction" element={<AboutUs />} />
                    <Route path="/information" element={<AccountInfo />} />
                    <Route path="change_password" element={<ChangePassword/>}></Route>
                    <Route path="/verify" element={<ResetPassword />} />
                    <Route path="/news" element={<NewsListComponent />} />
                    <Route path="/news/create" element={<NewComponent />} />
                    <Route path="/news/edit/:id" element={<NewsUpdateComponent />} />
                    <Route path="/pending-news" element={<PendingNewsList />} />
                    <Route path="/home/news" element={<NewsListMobi/>}/>
                    <Route path="admin/menu" element={<DrinksManagement/>}/>
                    <Route path="/manager/invoice" element={<DashBoardInvoice/>} />
                    <Route path="/chart" element={<IncomeManagement/>}/>
                    <Route path="/drink/create" element={<AddDrinkComponent/>} />
                    <Route path = "/drink/edit/:id" element={<EditDrinkPage/>} />
                    <Route path="/order" element={<OrderManagement/>} />
                    <Route path="/category" element={<CategoryManagement />} />
                    <Route path="/category/create" element={<EditCategoryPage />} />
                    <Route path="/category/edit/:id" element={<EditCategoryPage />} />
                </Routes>
            </BrowserRouter>
            </AbilityProvider>
        </div>
            <ToastContainer/>
        </HelmetProvider>

    );
}

export default App;
