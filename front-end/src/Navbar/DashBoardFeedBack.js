import FeedBackManagement from "../components/FeedBackManagement";
import EmployeeDashboard from "../components/EmployeeDashboard";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Helmet} from "react-helmet-async";

const DashBoardFeedback = () => {
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
                <title>Phản hồi khách hàng</title>
            </Helmet>
            <EmployeeDashboard/>
            <FeedBackManagement />
        </>
    );
};

export default DashBoardFeedback;