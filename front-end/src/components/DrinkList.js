// DrinkList.jsx
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Box, IconButton, Typography, Button, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getDrinks, getDrinksByCategory } from "../service/DrinkService";
import { getCloudinaryImageUrl } from "../service/CloudinaryService";

const DrinkList = ({ activeCategory }) => {
    const [drinks, setDrinks] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);

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

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 4);
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 6 } }}>
            <Typography variant="h5" sx={{ mb: { xs: 2, sm: 4 }, fontWeight: 600 }}>
                Danh Sách Đồ Uống
            </Typography>
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
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                            }}
                                        >
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
                                Load More
                            </Button>
                        </Box>
                    )}
                </>
            ) : (
                <Typography variant="body1">
                    Không có đồ uống cho danh mục này.
                </Typography>
            )}
        </Container>
    );
};

export default DrinkList;
