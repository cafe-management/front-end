import React, { useState, useEffect } from 'react';
import TableQRCode from "./TableQrCode";
import { getTableCoffee } from "../service/TableCoffeeService";

const TableQRCodeList = () => {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTableCoffee();
            setTables(data);
        };
        fetchData();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Danh sách QR Code cho các bàn</h1>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '20px'
                }}
            >
                {tables && tables.length > 0 ? (
                    tables.map((table) => (
                        <TableQRCode key={table.id} table={table} />
                    ))
                ) : (
                    <p>Không có dữ liệu bàn</p>
                )}
            </div>
        </div>
    );
};

export default TableQRCodeList;
