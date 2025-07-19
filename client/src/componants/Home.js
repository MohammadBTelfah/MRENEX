import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  
} from "@mui/material";
import { styled } from "@mui/system";

const HeroBanner = styled(Box)({
  backgroundImage: "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "70vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
});

const ProductCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

// Main component for the Home page
export default function HomeApp() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5003/api/products/getallproducts");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HeroBanner>
        <Typography variant="h2">Welcome to Our Store</Typography>
      </HeroBanner>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
          Featured Products
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => {
            const imageUrl = `http://127.0.0.1:5003/${product.prodImage.replace(/\\/g, "/")}`;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard>
                  <img
                    src={imageUrl}
                    alt={product.prodName}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                  <CardContent style={{ textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      {product.prodName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.prodDescription}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${Number(product.prodPrice).toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        mt: 2,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </ProductCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
