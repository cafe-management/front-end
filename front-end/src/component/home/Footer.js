import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";

function Footer() {
    const socialLinks = [
        { text: "Twitter", href: "https://twitter.com" },
        { text: "Facebook", href: "https://www.facebook.com/profile.php?id=61573004915840" },
        { text: "Support", href: "/support" }, // Trang hỗ trợ nội bộ
        { text: "FAQ", href: "/faq" } // Trang câu hỏi thường gặp
    ];
    return (
        <Box id="footer"
            component="footer"
            sx={{
                bgcolor: "grey.900",
                color: "#E7B45A",
                py: { xs: 2, sm: 3 }, // Giảm chiều cao
                mt: "auto",
                position: "relative",
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {/* Cột 1: Company & Help Center */}
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            {/* Company */}
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Company
                                </Typography>
                                <Box>
                                    {["About", "Careers", "Brand Center", "Blog"].map((text) => (
                                        <Link key={text} href="#" underline="hover" color="inherit" display="block" sx={{ mb: 0.5 }}>
                                            {text}
                                        </Link>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Help Center */}
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Help Center
                                </Typography>
                                <Box>
                                    {socialLinks.map(({ text, href }) => (
                                        <Link
                                            key={text}
                                            href={href}
                                            underline="hover"
                                            color="inherit"
                                            display="block"
                                            sx={{ mb: 0.5 }}
                                        >
                                            {text}
                                        </Link>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Cột 2: Legal & Contact */}
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            {/* Legal */}
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Legal
                                </Typography>
                                <Box>
                                    {["Privacy Policy", "Licensing", "Terms & Conditions", "Disclaimer"].map((text) => (
                                        <Link key={text} href="#" underline="hover" color="inherit" display="block" sx={{ mb: 0.5 }}>
                                            {text}
                                        </Link>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Contact */}
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Contact
                                </Typography>
                                <Box>
                                    <Link href="mailto:danafinest@gmail.com" underline="hover" color="inherit" display="block" sx={{ mb: 0.5 }}>
                                        danafinest@gmail.com
                                    </Link>
                                    <Link href="tel:+84 364 773 446" underline="hover" color="inherit" display="block">
                                        +84 364 773 446
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{ bgcolor: "grey.700", my: 2 }} />
                <Typography variant="body2" color="white" align="center"
                            sx={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                    Chứng nhận{" "}
                    <Link
                        href="https://kmr.com.vn/dich-vu-chung-nhan-iso/chung-nhan-iso-kmr/chung-nhan-iso-9001-2015-kmr.html"
                        color="#E7B45A"
                        underline="hover"
                    >
                        ISO 9001:2015
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
