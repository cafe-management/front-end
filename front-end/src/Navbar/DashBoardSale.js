import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeDashboard from "../components/EmployeeDashboard";
import SaleManagement from "../components/SaleManagement";
import {Helmet} from "react-helmet-async";

const DashBoardSale = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            navigate("/login");
            return;
        }

        if (role !== "employ") {
            navigate("/login");
            return;
        }
    }, [navigate]);

    return (
        <div>
            <Helmet>
                <title>Phản hồi khách hàng</title>
            </Helmet>
            <EmployeeDashboard />
            <SaleManagement />
        </div>
    );
};

export default DashBoardSale;
