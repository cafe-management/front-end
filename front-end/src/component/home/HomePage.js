import React, {useEffect, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {Container, Box, Paper, Fab} from '@mui/material';
import { Grid, Card, CardMedia, CardContent, Button, IconButton, Typography } from '@mui/material';
import {ArrowBackIos, ArrowForwardIos, Chat, Facebook, Phone} from '@mui/icons-material';
import Header from "./Header";
import Footer from "./Footer";
import ZaloIcon from "../../styles/zalo-icon.png";
import {getAllFeedbacks} from "../../service/FeedbackService";
import * as feedbackService from "../../service/FeedbackService";

    const featuredDrinks = [
        { name: "Cà phê sữa", price: "50.000đ", image: "https://simexcodl.com.vn/wp-content/uploads/2024/05/ca-phe-sua-hat-1.jpg" },
        { name: "Trà sữa truyền thống", price: "45.000đ", image: "https://bizweb.dktcdn.net/100/421/036/files/cach-nau-tra-sua-truyen-thong-de-ban-2.jpg?v=1616644748197" },
        { name: "Trà Matcha Latte", price: "55.000đ", image: "https://cdn.tgdd.vn/2021/11/CookDish/cach-lam-matcha-latte-nong-thom-beo-cho-ngay-dong-them-am-ap-avt-1200x676-1.jpg" },
        { name: "Cococcino Recipe", price: "60.000đ", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWSpmhjjHexhF14eRcMYppjSWvpxNyB4_QWA&s" },
        { name: "Trà Olong Vải", price: "70.000đ", image: "https://kotavn.com/wp-content/uploads/2023/05/175449365_124635953031885_2116112830699819652_n-300x300.jpg" },
    ];

 function CoffeeShop() {
        const [index, setIndex] = useState(0);
        const [feedbacks, setFeedbacks] = useState([]);
        const [feedbackIndex, setFeedbackIndex] = useState(0);
        const [orderDetails, setOrderDetails] = useState([]);
        const itemsToShow = 2;
        const feedbackShow = 2;

     const handleNext = () => {
         if (index + itemsToShow < featuredDrinks.length) {
             setIndex(index + itemsToShow);
         } else {
             setIndex(featuredDrinks.length - 1); // Nếu còn 1 sản phẩm, chỉ hiển thị 1
         }
     };

     const handlePrev = () => {
         if (index - itemsToShow >= 0) {
             setIndex(index - itemsToShow);
         } else {
             setIndex(0);
         }
     };

     useEffect(() => {
         if (feedbacks.length > 0) {
             const interval = setInterval(() => {
                 setFeedbackIndex((prev) => (prev + feedbackShow) % feedbacks.length);
             }, 3000);
             return () => clearInterval(interval);
         }
     }, [feedbacks]);
     useEffect(() =>{
        getAll();
     }, []);
const getAll = async () => {
    try{
        let feedbacks = await feedbackService.getAllFeedbacks();
        setFeedbacks(feedbacks);
    }catch (error){
        toast.error(error.message);
    }
}
    return (
        <>
            <Header/>
            <Container sx={{ mt: 15, pb: 10}}>
                <Box display="flex" justifyContent="center">
                    <Typography variant="h4" color="#E7B45A" gutterBottom fontWeight="bold">
                        DANA COFFEE
                    </Typography>
                </Box>
                <Typography variant="body1" align="center" paragraph fontStyle="italic">
                    Nơi bạn có thể thưởng thức những ly cà phê đậm đà,
                    được pha chế từ những hạt cà phê nguyên chất, cùng những thức uống tinh tế như trà thanh mát
                    và bánh ngọt thơm lừng. Với không gian ấm cúng và phong cách phục vụ chu đáo,
                    <Typography component="span" fontWeight="bold"> DANA Coffee </Typography>  là lựa chọn lý tưởng để bạn thư giãn, làm việc hay
                    gặp gỡ bạn bè.
                </Typography>

                {/* Hình ảnh */}
                <Grid container spacing={2} justifyContent="center">
                    {[
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf_nZi1TPQHppfwDi5HCWShtEn0ymLL7kIpg&s",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU3x_pV41nv-cllaWuWoyWwhoFr3yCQrAV_g&s",
                        "https://highlandstationlouisville.com/wp-content/uploads/sites/93/2023/05/coffee-shop-near-our-apartments.jpeg",
                        "https://coffeeshopstartups.com/wp-content/uploads/2021/05/How-to-Make-Your-Cafe-Special-683x1024.jpg",
                    ].map((imgSrc, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <Card>
                                <CardMedia component="img" height="140" image={imgSrc} alt={`Coffee ${i}`} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box textAlign="center" mt={4}>
                    <Typography variant="h5" color="#E7B45A" gutterBottom>
                        Món nổi bật
                    </Typography>

                    <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
                        <IconButton onClick={handlePrev} disabled={index === 0} sx={{ color: "#E7B45A" }}>
                            <ArrowBackIos />
                        </IconButton>

                        {/* Danh sách món */}
                        <Box
                            sx={{
                                display: "flex",
                                overflow: "hidden",
                                width: "85%",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 2, // Tạo khoảng cách giữa các món
                            }}
                        >
                            {featuredDrinks.slice(index, index + itemsToShow).map((drink, i) => (
                                <Card key={i}
                                      sx={{
                                          width: { xs: "90%", sm: "45%", md: "30%" }, // Tự động thu hẹp trên các màn hình nhỏ
                                          flexShrink: 0,
                                          borderRadius: 2,
                                          boxShadow: 3,
                                          transition: "transform 0.3s ease-in-out",
                                          "&:hover": { transform: "scale(1.05)" }
                                      }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={drink.image}
                                        alt={drink.name}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4/3",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                                            {drink.name}
                                        </Typography>
                                        <Typography color="#E7B45A" fontWeight="bold">
                                            {drink.price}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#E7B45A", mt: 1,
                                                fontSize: { xs: "0.75rem", md: "1rem" } // Responsive text size
                                            }}
                                        >
                                            Đặt ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        <IconButton onClick={handleNext} disabled={index + itemsToShow >= featuredDrinks.length} sx={{ color: "#E7B45A" }}>
                            <ArrowForwardIos />
                        </IconButton>
                    </Box>
                </Box>
                {/* Phản hồi */}
                    <Paper elevation={3} sx={{ backgroundColor: "#333", color: "white", p: 4, mt: 4, borderRadius: 2 }}>
                        <Typography variant="h5" align="center" color="#E7B45A" gutterBottom>
                            Khách hàng nói gì
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            {feedbacks.slice(feedbackIndex, feedbackIndex + feedbackShow).map((fb, i) => (
                                <Grid item xs={12} sm={5} key={i}>
                                    <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 2, backgroundColor: "white", color: "black" }}>
                                        <Typography variant="body1" fontStyle="italic">"{fb.content}"</Typography>
                                        <Typography fontWeight="bold" mt={2}>{fb.customer?.nameCustomer || "Khách hàng ẩn danh"}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>


                <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1,  zIndex: 1000 }}>
                    <Fab color="primary" size="small" href="tel:0123456789">
                        <Phone />
                    </Fab>
                    <Fab
                        size="small"
                        href="https://zalo.me"
                        target="_blank"
                        sx={{ bgcolor: "#0088FF", color: "white", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Box component="img" src={ZaloIcon} alt="Zalo" sx={{ width: 24, height: 24, borderRadius: '50%' }} />
                    </Fab>
                    <Fab color="info" size="small" href="https://facebook.com">
                        <Facebook />
                    </Fab>
                </Box>
            </Container>
            <Footer/>
        </>

    );
}
export default CoffeeShop;


