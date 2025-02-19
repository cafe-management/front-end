    import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Link,
    Breadcrumbs,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../styles/img/dana_logo.PNG";
import { useLocation, useNavigate } from "react-router-dom";

function Header({ tableId }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setMobileOpen((prev) => !prev);
    };
    const handleDrawerClose = () => {
        setMobileOpen(false);
    };
    const location = useLocation();
    const breadcrumbs = [];

    // Xử lý breadcrumbs
    if (location.pathname !== `/home?tableId=${tableId}`) {
        breadcrumbs.push(
            <Link underline="hover" color="inherit" key="home" onClick={() => navigate(`/home?tableId=${tableId}`)}>
                Trang chủ
            </Link>
        );

        if (location.pathname.startsWith(`/home/introduction`)) {
            breadcrumbs.push(
                <Typography key="introduction" sx={{ color: "text.primary" }}>
                    Giới thiệu
                </Typography>
            );
        } else if (location.pathname.startsWith(`/menu`)) {
            breadcrumbs.push(
                <Typography key="menu" sx={{ color: "text.primary" }}>
                    Menu
                </Typography>
            );
        } else if (location.pathname.startsWith("/news")) {
            breadcrumbs.push(
                <Typography key="news" sx={{ color: "text.primary" }}>
                    Tin tức
                </Typography>
            );
        }
    }
    const handleNavigateMenu = () => {
        if (tableId) {
            navigate(`/menu?tableId=${tableId}`);
        } else {
            navigate("/menu");
        }
    };
    return (
        <>
            <AppBar position="fixed" sx={headerStyle}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{ height: 60, width: "auto", cursor: "pointer" }}
                        onClick={() => navigate(`/home?tableId=${tableId}`)}
                    />
                    {/* Menu cho Desktop */}
                    <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 3 }}>
                        <List sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3, padding: 0 }}>
                            <ListItem
                                button
                                sx={{ width: "auto", cursor: "pointer" }}
                                onClick={() => navigate(`/home?tableId=${tableId}`)}
                            >
                                <ListItemText primary="Trang chủ" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem button sx={{ width: "auto", cursor: "pointer" }} onClick={() => navigate(`/home/introduction?tableId=${tableId}`)}>
                                <ListItemText primary="Giới thiệu" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem button sx={{ width: "auto", cursor: "pointer" }} onClick={handleNavigateMenu}>
                                <ListItemText primary="Menu" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem button sx={{ width: "auto", cursor: "pointer" }} onClick={() => navigate(`/home/news?tableId=${tableId}`)}>
                                <ListItemText primary="Tin tức" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem
                                button
                                sx={{ width: "auto", cursor: "pointer" }}
                                onClick={() => {
                                    const footer = document.getElementById("footer");
                                    if (footer) {
                                        footer.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                            >
                                <ListItemText primary="Liên hệ" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                        </List>
                    </Box>
                    <IconButton edge="end" onClick={toggleMobileMenu} sx={{ display: { lg: "none" } }}>
                        <MenuIcon sx={{ color: "#E7B45A" }} />
                    </IconButton>
                </Toolbar>
                {/* Mobile Menu (Drawer) */}
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={toggleMobileMenu}
                    sx={{
                        width: "50%",
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: "50%",
                            height: "100vh",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#ffffff",
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <IconButton onClick={toggleMobileMenu} sx={{ alignSelf: "flex-end" }}>
                            <CloseIcon sx={{ color: "#E7B45A" }} />
                        </IconButton>
                        <List>
                            <ListItem button onClick={() => navigate(`/home?tableId=${tableId}`)}>
                                <ListItemText primary="Trang chủ" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem button onClick={() => navigate(`/home/introduction?tableId=${tableId}`)}>
                                <ListItemText primary="Giới thiệu" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem button onClick={() => navigate(`/menu?tableId=${tableId}`)}>
                                <ListItemText primary="Menu" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem button onClick={() => navigate(`/home/news?tableId=${tableId}`)}>
                                <ListItemText primary="Tin tức" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => {
                                    handleDrawerClose();
                                    setTimeout(() => {
                                        const footer = document.getElementById("footer");
                                        if (footer) {
                                            footer.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }, 300);
                                }}
                            >
                                <ListItemText primary="Liên hệ" sx={{ ...menuTextStyle, textTransform: "uppercase" }} />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            </AppBar>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <Box sx={{ marginTop: "80px", marginBottom: "8px", paddingLeft: "20px" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Box>
            )}
        </>
    );
}

/* STYLES */
const headerStyle = {
    backgroundColor: "#ffffff",
    padding: "10px 20px",
    borderBottom: "3px solid #E7B45A",
    boxShadow: "none",
    width: "100%",
    boxSizing: "border-box",
};

const menuTextStyle = {
    fontWeight: "500",
    color: "#E7B45A",
    textTransform: "uppercase",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        fontWeight: "bold",
        color: "#d19544",
        borderBottom: "2px solid #d19544",
    },
};

export default Header;
