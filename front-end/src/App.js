import './App.css';
import MenuComponent from "./components/MenuComponent";
import TableQRCodeList from "./components/TableQRCodeList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./components/EmployeeDashboard";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                    <Route path="/dashboard" element={<EmployeeDashboard/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
