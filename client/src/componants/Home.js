import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Card,
  CardContent,
  Grid,
  TextField,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Switch
} from "@mui/material";
import { styled } from "@mui/system";
import { FiMenu, FiShoppingCart, FiMoon, FiSun } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
}));

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
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const pages = ["Home", "About Us", "Products", "Contact Us"];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const toggleCart = () => setCartOpen(!cartOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5003/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("فشل في جلب معلومات الحساب:", err.message);
      }
    };
    fetchUser();
  }, []);

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
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap sx={{ color: "#000000" }}>
              LOGO
            </Typography>

            <Box sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              flexGrow: 1,
              gap: 2
            }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentSection(page.toLowerCase())}
                  sx={{
                    color: "#000000",
                    display: "block",
                    fontWeight: "500",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)"
                    }
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                icon={<FiSun />}
                checkedIcon={<FiMoon />}
              />
              <IconButton onClick={toggleCart}>
                <Badge badgeContent={4} color="primary">
                  <FiShoppingCart />
                </Badge>
              </IconButton>
              <Tooltip title="الحساب">
                <IconButton onClick={handleOpenUserMenu}>
<Avatar
  alt={user?.fullName}
  src={
    user?.profileImage
      ? `http://127.0.0.1:5003/${user.profileImage.replace(/\\/g, "/")}`
      : ""
  }
/>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user ? (
                  <>
                    <MenuItem disabled>
                      <Typography textAlign="center">{user.fullName}</Typography>
                    </MenuItem>
                   
                    <MenuItem onClick={() => alert("اذهب إلى صفحة الحساب")}>
                      <Typography textAlign="center">my Page</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center" color="error"> Sign Out </Typography>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem disabled>
                    <Typography>جاري تحميل الحساب...</Typography>
                  </MenuItem>
                )}
              </Menu>

              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                  <FiMenu />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
        {pages.map((page) => (
          <MenuItem key={page} onClick={() => {
            setCurrentSection(page.toLowerCase());
            handleCloseNavMenu();
          }}>
            <Typography textAlign="center">{page}</Typography>
          </MenuItem>
        ))}
      </Menu>

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
