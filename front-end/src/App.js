import './App.css';
import MenuComponent from "./components/MenuComponent";
import TableQRCodeList from "./components/TableQRCodeList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TableQRCodeList />} />
                    <Route path="/menu" element={<MenuComponent />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
