import './App.css';
import MenuComponent from "./components/MenuComponent";
import TableQRCodeList from "./components/TableQRCodeList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./components/EmployeeDashboard";
import FeedBackManagement from "./components/FeedBackManagement";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<EmployeeDashboard/>}/>
                    <Route path="/manager/feedback" element={<FeedBackManagement/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
