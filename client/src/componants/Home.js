import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText
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
  color: "#ffffff"
});

const ProductCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)"
  }
});

export default function HomeApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");

  const toggleCart = () => setCartOpen(!cartOpen);

  const renderSection = () => {
    switch (currentSection) {
      case "home":
        return (
          <>
            <HeroBanner>
              <Typography variant="h2">Welcome to Our Store</Typography>
            </HeroBanner>
            <Container sx={{ mt: 4 }}>
              <Typography variant="h4" gutterBottom>Featured Products</Typography>
              <Grid container spacing={3}>
                {[1, 2, 3].map((item) => (
                  <Grid item xs={12} sm={4} key={item}>
                    <ProductCard>
                      <img
                        src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30`}
                        alt="product"
                        style={{ width: "100%", height: 200, objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5">Product {item}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Product description goes here
                        </Typography>
                      </CardContent>
                    </ProductCard>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </>
        );
      case "about us":
        return (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom>About Us</Typography>
            <Typography paragraph>
              We are committed to providing the best products and services to our customers.
            </Typography>
          </Container>
        );
      case "contact us":
        return (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom>Contact Us</Typography>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Name" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Message" multiline rows={4} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary">Send Message</Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* لا يوجد Navbar هنا */}
      <Drawer anchor="right" open={cartOpen} onClose={toggleCart}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>Shopping Cart</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Product 1" secondary="$99.99" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Product 2" secondary="$149.99" />
            </ListItem>
          </List>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Checkout
          </Button>
        </Box>
      </Drawer>

      {renderSection()}
    </Box>
  );
}
