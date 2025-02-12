import { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Box, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import logo from "../../styles/dana_logo.PNG";

function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
    const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);

    return (
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
                    <List sx={{ display: "flex", gap: 3 }}>
                        <ListItem button>
                            <ListItemText primary="Trang chủ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Giới thiệu" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>

                        {/* Dropdown Menu for Drinks */}
                        <ListItem button onClick={toggleSubmenu}>
                            <ListItemText primary="Menu" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                            {submenuOpen ? <ExpandLessIcon sx={{ color: "#E7B45A" }} /> : <ExpandMoreIcon sx={{ color: "#E7B45A" }} />}
                        </ListItem>
                        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
                            <Box sx={{ paddingLeft: 4 }}>
                                {/* Trà */}
                                <ListItem sx={{ ...categoryStyle, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    <ListItemText primary="Trà" sx={{ color: "#E7B45A" }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Trà Olong Vải" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>

                                {/* Trà Sữa */}
                                <ListItem sx={{ ...categoryStyle, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    <ListItemText primary="Trà Sữa" sx={{ color: "#E7B45A" }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Trà sữa truyền thống" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>

                                {/* Cà Phê */}
                                <ListItem sx={{ ...categoryStyle, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    <ListItemText primary="Cà Phê" sx={{ color: "#E7B45A" }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Cococcino Recipe" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Cocoapresso" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>
                            </Box>
                        </Collapse>

                        {/* Direct Menu Items for Mobile */}
                        <ListItem button>
                            <ListItemText primary="Tin tức" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button>
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
                        <ListItem button onClick={toggleMobileMenu}>
                            <ListItemText primary="Trang chủ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={toggleMobileMenu}>
                            <ListItemText primary="Giới thiệu" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>

                        {/* Dropdown trong Mobile */}
                        <ListItem button onClick={toggleSubmenu}>
                            <ListItemText primary="Menu" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                            {submenuOpen ? <ExpandLessIcon sx={{ color: "#E7B45A" }} /> : <ExpandMoreIcon sx={{ color: "#E7B45A" }} />}
                        </ListItem>
                        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
                            <Box sx={{ paddingLeft: 4 }}>
                                {/* Trà */}
                                <ListItem sx={{ ...categoryStyle, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    <ListItemText primary="Trà" sx={{ color: "#E7B45A" }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Trà Olong Vải" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>

                                {/* Trà Sữa */}
                                <ListItem sx={{ ...categoryStyle, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    <ListItemText primary="Trà Sữa" sx={{ color: "#E7B45A" }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Trà sữa truyền thống" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>

                                {/* Cà Phê */}
                                <ListItem sx={{ ...categoryStyle, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    <ListItemText primary="Cà Phê" sx={{ color: "#E7B45A" }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Cococcino Recipe" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Cocoapresso" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                                </ListItem>
                            </Box>
                        </Collapse>

                        {/* Tin tức and Liên hệ in the mobile menu */}
                        <ListItem button onClick={toggleMobileMenu}>
                            <ListItemText primary="Tin tức" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                        <ListItem button onClick={toggleMobileMenu}>
                            <ListItemText primary="Liên hệ" sx={{ ...menuTextStyle, textTransform: 'uppercase' }} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </AppBar>
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
