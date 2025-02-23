import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { updateTableCoffeeStatus, getTableCoffeeById } from "../service/TableCoffeeService";
import {
    Box,
    Container,
    Typography,
    Stack,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Badge,
    Snackbar,
    CircularProgress,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { getCategories } from "../service/CategoryService";
import { getDrinks, getDrinksByCategory } from "../service/DrinkService";
import { getCloudinaryImageUrl } from "../service/CloudinaryService";
import { createCartItem } from "../service/CartItemService";
import CartModal from "./CartModal";
import { createCart } from "../service/CartService";
import { createFeedback } from "../service/FeedBackService";
import { createCustomer } from "../service/CustomerService";
import FeedbackModal from "./FeedBackModal";
import PaymentIcon from '@mui/icons-material/Payment';
import Tooltip from "@mui/material/Tooltip";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { API_URL_SOCKET } from "../config/apiConfig";
import Header from "../component/home/Header";

const MenuComponent = () => {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get("tableId");
    const [table, setTable] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    // Lưu danh sách đồ uống. Giả sử mỗi drink có thuộc tính new (true/false)
    const [drinks, setDrinks] = useState([]);

    // Khởi tạo state từ sessionStorage nếu có, ngược lại sử dụng giá trị mặc định
    const [visibleCount, setVisibleCount] = useState(() => {
        const storedCount = sessionStorage.getItem("visibleCount");
        return storedCount ? JSON.parse(storedCount) : 4;
    });
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = sessionStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [showRatingIcon, setShowRatingIcon] = useState(() => {
        const storedShowRatingIcon = sessionStorage.getItem("showRatingIcon");
        return storedShowRatingIcon ? JSON.parse(storedShowRatingIcon) : false;
    });
    const [orderPlaced, setOrderPlaced] = useState(() => {
        const storedOrderPlaced = sessionStorage.getItem("orderPlaced");
        return storedOrderPlaced ? JSON.parse(storedOrderPlaced) : false;
    });
    const [openCartModal, setOpenCartModal] = useState(false);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    // Ref cho phần tử sentinel dùng để trigger load thêm
    const sentinelRef = useRef(null);
    const stompClientRef = useRef(null);

    const generateCodeFeedback = () => {
        return "FB-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const generateToken = () => {
        return "TOKEN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const getSessionToken = useCallback(() => {
        let token = sessionStorage.getItem("tableToken");
        if (!token) {
            token = generateToken();
            sessionStorage.setItem("tableToken", token);
        }
        console.log("Session Token:", token);
        return token;
    }, []);

    // Lưu cartItems vào sessionStorage mỗi khi state thay đổi
    useEffect(() => {
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Lưu visibleCount vào sessionStorage mỗi khi state thay đổi
    useEffect(() => {
        sessionStorage.setItem("visibleCount", JSON.stringify(visibleCount));
    }, [visibleCount]);

    // Lưu showRatingIcon vào sessionStorage mỗi khi state thay đổi
    useEffect(() => {
        sessionStorage.setItem("showRatingIcon", JSON.stringify(showRatingIcon));
    }, [showRatingIcon]);

    // Lưu orderPlaced vào sessionStorage mỗi khi state thay đổi
    useEffect(() => {
        sessionStorage.setItem("orderPlaced", JSON.stringify(orderPlaced));
    }, [orderPlaced]);

    // UseEffect để thiết lập kết nối WebSocket
    useEffect(() => {
        stompClientRef.current = new Client({
            webSocketFactory: () => new SockJS(API_URL_SOCKET),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers['message']);
                console.error("Additional details: " + frame.body);
            },
        });

        stompClientRef.current.activate();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    // Lấy thông tin bàn ban đầu
    useEffect(() => {
        if (tableId) {
            getTableCoffeeById(tableId)
                .then((data) => {
                    console.log("Thông tin bàn:", data);
                    setTable(data);
                })
                .catch((error) => console.error("Lỗi lấy thông tin bàn:", error));
        }
    }, [tableId]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                const categoriesWithAll = [{ id: "all", nameCategory: "Tất Cả" }, ...response];
                setCategories(categoriesWithAll);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    useEffect(() => {
        setVisibleCount(4);
        const fetchDrinks = async () => {
            if (activeCategory) {
                try {
                    let drinksData = [];
                    if (activeCategory.nameCategory === "Tất Cả") {
                        drinksData = await getDrinks();
                        // Nếu muốn xáo trộn danh sách (có thể loại trừ món mới) thì sắp xếp lại:
                        drinksData = drinksData.sort(() => Math.random() - 0.5);
                    } else {
                        drinksData = await getDrinksByCategory(activeCategory.id);
                    }
                    // Sắp xếp sao cho món mới (new === true) được đưa lên đầu danh sách
                    drinksData.sort((a, b) => {
                        return (b.new === true ? 1 : 0) - (a.new === true ? 1 : 0);
                    });
                    setDrinks(drinksData);
                } catch (error) {
                    console.error("Error fetching drinks:", error);
                }
            }
        };
        fetchDrinks();
    }, [activeCategory]);

    const handlePaymentNotification = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            const payload = `Bàn ${tableId} muốn tính tiền`;
            stompClientRef.current.publish({
                destination: "/app/paymentNotification",
                body: JSON.stringify(payload),
            });
            setSnackbar({
                open: true,
                message: "Thông báo thanh toán đã được gửi đến nhân viên.",
            });
        } else {
            setSnackbar({
                open: true,
                message: "Kết nối WebSocket không khả dụng.",
            });
        }
    };

    // Hàm load thêm dữ liệu, hiển thị spinner trong quá trình load
    const handleLoadMore = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + 4);
            setIsLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && visibleCount < drinks.length) {
                    handleLoadMore();
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 1.0,
            }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [visibleCount, drinks.length, handleLoadMore]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleSubmitFeedback = async (feedbackData) => {
        try {
            const { name, email, phone, content, images } = feedbackData;
            const customer = await createCustomer({
                email,
                phoneCustomer: phone,
                nameCustomer: name,
            });
            const codeFeedback = generateCodeFeedback();
            const dateFeedback = new Date().toISOString();

            const feedbackPayload = {
                codeFeedback,
                dateFeedback,
                customer,
                content,
                tableId: table ? table.id : null,
                images: images.map((url) => ({ img: url })),
            };

            const newFeedback = await createFeedback(feedbackPayload);
            console.log("Feedback đã được tạo:", newFeedback);
            setSnackbar({
                open: true,
                message: "Cảm ơn bạn đã đánh giá sản phẩm",
            });
        } catch (error) {
            console.error("Lỗi khi tạo feedback:", error);
        }
    };

    const handleOrder = async () => {
        if (table && table.statusTable === 2) {
            setSnackbar({
                open: true,
                message: "Bàn đang bảo trì. Bạn không thể thanh toán.",
            });
            return;
        }
        if (table && table.token && table.token !== getSessionToken()) {
            setSnackbar({
                open: true,
                message: "Bàn này đang được sử dụng. Bạn không thể thanh toán.",
            });
            console.log(table.token);
            return;
        }
        if (cartItems.length === 0) return;

        if (table && table.statusTable === 0) {
            try {
                const sessionToken = getSessionToken();
                const updatedData = await updateTableCoffeeStatus(tableId, { statusTable: 1, token: sessionToken });
                console.log("Cập nhật trạng thái bàn thành công:", updatedData);
                setTable(updatedData);
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái bàn:", error);
                return;
            }
        }

        const cart = {
            table: { id: tableId },
            items: cartItems.map((item) => ({
                drink: { id: item.id },
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
            })),
        };

        console.log("Payload gửi đi:", cart);
        try {
            const response = await createCart(cart);
            console.log("Đơn hàng đã được tạo thành công:", response);
            setCartItems([]);
            setOpenCartModal(false);
            setShowRatingIcon(true); // Hiển thị nút đánh giá khi đặt hàng thành công
            setOrderPlaced(true); // Hiển thị nút thanh toán khi đặt hàng thành công
            setSnackbar({
                open: true,
                message: "Bạn đã đặt món thành công",
            });
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
        }
    };

    const handleAddToCart = async (drink) => {
        if (table && table.statusTable === 2) {
            setSnackbar({
                open: true,
                message: "Bàn đang bảo trì. Vui lòng thử lại sau.",
            });
            return;
        }
        if (table && table.token && table.token !== getSessionToken()) {
            setSnackbar({
                open: true,
                message: "Bàn này đang được sử dụng. Bạn không thể thao tác giỏ hàng.",
            });
            return;
        }
        const cartItem = {
            drink: { id: drink.id },
            quantity: 1,
            price: drink.price,
            name: drink.nameDrinks,
        };

        try {
            const response = await createCartItem(cartItem);
            console.log("Đã thêm sản phẩm vào giỏ hàng:", response);
            setCartItems((prev) => {
                const existing = prev.find((item) => item.id === drink.id);
                if (existing) {
                    return prev.map((item) =>
                        item.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    return [...prev, { id: drink.id, name: drink.nameDrinks, quantity: 1, price: drink.price }];
                }
            });
        } catch (error) {
            console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
        }
    };

    const adjustQuantity = (id, delta) => {
        if (table && table.statusTable === 2) {
            setSnackbar({
                open: true,
                message: "Bàn đang bảo trì. Bạn không thể thanh toán.",
            });
            return;
        }
        if (table && table.token && table.token !== getSessionToken()) {
            setSnackbar({
                open: true,
                message: "Bàn này đang được sử dụng. Bạn không thể thao tác giỏ hàng.",
            });
            return;
        }
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + delta;
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        if (table && table.statusTable === 2) {
            setSnackbar({
                open: true,
                message: "Bàn đang bảo trì. Bạn không thể thanh toán.",
            });
            return;
        }
        if (table && table.token && table.token !== getSessionToken()) {
            setSnackbar({
                open: true,
                message: "Bàn này đang được sử dụng. Bạn không thể thao tác giỏ hàng.",
            });
            return;
        }
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Tạo một mảng đồ uống đã được sắp xếp (món mới lên đầu) sử dụng thuộc tính "new"
    const sortedDrinks = [...drinks].sort((a, b) => {
        return (b.new === true ? 1 : 0) - (a.new === true ? 1 : 0);
    });

    return (
        <Box sx={{ backgroundColor: "#f3f4f6", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <Header />
            {/* Thêm khoảng cách dưới Header */}
            <Box sx={{ pt: { xs: 10, sm: 12 } }}>
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                        mb: { xs: 3, sm: 6 },
                        backgroundColor: "#fff",
                        pt: { xs: 2, sm: 3 },
                        pb: { xs: 2, sm: 3 },
                        px: { xs: 2, sm: 3 },
                    }}
                >
                    <Container maxWidth="md">
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                mb: { xs: 1, sm: 2 },
                                fontWeight: 600,
                                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                                textAlign: "left",
                            }}
                        >
                            Chọn Danh Mục
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={{ xs: 1, sm: 2 }}
                            sx={{
                                overflowX: "auto",
                                "&::-webkit-scrollbar": { display: "none" },
                            }}
                        >
                            {categories.map((category, index) => {
                                const isActive = activeCategory?.id === category.id || (!activeCategory && index === 0);
                                return (
                                    <Button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category)}
                                        sx={{
                                            borderRadius: "50px",
                                            textTransform: "none",
                                            whiteSpace: "nowrap",
                                            px: { xs: 1, sm: 1.5 },
                                            py: { xs: 0.5, sm: 1 },
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                            backgroundColor: isActive ? "#E7B45A" : "rgba(231,180,90,0.3)",
                                            color: isActive ? "#fff" : "#E7B45A",
                                            boxShadow: "none",
                                            "&:hover": {
                                                backgroundColor: isActive ? "#d6a24e" : "rgba(231,180,90,0.5)",
                                            },
                                        }}
                                    >
                                        {category.nameCategory}
                                    </Button>
                                );
                            })}
                        </Stack>
                    </Container>
                </Box>

                {activeCategory && (
                    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 6 } }}>
                        {sortedDrinks.length > 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {sortedDrinks.slice(0, visibleCount).map((drink) => (
                                        <Grid item key={drink.id} xs={6} sm={6} md={4} lg={3}>
                                            <Card>
                                                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                                                    <Box sx={{ position: "relative" }}>
                                                        {/* Sử dụng Chip để hiển thị tag "Món mới" nếu drink.new === true */}
                                                        {drink.new && (
                                                            <Chip
                                                                label="Món mới"
                                                                size="small"
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 8,
                                                                    left: 8,
                                                                    backgroundColor: "#FF5722",
                                                                    color: "#fff",
                                                                }}
                                                            />
                                                        )}
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
                                                    <Typography variant="h6" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                                        {formatPrice(drink.price)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                {visibleCount < sortedDrinks.length && (
                                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                                        {isLoading ? (
                                            <CircularProgress />
                                        ) : (
                                            <div ref={sentinelRef} style={{ height: "20px" }} />
                                        )}
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Typography variant="body1">Không có đồ uống cho danh mục này.</Typography>
                        )}
                    </Container>
                )}
            </Box>

            {/* Nút giỏ hàng, đánh giá, thanh toán */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 1,
                }}
            >
                {showRatingIcon && (
                    <Tooltip title="Đánh giá món ăn">
                        <IconButton
                            onClick={() => setOpenFeedbackModal(true)}
                            sx={{
                                bgcolor: "#1976d2",
                                color: "#fff",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                                "&:hover": { bgcolor: "#115293" },
                            }}
                        >
                            <RateReviewIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title="Xem giỏ hàng">
                    <IconButton
                        onClick={() => setOpenCartModal(true)}
                        sx={{
                            bgcolor: "#E7B45A",
                            color: "white",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                            "&:hover": { bgcolor: "#D9A144" },
                        }}
                    >
                        <Badge badgeContent={totalCartCount} color="error">
                            <ShoppingCartIcon fontSize="large" />
                        </Badge>
                    </IconButton>
                </Tooltip>
                {orderPlaced && (
                    <Tooltip title="Thanh toán">
                        <IconButton
                            onClick={handlePaymentNotification}
                            sx={{
                                bgcolor: "#4caf50",
                                color: "white",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                                "&:hover": { bgcolor: "#388e3c" },
                            }}
                        >
                            <PaymentIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <CartModal
                open={openCartModal}
                handleClose={() => setOpenCartModal(false)}
                cartItems={cartItems}
                adjustQuantity={adjustQuantity}
                removeFromCart={removeFromCart}
                formatPrice={formatPrice}
                totalCartPrice={totalCartPrice}
                handlePayment={handleOrder}
            />
            <FeedbackModal
                open={openFeedbackModal}
                handleClose={() => setOpenFeedbackModal(false)}
                handleSubmitFeedback={handleSubmitFeedback}
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
};

export default MenuComponent;
