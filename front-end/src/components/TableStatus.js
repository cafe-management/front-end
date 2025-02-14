// TableStatus.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTableCoffee, updateTableCoffeeStatus } from "../service/TableCoffeeService";
import { Box, Typography } from "@mui/material";

const TableStatus = ({ onAllowedChange }) => {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get("tableId");
    const [tableMessage, setTableMessage] = useState("");
    const [tableLoading, setTableLoading] = useState(true);

    useEffect(() => {
        const updateTableStatus = async () => {
            if (tableId) {
                try {
                    const tables = await getTableCoffee();
                    const currentTable = tables.find((t) => t.id.toString() === tableId);

                    if (!currentTable) {
                        setTableMessage("Bàn không tồn tại!");
                        onAllowedChange(false);
                    } else if (currentTable.status === 1) {
                        setTableMessage("Bàn này đã có người sử dụng. Vui lòng chọn bàn khác!");
                        onAllowedChange(false);
                    } else {
                        await updateTableCoffeeStatus(tableId, { status: 1 });
                        setTableMessage("Chào mừng bạn, bạn đã vào bàn thành công!");
                        onAllowedChange(true);
                    }
                } catch (error) {
                    console.error(error);
                    setTableMessage("Có lỗi xảy ra khi cập nhật trạng thái bàn!");
                    onAllowedChange(false);
                } finally {
                    setTableLoading(false);
                }
            } else {
                setTableLoading(false);
            }
        };

        updateTableStatus();
    }, [tableId, onAllowedChange]);

    if (tableLoading) {
        return (
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                Đang tải...
            </Box>
        );
    }

    if (tableMessage && !tableMessage.includes("thành công")) {
        return (
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h6">{tableMessage}</Typography>
            </Box>
        );
    }

    // Nếu bàn hợp lệ, không cần hiển thị thông báo (hoặc bạn có thể hiển thị thông báo thành công nếu cần)
    return null;
};

export default TableStatus;
