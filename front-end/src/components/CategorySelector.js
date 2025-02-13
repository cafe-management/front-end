// CategorySelector.jsx
import { useEffect, useState } from "react";
import { getCategories } from "../service/CategoryService";
import { Button, Stack, Typography, Container } from "@mui/material";

const CategorySelector = ({ activeCategory, setActiveCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                const categoriesWithAll = [{ id: "all", nameCategory: "Tất Cả" }, ...response];
                setCategories(categoriesWithAll);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Thiết lập danh mục mặc định khi đã có dữ liệu
    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory, setActiveCategory]);

    return (
        <Container maxWidth="md">
            <Typography
                variant="h6"
                component="h2"
                sx={{
                    mb: { xs: 1, sm: 2 },
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    textAlign: "left",
                }}
            >
                Chọn Danh Mục
            </Typography>
            <Stack
                direction="row"
                spacing={{ xs: 1, sm: 2 }}
                sx={{
                    overflowX: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {categories.map((category, index) => {
                    const isActive =
                        activeCategory?.id === category.id || (!activeCategory && index === 0);
                    return (
                        <Button
                            key={category.id}
                            onClick={() => setActiveCategory(category)}
                            sx={{
                                borderRadius: "50px",
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                px: { xs: 1, sm: 1.5 },
                                py: { xs: 0.5, sm: 1 },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                backgroundColor: isActive ? "#E7B45A" : "rgba(231,180,90,0.3)",
                                color: isActive ? "#fff" : "#E7B45A",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: isActive ? "#d6a24e" : "rgba(231,180,90,0.5)",
                                },
                            }}
                        >
                            {category.nameCategory}
                        </Button>
                    );
                })}
            </Stack>
        </Container>
    );
};

export default CategorySelector;
