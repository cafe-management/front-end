import React, {useEffect, useState} from "react";
import {AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Box, Collapse, Link, Breadcrumbs} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import logo from "../../styles/img/dana_logo.PNG";
import {useLocation, useNavigate} from "react-router-dom";
import {getCategories} from "../../service/CategoryService";

function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    // const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
    // const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);
    const toggleMobileMenu = () => {
        setMobileOpen((prev) => {
            console.log("Toggling mobile menu. New state:", !prev);
            return !prev;
        });
    };
    const handleDrawerOpen = () => {
        setMobileOpen(true);
    };
    const toggleSubmenu = () => {
        setSubmenuOpen((prev) => {
            console.log("Toggling submenu. New state:", !prev);
            return !prev;
        });
    };
    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const data = await getCategories();
                console.log("Category", data);
                setCategories(data);
            }catch (error){
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);
    const location = useLocation();
    const breadcrumbs = [];
    if(location.pathname !== "/home"){
        breadcrumbs.push(
            <Link underline="hover" color="inherit" href="/home">
                Trang chủ
            </Link>
        );
        if(location.pathname.startsWith("/home/introduction")){
            breadcrumbs.push(
                <Typography key="introduction" sx={{color: "text.primary"}}>
                    Giới thiệu
                </Typography>
            );
        } else if(location.pathname.startsWith("/home/menu")){
            breadcrumbs.push(
                <Typography key="menu" sx={{color: "text.primary"}}>
                    Menu
                </Typography>
            );
        } else if(location.pathname.startsWith("/home/news")){
            breadcrumbs.push(
                <Typography key="news" sx={{color: "text.primary"}}>
                    Tin tức
                </Typography>
            )
        }
    }
    return (
        <>
        <AppBar position="fixed" sx={headerStyle}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{ height: 60, width: "auto" }}
                />

                {/* Menu for Desktop */}
                <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 3 }}>
                    <List sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3, padding: 0 }}>
                        <ListItem button sx={{ width: "auto", cursor: "pointer" }}>
                            <ListItemText primary="Trang chủ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button sx={{ width: "auto", cursor: "pointer" }}>
                            <ListItemText primary="Giới thiệu" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={toggleSubmenu} sx={{ width: "auto", cursor: "pointer" }}>
                            <ListItemText primary="Menu" sx={menuTextStyle} />
                            {submenuOpen ? <ExpandLessIcon sx={{ color: "#E7B45A" }} /> : <ExpandMoreIcon sx={{ color: "#E7B45A" }} />}
                        </ListItem>
                        <ListItem button sx={{ width: "auto", cursor: "pointer" }}>
                            <ListItemText primary="Tin tức" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={() => {
                            const footer = document.getElementById("footer");
                            if (footer) {
                                footer.scrollIntoView({ behavior: "smooth" });
                            }
                        }} sx={{ width: "auto", cursor: "pointer" }}>
                            <ListItemText primary="Liên hệ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                    </List>
                </Box>

                {/* Mobile Menu Button (Hamburger) */}
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
                    width: "100%",  // Full width for mobile menu
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "100%", // Drawer should take full width of screen
                        height: "100vh", // Full height of the screen
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                        boxSizing: "border-box", // Added this to prevent overflow
                    }
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <IconButton onClick={toggleMobileMenu} sx={{ alignSelf: "flex-end" }}>
                        <CloseIcon sx={{ color: "#E7B45A" }} />
                    </IconButton>
                    <List>
                        <ListItem button onClick={() => navigate('/home')}>
                            <ListItemText primary="Trang chủ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/home/introduction')}>
                            <ListItemText primary="Giới thiệu" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/home/menu')}>
                            <ListItemText primary="Menu" sx={menuTextStyle } />
                        </ListItem>
                        {/* Tin tức and Liên hệ in the mobile menu */}
                        <ListItem button onClick={() => navigate('/home/news')}>
                            <ListItemText primary="Tin tức" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={() => {
                            handleDrawerClose(); // Đóng menu trên mobile
                            setTimeout(() => { // Đợi Drawer đóng rồi mới cuộn mượt
                                const footer = document.getElementById("footer");
                                if (footer) {
                                    footer.scrollIntoView({ behavior: "smooth" });
                                }
                            }, 300);
                        }}>
                            <ListItemText primary="Liên hệ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

        </AppBar>
    {breadcrumbs.length > 0 && (
        <Box sx={{ marginTop: "100px",  marginBottom: "5px", paddingLeft: "20px"}}>
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
    width: "100%", // Ensure AppBar spans the full width
    boxSizing: "border-box", // Prevents any overflow issues
};

const menuTextStyle = {
    fontWeight: "500",
    color: "#E7B45A",
    textTransform: 'uppercase', // Make sure text is in uppercase
};

// Updated categoryStyle for bold
const categoryStyle = {
    fontWeight: "bold", // Directly apply bold for category titles
    color: "#E7B45A",
    borderBottom: "2px solid #E7B45A", // Add a line below each category
    paddingBottom: "8px", // Add space below the line
    marginBottom: "8px", // Space between the category and products
};

export default Header;