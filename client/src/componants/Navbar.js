// Navbar.jsx (with real-time cart count updates)
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
  Badge,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  FiMenu,
  FiShoppingCart,
  FiMoon,
  FiSun,
  FiHome,
  FiPackage,
  FiInfo,
  FiPhone,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const StyledAppBar = styled(AppBar)(() => ({
  background: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const pages = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Products", path: "/products", icon: <FiPackage /> },
    { name: "About Us", path: "/about", icon: <FiInfo /> },
    { name: "Contact Us", path: "/contact", icon: <FiPhone /> },
  ];

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5003/api/cart/get-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const items = res.data?.items || [];
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartCount(0);
    }
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
        fetchCartCount();
      } catch (err) {
        console.error("Error fetching user profile", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    window.updateCartCount = fetchCartCount;
  }, [cartCount]);

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{ color: "#1976d2", fontWeight: 700, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Talafha
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <Button
                    key={page.name}
                    onClick={() => navigate(page.path)}
                    sx={{
                      color: isActive ? "#1976d2" : "#000000",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderBottom: isActive ? "2px solid #1976d2" : "none",
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <Box component="span">{page.icon}</Box>
                    {page.name}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              icon={<FiSun />}
              checkedIcon={<FiMoon />}
            />

            <IconButton onClick={() => navigate("/cart")}> 
              <Badge badgeContent={cartCount} color="primary">
                <FiShoppingCart />
              </Badge>
            </IconButton>

            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  alt={user?.fullName || "Guest"}
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
              {!user ? (
                <>
                  <MenuItem onClick={() => { handleCloseUserMenu(); setTimeout(() => navigate("/login"), 50); }}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); setTimeout(() => navigate("/register"), 50); }}>
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem disabled>
                    <Typography textAlign="center">{user.fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/profile"); handleCloseUserMenu(); }}>
                    <Typography textAlign="center">My Profile</Typography>
                  </MenuItem>
                   <MenuItem onClick={() => { navigate("/order-history"); handleCloseUserMenu(); }}>
                    <Typography textAlign="center">Order History</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleLogout(); handleCloseUserMenu(); }}>
                    <Typography textAlign="center" color="error">Sign Out</Typography>
                  </MenuItem>
                 
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}