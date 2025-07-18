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

export default function Navbar({ darkMode, toggleDarkMode, toggleCart, setCurrentSection }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const pages = ["Home", "About Us", "Products", "Contact Us"];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

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

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap sx={{ color: "#000000" }}>
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
                  key={page}
                  onClick={() => setCurrentSection(page.toLowerCase())}
                  sx={{
                    color: "#000000",
                    fontWeight: "500",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
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
                    <MenuItem onClick={() => navigate("/profile")}>
                      <Typography textAlign="center">My Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center" color="error">
                        Sign Out
                      </Typography>
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
          <MenuItem
            key={page}
            onClick={() => {
              setCurrentSection(page.toLowerCase());
              handleCloseNavMenu();
            }}
          >
            <Typography textAlign="center">{page}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
