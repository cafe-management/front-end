import { AbilityBuilder, PureAbility  } from '@casl/ability';

export const defineAbilitiesFor = (role) => {
    const { can, rules } = new AbilityBuilder(PureAbility);  // Thay đổi ở đây, dùng PureAbility thay vì createMongoAbility

    if (role === "admin") {
        can("read", "employeeList");
        can("create", "employee");
    } else if (role === "employ") {
        can("read", "profile");
        can("update", "profile");
    }

    return new PureAbility(rules);  // Sử dụng PureAbility để trả về
};

export const ability = defineAbilitiesFor(localStorage.getItem("role") || "");  // Lấy role từ localStorage và xác định khả năng
