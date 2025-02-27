import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const TableQRCode = ({ table }) => {
    const menuUrl = `http://10.10.8.75:3000/home?tableId=${table.id}`;

    return (
        <div style={{textAlign: "center", marginTop: "20px"}}>
            <h2>QR Code cho bàn {table.id}</h2>
            <QRCodeCanvas
                value={menuUrl}
                size={256}
                level="H"
                includeMargin={true}
            />
            <p>Quét mã để xem Menu</p>
            <p><i>Lưu ý: 1 thiết bị chỉ được đặt 1 bàn</i></p>
        </div>
    );
};

export default TableQRCode;
