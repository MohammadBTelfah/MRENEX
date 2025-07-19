// components/Navbar.js

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
} from "@mui/material";
import { styled } from "@mui/system";
import { FiMenu, FiShoppingCart, FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

export default function Navbar({ darkMode, toggleDarkMode, toggleCart }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const pages = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact Us", path: "/contact" },
  ];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    //refresh the page to reset state
    window.location.reload();
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
        console.error("Error fetching user profile", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap sx={{ color: "#000000", cursor: "pointer" }} onClick={() => navigate("/")}>
              LOGO
            </Typography>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                flexGrow: 1,
                gap: 2,
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => navigate(page.path)}
                  sx={{
                    color: "#000000",
                    fontWeight: "500",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  {page.name}
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
                <Badge badgeContent={0} color="primary">
                  <FiShoppingCart />
                </Badge>
              </IconButton>

              {/* Avatar & Menu (Always shown) */}
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
                  [
                    <MenuItem key="login" onClick={() => { navigate("/login"); handleCloseUserMenu(); }}>
                      <Typography textAlign="center">Login</Typography>
                    </MenuItem>,
                    <MenuItem key="register" onClick={() => { navigate("/register"); handleCloseUserMenu(); }}>
                      <Typography textAlign="center">Register</Typography>
                    </MenuItem>
                  ]
                ) : (
                  [
                    <MenuItem key="name" disabled>
                      <Typography textAlign="center">{user.fullName}</Typography>
                    </MenuItem>,
                    <MenuItem key="profile" onClick={() => { navigate("/profile"); handleCloseUserMenu(); }}>
                      <Typography textAlign="center">My Profile</Typography>
                    </MenuItem>,
                    <MenuItem key="logout" onClick={() => { handleLogout(); handleCloseUserMenu(); }}>
                      <Typography textAlign="center" color="error">Sign Out</Typography>
                    </MenuItem>
                  ]
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

      {/* Mobile Menu */}
      <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
        {pages.map((page) => (
          <MenuItem
            key={page.name}
            onClick={() => {
              navigate(page.path);
              handleCloseNavMenu();
            }}
          >
            <Typography textAlign="center">{page.name}</Typography>
          </MenuItem>
        ))}

        {!user && (
          <>
            <MenuItem onClick={() => { navigate("/login"); handleCloseNavMenu(); }}>
              <Typography textAlign="center">Login</Typography>
            </MenuItem>
            <MenuItem onClick={() => { navigate("/register"); handleCloseNavMenu(); }}>
              <Typography textAlign="center">Register</Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
