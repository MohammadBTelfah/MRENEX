import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Button,
  CardActions,
} from "@mui/material";
import { styled } from "@mui/system";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Styled Card
const StyledCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 20,
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-8px)",
  },
});

// Image styling (larger)
const StyledMedia = styled(CardMedia)({
  height: 250,
  objectFit: "cover",
});

// Buttons spacing
const StyledCardActions = styled(CardActions)({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px",
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5003/api/products/getallproducts");
      console.log("API full response:", res.data);
      setProducts(res.data || []);
      setAllProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const addToCart = (productId) => {
    console.log("Adding to cart:", productId);
     axios.post("http://127.0.0.1:5003/api/cart/add-to-cart",{productId,quantity:1},{
              headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
        }).then(()=>{
            alert("added to cart")
        }).catch(err=>{
            alert(err)
        })
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "all") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (p) => p.prodCategory && p.prodCategory.name === value
      );
      setProducts(filtered);
    }
  };

  const categories = [...new Set(allProducts.map(p => p.prodCategory?.name))].filter(Boolean);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="center" mb={3}>
        <select
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            minWidth: "200px",
          }}
          onChange={handleCategoryChange}
          defaultValue="all"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Box>

      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" fontWeight={600} mb={5}>
          Products
        </Typography>

        {products.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No products available.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {products.map((product) => {
              const imageUrl = `http://127.0.0.1:5003/${product.prodImage.replace(/\\/g, "/")}`;
              return (
                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <StyledCard>
                    <StyledMedia
                      component="img"
                      image={imageUrl}
                      alt={product.prodName}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {product.prodName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.prodDescription}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${product.prodPrice}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {product.prodCategory?.name || "Uncategorized"}
                      </Typography>
                    </CardContent>
                    <StyledCardActions>
                      <Button onClick={() => addToCart(product._id)}
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #2196f3, #21cbf3)",
                          color: "#fff",
                          borderRadius: "30px",
                          textTransform: "none",
                          px: 2,
                          fontWeight: 500,
                          "&:hover": {
                            background: "linear-gradient(135deg, #1e88e5, #1db6e0)",
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button variant="outlined" color="secondary" size="small">
                        See Details
                      </Button>
                    </StyledCardActions>
                  </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </>
  );
}
