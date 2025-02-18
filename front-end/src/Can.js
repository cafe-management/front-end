import React, { createContext, useContext, useEffect, useState } from "react";
import { defineAbilitiesFor } from "./ability"; // Đảm bảo import defineAbilitiesFor đúng

// Tạo Context cho Ability
export const AbilityContext = createContext();

// Tạo một Context để lưu Ability
export const AbilityProvider = ({ children }) => {
    const [currentAbility, setCurrentAbility] = useState(defineAbilitiesFor(localStorage.getItem("role") || ""));

    useEffect(() => {
        const role = localStorage.getItem("role");  // Lấy role từ localStorage
        setCurrentAbility(defineAbilitiesFor(role));  // Cập nhật quyền hạn mỗi khi role thay đổi
    }, []);

    return (
        <AbilityContext.Provider value={{ currentAbility, setCurrentAbility }}>
            {children}
        </AbilityContext.Provider>
    );
};

// Hook để lấy ability trong component
export const useAbility = () => {
    return useContext(AbilityContext);
};
