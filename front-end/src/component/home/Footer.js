import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";

function Footer() {
    return (
        <Box
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
                                    {["Twitter", "Facebook", "Support", "FAQ"].map((text) => (
                                        <Link key={text} href="#" underline="hover" color="inherit" display="block" sx={{ mb: 0.5 }}>
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
                                    <Link href="tel:+1234567890" underline="hover" color="inherit" display="block">
                                        +123 456 7890
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Divider & Copyright */}
                <Divider sx={{ bgcolor: "grey.700", my: 2 }} />
                <Typography variant="body2" color="white" align="center">
                    © 2023{" "}
                    <Link href="https://flowbite.com/" color="#E7B45A" underline="hover">
                        Flowbite™
                    </Link>
                    . All Rights Reserved.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
