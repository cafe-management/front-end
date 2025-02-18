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
    Grow, Badge, IconButton,
} from "@mui/material";
import {ChevronLeft, ChevronRight, Facebook, Phone, ShoppingCart} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import CartModal from "../../components/CartModal";

function CoffeeShop() {
    // Lấy tableId từ URL nếu cần dùng
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get("tableId");

    const [feedbacks, setFeedbacks] = useState([]);
    // Lưu dữ liệu gốc (bao gồm drink và totalQuantity)
    const [topDrinks, setTopDrinks] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    // State để kích hoạt hiệu ứng Grow
    const [showTotal, setShowTotal] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Lấy món bán chạy từ API
    const fetchTopSellingDrinks = async () => {
        try {
            const data = await getTopProducts(5);
            setTopDrinks(data);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu món bán chạy");
        }
    };

    // Lấy phản hồi khách hàng từ API
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
        // Để đảm bảo hiệu ứng chạy sau khi component mount
        setShowTotal(true);
    }, []);

    const ArrowButton = ({ direction, onClick }) => {
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    top: "50%",
                    [direction === "right" ? "right" : "left"]: 10,
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
            >
                {direction === "right" ? <ChevronRight sx={{ color: "white" }} /> : <ChevronLeft sx={{ color: "white" }} />}
            </IconButton>
        );
    };
    const adjustQuantity = (itemId, quantityChange) => {
        setCartItems((prev) => {
            return prev.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + quantityChange } : item
            );
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
    };

    // Tính tổng tiền giỏ hàng
    const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Hiển thị giỏ hàng khi nhấn vào icon
    const handleOrderNow = (drink) => {
        setCartCount((prev) => prev + 1);
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === drink.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prev, { ...drink, quantity: 1 }];
            }
        });

        toast.success(`${drink.nameDrinks} đã được thêm vào giỏ hàng!`);
        setShowCart(true);
    };
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        centerPadding: "20px",
        responsive: [
            {
                breakpoint: 768, // Dưới 768px chỉ hiển thị 1 feedback
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <>
            <Helmet>
                <title>DANA COFFEE - Trang Chủ</title>
            </Helmet>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>
                <Header />
            </Box>
            <Container sx={{ mt: 15, pb: 10 }}>
                <Box display="flex" justifyContent="center">
                    <Typography variant="h4" color="#E7B45A" gutterBottom fontWeight="bold">
                        DANA COFFEE
                    </Typography>
                </Box>
                <Typography variant="body1" align="center" paragraph fontStyle="italic">
                    Nơi bạn có thể thưởng thức những ly cà phê đậm đà, được pha chế từ những hạt cà phê nguyên chất,
                    cùng những thức uống tinh tế như trà thanh mát và bánh ngọt thơm lừng. Với không gian ấm cúng và phong
                    cách phục vụ chu đáo,{" "}
                    <Typography component="span" fontWeight="bold">
                        DANA Coffee
                    </Typography>{" "}
                    là lựa chọn lý tưởng để bạn thư giãn, làm việc hay gặp gỡ bạn bè.
                </Typography>
                {/* Phần hiển thị ảnh giới thiệu */}
                <Grid container spacing={2} justifyContent="center">
                    {[coffee1, coffee2, coffee3, coffee4].map((imgSrc, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <Card>
                                <CardMedia component="img" height="140" image={imgSrc} alt={`Coffee ${i}`} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* Phần "Món nổi bật" hiển thị theo dạng lưới */}
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
                    <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#E7B45A",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textDecoration: "underline",
                                fontSize: "1.2rem",
                                '&:hover': {
                                    color: "#d19b4a", // Màu khi hover
                                }
                            }}
                            onClick={() => navigate("/menu")}
                        >
                            Xem tất cả
                        </Typography>
                    </Box>
                    <Container maxWidth="lg"  sx={{ mt: 2 }}>
                        {topDrinks.length > 0 ? (
                            <>
                                <Slider
                                    {...settings}
                                    nextArrow={<ArrowButton direction="right" />}
                                    prevArrow={<ArrowButton direction="left" />}
                                >
                                    {topDrinks.slice(0, visibleCount).map((item) => {
                                        const { drink, totalQuantity } = item;
                                        return (
                                            <div key={drink.id}>
                                                <Card>
                                                    <CardContent sx={{ p: 2, position: "relative" }}>
                                                        <Box sx={{ position: "relative" }}>
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
                                                        </Box>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: "bold",
                                                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                                                mt: 1,
                                                            }}
                                                        >
                                                            {drink.nameDrinks}
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                                                            {formatPrice(drink.price)}
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{
                                                                mt: 1,
                                                                width: "auto",
                                                                bgcolor: "#E7B45A",
                                                                "&:hover": { bgcolor: "#d19b4a" },
                                                                marginLeft: "auto",
                                                                marginRight: "auto",
                                                                display: "block",
                                                            }}
                                                            onClick={() => handleOrderNow(drink)}
                                                        >
                                                            Đặt ngay
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </>
                        ) : (
                            <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
                                Không có sản phẩm nổi bật nào
                            </Typography>
                        )}
                    </Container>
                </Box>


                {/* Phần phản hồi khách hàng */}
                <Paper elevation={3} sx={{ backgroundColor: "#333", color: "white", p: 4, mt: 4, borderRadius: 2 }}>
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
                    <Slider {...settings}>
                        {feedbacks.map((fb, i) => (
                            <div key={i} style={{ padding: '0 10px' }}> {/* Thêm padding vào wrapper ở đây */}
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        textAlign: "center",
                                        borderRadius: 2,
                                        backgroundColor: "white",
                                        color: "black",
                                        margin: "0 10px",  // Thêm margin vào Paper để tạo khoảng cách
                                    }}
                                >
                                    <Typography variant="body1" fontStyle="italic">
                                        "{fb.content}"
                                    </Typography>
                                    <Typography fontWeight="bold" mt={2}>
                                        {fb.customer?.nameCustomer || "Khách hàng ẩn danh"}
                                    </Typography>
                                </Paper>
                            </div>
                        ))}
                    </Slider>
                </Paper>
                {showCart && cartCount > 0 && (
                <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1200 }}>
                    <Fab
                        sx={{ bgcolor: "#E7B45A", "&:hover": { bgcolor: "#d19b4a" } }}
                        onClick={() => setIsCartOpen(true)}
                    >
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCart />
                        </Badge>
                    </Fab>
                </Box>
                )}
                {/* CartModal component */}
                <CartModal
                    open={isCartOpen}
                    handleClose={() => setIsCartOpen(false)}
                    cartItems={cartItems}
                    adjustQuantity={adjustQuantity}
                    removeFromCart={removeFromCart}
                    formatPrice={formatPrice}
                    totalCartPrice={totalCartPrice}
                    handlePayment={() => toast.success("Đặt món thành công!")}
                />
                {/* Các FAB liên hệ */}
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
            <Footer />
        </>
    );
}

export default CoffeeShop;
