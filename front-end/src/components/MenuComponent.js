// MenuComponent.jsx
import { useState } from "react";
import { AppBar, Box, Container,Toolbar, Typography } from "@mui/material";
import CategorySelector from "./CategorySelector";
import DrinkList from "./DrinkList";
import TableStatus from "./TableStatus";

const MenuComponent = () => {
    const [allowed, setAllowed] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);

    return (
        <Box
            sx={{
                backgroundColor: "#f3f4f6",
                minHeight: "100vh",
                fontFamily: "sans-serif",
            }}
        >
            <AppBar
                position="static"
                elevation={3}
                sx={{ backgroundColor: "#fff", color: "#000" }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <Container maxWidth="md">
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                flexGrow: 1,
                                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                            }}
                        >
                            Menu
                        </Typography>
                    </Container>
                </Toolbar>
            </AppBar>

            {/* Kiểm tra trạng thái bàn */}
            <TableStatus onAllowedChange={setAllowed} />

            {/* Nếu bàn không hợp lệ thì không render phần còn lại */}
            {allowed && (
                <>
                    <Box
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 50,
                            mb: { xs: 3, sm: 6 },
                            backgroundColor: "#fff",
                            pt: { xs: 2, sm: 3 },
                            pb: { xs: 2, sm: 3 },
                            px: { xs: 2, sm: 3 },
                        }}
                    >
                        <CategorySelector activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                    </Box>
                    {activeCategory && <DrinkList activeCategory={activeCategory} />}
                </>
            )}
        </Box>
    );
};

export default MenuComponent;
