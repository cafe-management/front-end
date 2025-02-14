import React from "react";
import { Container, Box, Typography, Grid, Card, CardMedia, Divider } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import coffeeInterior1 from "../../styles/img/intro/intro1.png";
import coffeeInterior2 from "../../styles/img/intro/intro2.jpg";
import coffeeInterior3 from "../../styles/img/intro/intro3.jpg";
import coffeeInterior4 from "../../styles/img/intro/intro5.jpg";
import staff1 from "../../styles/img/intro/staff1.webp";
import staff2 from "../../styles/img/intro/staff2.jpeg";

function AboutUs() {
    return (
        <>
            <Header />
            <Container sx={{ mt: 5, pb: 10 }}>
                {/* Tiêu đề chính */}
                <Box textAlign="center" mb={4}>
                    <Typography variant="h4" color="#E7B45A" fontWeight="bold">
                        GIỚI THIỆU VỀ DANA COFFEE
                    </Typography>
                    <Divider sx={{ width: "50px", height: "4px", backgroundColor: "#E7B45A", mx: "auto", mt: 1 }} />
                </Box>

                {/* Giới thiệu chung */}
                <Typography variant="body1" align="center" paragraph fontStyle="italic">
                    Chào mừng bạn đến với <Typography component="span" fontWeight="bold">Dana Coffee</Typography> – nơi hội tụ
                    tinh hoa cà phê Việt. Chúng tôi cam kết mang đến những ly cà phê đậm đà, kết hợp với không gian ấm cúng
                    và phong cách phục vụ tận tâm. Hãy ghé thăm Dana Coffee để tận hưởng những phút giây thư giãn tuyệt vời.
                </Typography>

                {/* Hình ảnh không gian quán + mô tả */}
                <Box textAlign="center" mt={5} mb={3}>
                    <Typography variant="h5" color="#E7B45A" fontWeight="bold">
                        Không Gian Quán
                    </Typography>
                    <Divider sx={{ width: "40px", height: "3px", backgroundColor: "#E7B45A", mx: "auto", mt: 1, mb: 3 }} />
                    <Typography variant="body1" align="center" paragraph>
                        Dana Coffee mang đến một không gian ấm cúng với thiết kế hiện đại pha lẫn phong cách vintage.
                        Đây là nơi lý tưởng để bạn thư giãn, làm việc hay gặp gỡ bạn bè, tận hưởng ly cà phê nguyên chất
                        cùng giai điệu nhẹ nhàng.
                    </Typography>
                </Box>
                <Grid container spacing={2} justifyContent="center">
                    {[coffeeInterior1, coffeeInterior2, coffeeInterior3, coffeeInterior4].map((imgSrc, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                                <CardMedia component="img" height="160" image={imgSrc} alt={`Interior ${i}`} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Đội ngũ nhân viên + dịch vụ */}
                <Box textAlign="center" mt={6} mb={3}>
                    <Typography variant="h5" color="#E7B45A" fontWeight="bold">
                        Đội Ngũ Nhân Viên & Dịch Vụ
                    </Typography>
                    <Divider sx={{ width: "40px", height: "3px", backgroundColor: "#E7B45A", mx: "auto", mt: 1, mb: 3 }} />
                    <Typography variant="body1" align="center" paragraph>
                        Đội ngũ nhân viên tại Dana Coffee luôn thân thiện, chuyên nghiệp và sẵn sàng phục vụ khách hàng tận tâm.
                        Chúng tôi cam kết mang đến trải nghiệm tốt nhất với chất lượng phục vụ hàng đầu.
                    </Typography>
                </Box>
                <Grid container spacing={2} justifyContent="center">
                    {[staff1, staff2].map((imgSrc, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                                <CardMedia component="img" height="160" image={imgSrc} alt={`Staff ${i}`} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Thông tin liên hệ */}
                <Box textAlign="center" mt={6}>
                    <Typography variant="h5" color="#E7B45A" fontWeight="bold">
                        Liên Hệ
                    </Typography>
                    <Divider sx={{ width: "40px", height: "3px", backgroundColor: "#E7B45A", mx: "auto", mt: 1, mb: 3 }} />
                    <Typography variant="body1" paragraph>
                        📍 <b>Địa chỉ:</b> 123 Đường Trần Phú, Đà Nẵng
                    </Typography>
                    <Typography variant="body1" paragraph>
                        📞 <b>Điện thoại:</b> 0364 773 446
                    </Typography>
                    <Typography variant="body1" paragraph>
                        🕒 <b>Giờ mở cửa:</b> 07:00 - 22:00
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </>
    );
}

export default AboutUs;
