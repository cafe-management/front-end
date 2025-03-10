import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderAdmin from "../component/admin/HeaderAdmin";
import { getCategoryById, createCategory, updateCategory } from "../service/CategoryService";
import { Helmet } from "react-helmet-async";

const primaryColor = "#E7B45A";

const EditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({ nameCategory: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                try {
                    const data = await getCategoryById(id);
                    setCategory(data);
                } catch (error) {
                    toast.error("Lỗi khi tải danh mục!");
                    navigate("/category");
                }
            };
            fetchCategory();
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateCategory(id, category);
                toast.success("Cập nhật danh mục thành công!");
            } else {
                await createCategory(category);
                toast.success("Tạo danh mục thành công!");
            }
            setTimeout(() => {
                navigate("/category");
            }, 1000);
        } catch (error) {
            toast.error("Lỗi khi lưu danh mục!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{id ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</title>
            </Helmet>
            <HeaderAdmin />
            <Box
                sx={{
                    pt: 10,
                    pb: 1,
                    minHeight: "calc(100vh - 100px)",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${primaryColor}`,
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                color: primaryColor,
                                fontWeight: "bold",
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            {id ? "Chỉnh sửa Danh Mục" : "Thêm Danh Mục"}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                            <TextField
                                label="Tên Danh Mục"
                                fullWidth
                                value={category.nameCategory}
                                onChange={(e) => setCategory({ ...category, nameCategory: e.target.value })}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: primaryColor,
                                            color: "#fff",
                                            "&:hover": { backgroundColor: "#d1a750" },
                                            py: 1.5,
                                        }}
                                    >
                                        {loading ? (id ? "Đang cập nhật..." : "Đang tạo...") : (id ? "Cập Nhật" : "Tạo")}
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => navigate("/category")}
                                        sx={{
                                            borderColor: primaryColor,
                                            color: primaryColor,
                                            py: 1.5,
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default EditCategoryPage;
