import './App.css';
import MenuComponent from "./components/MenuComponent";
import TableQRCodeList from "./components/TableQRCodeList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./components/EmployeeDashboard";
import FeedBackManagement from "./components/FeedBackManagement";
import SaleManagement from "./components/SaleManagement";
import {ToastContainer} from "react-toastify";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<EmployeeDashboard/>}/>
                    <Route path="/manager/feedback" element={<FeedBackManagement/>} />
                    <Route path="/manager/sale" element={<SaleManagement/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </div>
    );
}

export default App;
