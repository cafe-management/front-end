import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";

function Footer() {
    const socialLinks = [
        { text: "Twitter", href: "https://twitter.com" },
        { text: "Facebook", href: "https://www.facebook.com/profile.php?id=61573004915840" },
        { text: "Hỗ trợ", href: "/support" },
        { text: "Câu hỏi thường gặp", href: "/faq" }
    ];

    return (
        <Box
            id="footer"
            component="footer"
            sx={{
                bgcolor: "grey.900",
                color: "#E7B45A",
                py: { xs: 2, sm: 3 },
                mt: "auto",
                position: "relative",
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Công ty
                                </Typography>
                                <Box>
                                    {["Giới thiệu", "Cơ hội nghề nghiệp", "Trung tâm thương hiệu", "Blog"].map((text) => (
                                        <Link key={text} href="#" underline="hover" color="inherit" display="block" sx={{ mb: 0.5 }}>
                                            {text}
                                        </Link>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Trung tâm hỗ trợ
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
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Pháp lý
                                </Typography>
                                <Box>
                                    {["Chính sách bảo mật", "Giấy phép", "Điều khoản & Điều kiện", "Tuyên bố từ chối trách nhiệm"].map((text) => (
                                        <Link key={text} href="#" underline="hover" color="inherit" display="block" sx={{ mb: 0.5 }}>
                                            {text}
                                        </Link>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Liên hệ
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
                    © Bản quyền thuộc về{" "}
                    <Link
                        href="http://localhost:3000/home"
                        color="#E7B45A"
                        underline="hover"
                    >
                        DANA Coffee
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
