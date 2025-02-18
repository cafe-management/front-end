import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
    Container,
    Box,
    Paper,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Typography,
    Fab,
    Chip,
} from "@mui/material";
import { Facebook, Phone } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import Header from "./Header";
import Footer from "./Footer";
import ZaloIcon from "../../styles/img/zalo-icon.png";
import coffee1 from "../../styles/img/home/images1.jpeg";
import coffee2 from "../../styles/img/home/images2.jpeg";
import coffee3 from "../../styles/img/home/images3.jpeg";
import coffee4 from "../../styles/img/home/images4.jpg";
import * as feedbackService from "../../service/FeedBackService";
import { getTopProducts } from "../../service/CartItemService";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getCloudinaryImageUrl } from "../../service/CloudinaryService";

function CoffeeShop() {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get("tableId");

    const navigate = useNavigate();

    const [feedbacks, setFeedbacks] = useState([]);
    const [topDrinks, setTopDrinks] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);
    const [showTotal, setShowTotal] = useState(false);

    // Lấy món bán chạy
    const fetchTopSellingDrinks = async () => {
        try {
            const data = await getTopProducts(4);
            setTopDrinks(data);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu món bán chạy");
        }
    };

    // Lấy phản hồi khách hàng
    const fetchFeedbacks = async () => {
        try {
            const fbData = await feedbackService.getFeedback();
            setFeedbacks(fbData);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchTopSellingDrinks();
        fetchFeedbacks();
        setShowTotal(true);
    }, []);

    // Định dạng giá
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Hàm load thêm món nổi bật
    const handleLoadMore = useCallback(() => {
        setVisibleCount((prev) => prev + 4);
    }, []);

    return (
        <>
            <Helmet>
                <title>DANA COFFEE - Trang Chủ</title>
            </Helmet>

            {/* Header cố định */}
            <Box sx={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>
                <Header tableId={tableId} />
            </Box>

            {/* Nội dung chính */}
            <Container sx={{ mt: 10, pb: 6 }}>
                <Box display="flex" justifyContent="center">
                    <Typography variant="h4" color="#E7B45A" gutterBottom fontWeight="bold">
                        DANA COFFEE
                    </Typography>
                </Box>
                <Typography variant="body1" align="center" paragraph fontStyle="italic">
                    Nơi bạn có thể thưởng thức những ly cà phê đậm đà, được pha chế từ những hạt cà phê nguyên chất,
                    cùng những thức uống tinh tế như trà thanh mát và bánh ngọt thơm lừng. Với không gian ấm cúng và
                    phong cách phục vụ chu đáo,{" "}
                    <Typography component="span" fontWeight="bold">
                        DANA Coffee
                    </Typography>{" "}
                    là lựa chọn lý tưởng để bạn thư giãn, làm việc hay gặp gỡ bạn bè.
                </Typography>

                {/* Hình ảnh giới thiệu */}
                <Grid container spacing={2} justifyContent="center">
                    {[coffee1, coffee2, coffee3, coffee4].map((imgSrc, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={imgSrc}
                                    alt={`Coffee ${i}`}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Món nổi bật */}
                <Box textAlign="center" mt={4}>
                    <Typography
                        variant="h4"
                        color="#E7B45A"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            borderBottom: "3px solid #E7B45A",
                            display: "inline-block",
                            pb: 1,
                            mb: 2,
                        }}
                    >
                        Món Nổi Bật
                    </Typography>
                    <Container maxWidth="lg">
                        {topDrinks.length > 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {topDrinks.slice(0, visibleCount).map((item) => {
                                        const { drink } = item;
                                        return (
                                            <Grid item key={drink.id} xs={6} sm={6} md={4} lg={3}>
                                                <Card>
                                                    <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                                                        <Box sx={{ position: "relative" }}>
                                                            {/* Hiển thị nhãn "Best Seller" luôn luôn */}
                                                            <Chip
                                                                label="Best Seller"
                                                                color="secondary"
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 8,
                                                                    left: 8,
                                                                    zIndex: 1,
                                                                    fontWeight: "bold",
                                                                    transform: "rotate(-10deg)",
                                                                }}
                                                            />
                                                            {/* Ảnh sản phẩm */}
                                                            <img
                                                                src={getCloudinaryImageUrl(drink.imgDrinks, {
                                                                    width: 300,
                                                                    height: 300,
                                                                    crop: "fill",
                                                                })}
                                                                alt={drink.nameDrinks}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "auto",
                                                                    display: "block",
                                                                    borderRadius: "4px",
                                                                }}
                                                            />
                                                            {/* Nút dấu + ở góc trên bên phải */}
                                                            <IconButton
                                                                color="primary"
                                                                aria-label="Thêm vào giỏ hàng"
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 8,
                                                                    right: 8,
                                                                    backgroundColor: "rgba(255,255,255,0.8)",
                                                                    "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                                                                }}
                                                                onClick={() => handleAddToCart(drink)}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>

                                                        {/* Tên món và giá giống Menu */}
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: "bold",
                                                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                                                mt: 1,
                                                            }}
                                                        >
                                                            {drink.nameDrinks}
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                                        >
                                                            {formatPrice(drink.price)}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>

                                {/* Nút Xem thêm và Xem tất cả */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
                                    {/* Chỉ hiển thị "Xem thêm" nếu còn món */}
                                    {visibleCount < topDrinks.length && (
                                        <Button variant="contained" onClick={handleLoadMore}>
                                            Xem thêm
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/menu?tableId=${tableId}`)}
                                    >
                                        Xem tất cả
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                                Không có sản phẩm nổi bật nào
                            </Typography>
                        )}
                    </Container>
                </Box>

                {/* Phản hồi khách hàng */}
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: "#333",
                        color: "white",
                        p: 4,
                        mt: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        color="#E7B45A"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            fontStyle: "italic",
                            pb: 1,
                            mb: 2,
                        }}
                    >
                        Khách Hàng Nói Gì
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {feedbacks.slice(0, 2).map((fb, i) => (
                            <Grid item xs={12} sm={5} key={i}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        textAlign: "center",
                                        borderRadius: 2,
                                        backgroundColor: "white",
                                        color: "black",
                                    }}
                                >
                                    <Typography variant="body1" fontStyle="italic">
                                        "{fb.content}"
                                    </Typography>
                                    <Typography fontWeight="bold" mt={2}>
                                        {fb.customer?.nameCustomer || "Khách hàng ẩn danh"}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* FAB liên hệ */}
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        left: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        zIndex: 1000,
                    }}
                >
                    <Fab color="primary" size="small" href="tel:0364773446">
                        <Phone />
                    </Fab>
                    <Fab
                        size="small"
                        href="https://zalo.me/0364773446"
                        sx={{
                            bgcolor: "#0088FF",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={ZaloIcon}
                            alt="Zalo"
                            sx={{ width: 24, height: 24, borderRadius: "50%" }}
                        />
                    </Fab>
                    <Fab color="info" size="small" href="https://www.facebook.com/profile.php?id=61573004915840">
                        <Facebook />
                    </Fab>
                </Box>
            </Container>

            {/* Footer */}
            <Footer />
        </>
    );
}

export default CoffeeShop;
