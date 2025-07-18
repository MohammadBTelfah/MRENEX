// componants/Footer.js
import React from "react";
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 4, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Pages
            </Typography>
            <MuiLink component={Link} to="/" underline="hover" color="text.primary" display="block">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/profile" underline="hover" color="text.primary" display="block">
              Profile
            </MuiLink>
            <MuiLink component={Link} to="/register" underline="hover" color="text.primary" display="block">
              Register
            </MuiLink>
            <MuiLink component={Link} to="/login" underline="hover" color="text.primary" display="block">
              Login
            </MuiLink>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Info
            </Typography>
            <MuiLink
              component="a"
              href="#"
              underline="hover"
              color="text.secondary"
              display="block"
            >
              About Us
            </MuiLink>
            <MuiLink
              component="a"
              href="#"
              underline="hover"
              color="text.secondary"
              display="block"
            >
              Products
            </MuiLink>
            <MuiLink
              component="a"
              href="#"
              underline="hover"
              color="text.secondary"
              display="block"
            >
              Contact Us
            </MuiLink>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Your Store Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
