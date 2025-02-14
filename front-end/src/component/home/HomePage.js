import React, {useEffect, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {Container, Box, Paper, Fab, Badge, Snackbar, Alert, Slider, Breadcrumbs, Link} from '@mui/material';
import { Grid, Card, CardMedia, CardContent, Button, IconButton, Typography } from '@mui/material';
import {ArrowBackIos, ArrowForwardIos, CheckCircle, Facebook, Phone, ShoppingCart} from '@mui/icons-material';
import Header from "./Header";
import Footer from "./Footer";
import ZaloIcon from "../../styles/img/zalo-icon.png";
import coffee1 from '../../styles/img/home/images1.jpeg';
import coffee2 from '../../styles/img/home/images2.jpeg';
import coffee3 from '../../styles/img/home/images3.jpeg';
import coffee4 from '../../styles/img/home/images4.jpg';
import * as feedbackService from "../../service/FeedbackService";
import  {TopProduct, createCartItem} from "../../service/CartItemService";
import {useLocation} from "react-router-dom";

function CoffeeShop() {
    const [index, setIndex] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackIndex, setFeedbackIndex] = useState(0);
    const [topDrinks, setTopDrinks] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const itemsToShow = 2;
    const feedbackShow = 2;
    const location = useLocation();
    useEffect(() => {
        getAll();
        fetchTopSellingDrinks();
    }, []);
    const fetchTopSellingDrinks = async () => {
        try {
            let data = await TopProduct();
            setTopDrinks(data);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu món bán chạy");
        }
    };
    const handleNext = () => {
        const maxIndex = Math.max(topDrinks.length - itemsToShow, 0);
        if (index + itemsToShow < topDrinks.length) {
            setIndex(index + itemsToShow);
        } else {
            setIndex(maxIndex);
        }
    };

    const handlePrev = () => {
        if (index - itemsToShow >= 0) {
            setIndex(index - itemsToShow);
        } else {
            setIndex(0);
        }
    };

    const handleAddToCart = async (drink) => {
        const cartItem = {
            drink: { id: drink.id },
            quantity: 1,
            price: drink.price,
        };

        try {
            const response = await createCartItem(cartItem);
            console.log("Đã thêm sản phẩm vào giỏ hàng:", response);
            setCart((prevCart) => [...prevCart, cartItem]);
            setCartCount((prev) => prev + 1);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
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
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };
    return (
        <>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>
                <Header/>

            </Box>
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
                    {[coffee1, coffee2, coffee3, coffee4].map((imgSrc, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <Card>
                                <CardMedia component="img" height="140" image={imgSrc} alt={`Coffee ${i}`} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box textAlign="center" mt={4}>
                    <Typography
                        variant="h4"
                        color="#E7B45A"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            borderBottom: "3px solid #E7B45A",
                            display: "inline-block",
                            pb: 1,
                            mb: 2
                        }}
                    >
                        Món Nổi Bật
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
                            {topDrinks.slice(index, index + itemsToShow).map((drink, i) => (
                                <Card key={i}
                                      sx={{
                                          width: { xs: "90%", sm: "45%", md: "30%" },
                                          flexShrink: 0,
                                          borderRadius: 2,
                                          boxShadow: 3,
                                          transition: "transform 0.3s ease-in-out",
                                          "&:hover": { transform: "scale(1.05)" }
                                      }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={drink.imgDrinks || "https://via.placeholder.com/150"} // Nếu không có ảnh, dùng ảnh mặc định
                                        alt={drink.nameDrinks}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4/3",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                                            {drink.drinkName}
                                        </Typography>
                                        <Typography color="#E7B45A" fontWeight="bold">
                                            {drink.price ? formatCurrency(drink.price) : "Liên hệ"}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#E7B45A", mt: 1,
                                                fontSize: { xs: "0.75rem", md: "1rem" }
                                            }}
                                            onClick={()=> handleAddToCart(drink)}
                                        >
                                            Đặt ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                        <IconButton onClick={handleNext} disabled={index + itemsToShow >= topDrinks.length} sx={{ color: "#E7B45A" }}>
                            <ArrowForwardIos />
                        </IconButton>
                    </Box>
                </Box>
                {/* Phản hồi */}
                <Paper elevation={3} sx={{ backgroundColor: "#333", color: "white", p: 4, mt: 4, borderRadius: 2 }}>
                    <Typography
                        variant="h5" // Giảm kích thước so với Món Nổi Bật
                        color="#E7B45A"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            fontStyle: "italic",
                            pb: 1,
                            mb: 2
                        }}
                    >
                        Khách Hàng Nói Gì
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
                <Box sx={{ position: 'fixed', bottom: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 1,  zIndex: 1000 }}>
                    <Fab color="primary" size="small" href="tel:0364773446">
                        <Phone />
                    </Fab>
                    <Fab
                        size="small"
                        href="https://zalo.me/0364773446"
                        sx={{ bgcolor: "#0088FF", color: "white", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Box component="img" src={ZaloIcon} alt="Zalo" sx={{ width: 24, height: 24, borderRadius: '50%' }} />
                    </Fab>
                    <Fab color="info" size="small" href="https://www.facebook.com/profile.php?id=61573004915840">
                        <Facebook />
                    </Fab>
                </Box>
            </Container>
            <Footer/>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    Đã thêm sản phẩm vào giỏ hàng!
                </Alert>
            </Snackbar>
            {/* Icon giỏ hàng */}
            {cart.length > 0 && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        zIndex: 1000,
                    }}
                >
                    <IconButton
                        color="white"
                        sx={{
                            backgroundColor: "#E7B45A",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                            "&:hover": { backgroundColor: "#D9A144" },
                        }}
                        onClick={() => {
                            // Chuyển hướng đến trang giỏ hàng hoặc mở dialog giỏ hàng
                            console.log("Chuyển đến trang giỏ hàng");
                        }}
                    >
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCart fontSize="large" sx={{ color: "white" }}/>
                        </Badge>
                    </IconButton>
                </Box>
            )}
        </>

    );
}
export default CoffeeShop;