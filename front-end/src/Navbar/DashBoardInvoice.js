import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Helmet} from "react-helmet-async";
import EmployeeDashboard from "../components/EmployeeDashboard";
import InvoiceComponent from "../components/InvoiceComponent";

const DashBoardInvoice = ()=>{
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
        <>
            <Helmet>
                <title>Hóa Đơn Khách Hàng</title>
            </Helmet>
            <EmployeeDashboard/>
            <InvoiceComponent/>
        </>
    );
}

export default DashBoardInvoice;