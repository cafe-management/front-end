import Header from "./Header";
import Footer from "./Footer";
import {Box, Container} from "@mui/material";

function News (){
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Container sx={{ flex: 1, py: 4 }}>
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
            </Container>
            <Footer />
        </Box>

    )
}

export default News;