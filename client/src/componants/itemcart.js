// Updated CartPage.jsx with API Integration
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  styled
} from "@mui/material";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { BsCartX } from "react-icons/bs";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4]
  }
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "4px",
  padding: theme.spacing(0.5)
}));

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5003/api/cart/get-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    try {
      await axios.post("http://127.0.0.1:5003/api/cart/add-to-cart", {
        productId,
        quantity: change,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCart();
      if (window.updateCartCount) window.updateCartCount();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete("http://127.0.0.1:5003/api/cart/remove-from-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { productId: itemToDelete.product._id },
      });
      fetchCart();
      if (window.updateCartCount) window.updateCartCount();
    } catch (err) {
      console.error("Error removing item:", err);
    }
    setDeleteDialogOpen(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.prodPrice * item.quantity, 0);
  };

  const tax = calculateTotal() * 0.1;
  const shipping = cartItems.length > 0 ? 15.99 : 0;
  const grandTotal = calculateTotal() + tax + shipping;

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <BsCartX size={64} color="#9e9e9e" />
          <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
          <Button variant="contained" color="primary">Continue Shopping</Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <StyledCard key={item.product._id}>
                <CardMedia
                  component="img"
                  sx={{ width: 140, objectFit: "cover" }}
                  image={`http://127.0.0.1:5003/${item.product.prodImage.replace(/\\/g, "/")}`}
                  alt={item.product.prodName}
                />
                <CardContent sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>{item.product.prodName}</Typography>
                    <Typography variant="h6" color="primary">${item.product.prodPrice.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <QuantityButton onClick={() => handleQuantityChange(item.product._id, -1)} disabled={item.quantity <= 1}><FiMinus /></QuantityButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <QuantityButton onClick={() => handleQuantityChange(item.product._id, 1)}><FiPlus /></QuantityButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(item)} sx={{ ml: 2 }}><FiTrash2 /></IconButton>
                  </Box>
                </CardContent>
              </StyledCard>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${calculateTotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Tax (10%)</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography>Shipping</Typography>
                <Typography>${shipping.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">${grandTotal.toFixed(2)}</Typography>
              </Box>
              <Button variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }}>
                Proceed to Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove this item from your cart?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>Remove</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;