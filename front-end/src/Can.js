import React, { createContext, useContext, useEffect, useState } from "react";
import { defineAbilitiesFor} from "./ability";
import {Ability} from "@casl/ability"; // Đảm bảo import defineAbilitiesFor đúng

// Tạo Context cho Ability
export const AbilityContext = createContext({
    ability: new Ability([]),
    setCurrentAbility: () => {},
});

// Tạo một Context để lưu Ability
export const AbilityProvider = ({ children }) => {
    const [ability, setCurrentAbility] = useState(() => defineAbilitiesFor(localStorage.getItem("role") || ""));

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role) {
            setCurrentAbility(defineAbilitiesFor(role)); // Cập nhật quyền khi role thay đổi
        }
    }, []);

    return (
        <AbilityContext.Provider value={{ ability, setCurrentAbility }}>
            {children}
        </AbilityContext.Provider>
    );
};

// Hook để lấy ability trong component
export const useAbility = () => {
    return useContext(AbilityContext);
};
