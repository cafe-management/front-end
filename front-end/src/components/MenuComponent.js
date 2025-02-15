import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { updateTableCoffeeStatus, getTableCoffeeById } from "../service/TableCoffeeService";
import {
    AppBar,
    Box,
    Container,
    Toolbar,
    Typography,
    Stack,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getCategories } from "../service/CategoryService";
import { getDrinks, getDrinksByCategory } from "../service/DrinkService";
import { getCloudinaryImageUrl } from "../service/CloudinaryService";
import { createCartItem } from "../service/CartItemService";
import CartModal from "./CartModal";
import { createCart } from "../service/CartService";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {createFeedback} from "../service/FeedBackService";
import {createCustomer} from "../service/CustomerService";
import FeedbackModal from "./FeedBackModal";

const MenuComponent = () => {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get("tableId");
    const [table, setTable] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);
    const [cartItems, setCartItems] = useState([]);
    const [openCartModal, setOpenCartModal] = useState(false);
    const [showRatingIcon, setShowRatingIcon] = useState(false);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    useEffect(() => {
        if (tableId) {
            updateTableCoffeeStatus(tableId, { statusTable: 1 })
                .then((data) => console.log("Cập nhật trạng thái bàn thành công:", data))
                .catch((err) => console.error("Lỗi cập nhật trạng thái bàn:", err));
        }
    }, [tableId]);

    const generateCodeFeedback = () => {
        return "FB-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    useEffect(() => {
        if (tableId) {
            getTableCoffeeById(tableId)
                .then((data) => setTable(data))
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
                    if (activeCategory.nameCategory === "Tất Cả") {
                        const allDrinks = await getDrinks();
                        setDrinks(allDrinks);
                    } else {
                        const drinksData = await getDrinksByCategory(activeCategory.id);
                        setDrinks(drinksData);
                    }
                } catch (error) {
                    console.error("Error fetching drinks:", error);
                }
            }
        };
        fetchDrinks();
    }, [activeCategory]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const handleSubmitFeedback = async (feedbackData) => {
        try {
            const { name, email, phone, content ,images} = feedbackData;
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
                images: images.map(url => ({ img: url })),
            };

            const newFeedback = await createFeedback(feedbackPayload);
            console.log("Feedback đã được tạo:", newFeedback);
        } catch (error) {
            console.error("Lỗi khi tạo feedback:", error);
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 4);
    };

    const handleOrder = async () => {
        if (cartItems.length === 0) return;

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
            setShowRatingIcon(true);
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
        }
    };

    const handleAddToCart = async (drink) => {
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
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Box sx={{ backgroundColor: "#f3f4f6", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <AppBar position="static" elevation={3} sx={{ backgroundColor: "#fff", color: "#000" }}>
                <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <Container maxWidth="md">
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                flexGrow: 1,
                                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                            }}
                        >
                            {table ? `${table.numberTable}` : "Menu"}
                        </Typography>
                    </Container>
                </Toolbar>
            </AppBar>

            {/* Phần chọn danh mục */}
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
                    {drinks.length > 0 ? (
                        <>
                            <Grid container spacing={2}>
                                {drinks.slice(0, visibleCount).map((drink) => (
                                    <Grid item key={drink.id} xs={6} sm={6} md={4} lg={3}>
                                        <Card>
                                            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
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
                                                    sx={{ fontWeight: "bold", fontSize: { xs: "0.875rem", sm: "1rem" }, mt: 1 }}
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
                            {visibleCount < drinks.length && (
                                <Box
                                    sx={{
                                        mt: { xs: 2, sm: 4 },
                                        display: "flex",
                                        justifyContent: "center",
                                        px: { xs: 2, sm: 0 },
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={handleLoadMore}
                                        sx={{
                                            width: { xs: "100%", sm: "auto" },
                                            px: { xs: 2, sm: 3 },
                                            py: { xs: 1, sm: 1.5 },
                                            fontSize: { xs: "0.875rem", sm: "1rem" },
                                            backgroundColor: "#E7B45A",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            boxShadow: "none",
                                            "&:hover": { backgroundColor: "#d6a24e" },
                                        }}
                                    >
                                        Xem thêm
                                    </Button>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography variant="body1">Không có đồ uống cho danh mục này.</Typography>
                    )}
                </Container>
            )}

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
                    <IconButton
                        onClick={() => {
                            setOpenFeedbackModal(true)
                        }}
                        sx={{
                            bgcolor: "#1976d2",
                            color: "#fff",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                            "&:hover": { bgcolor: "#115293" },
                        }}
                    >
                        <RateReviewIcon fontSize="large" />
                    </IconButton>
                )}

                <IconButton
                    onClick={() => {
                        setOpenCartModal(true);
                    }}
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
            </Box>

            {/* Modal hiển thị giỏ hàng */}
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
        </Box>
    );
};

export default MenuComponent;
