import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout'; // Optional: icon for logout
import Profile from './profile'; // Assuming you have a Profile component
import ProductsCrud from './productsCrud'; // Assuming you have a productsCrud component
import {Category} from './category'; // Assuming you have a category component
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedeemIcon from '@mui/icons-material/Redeem';
import CategoryIcon from '@mui/icons-material/Category';
import { useState,useEffect } from 'react';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname, profileData }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {pathname ==="/Profile" && (
        <Box sx={{ mb: 4 }}>
          <Profile data={profileData} />
        </Box>
      )}
      {pathname ==="/Product" && (
        <Box sx={{ mb: 4 }}>
          <ProductsCrud />
        </Box>
      )}
      {pathname ==="/category" && (
        <Box sx={{ mb: 4 }}>
          <Category />
        </Box>
      )}

    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function ToolbarActionsSearch() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: 'inline', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' } }}
      />
      <ThemeSwitcher />
      <Account />
      <Tooltip title="Logout">
        <IconButton color="error" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? '© MUI' : `© ${new Date().getFullYear()} Made with love by MUI`}
    </Typography>
  );
}

SidebarFooter.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">My App</Typography>
      <Chip size="small" label="BETA" color="info" />
      <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}

function DashboardLayoutSlots(props) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
    {
    segment: 'Profile',
    title: 'Profile',
    icon: <AccountBoxIcon />,
  },
  ...(isAdmin ?[{
  
    segment: 'Product',
    title: 'Product',
    icon: <RedeemIcon />,
  
  },
{
    segment: 'category',
    title: 'Category',
    icon: <CategoryIcon />,
  }

] : []),


   
];
    useEffect(()=>{
        //  take the token from local storage and set it in the header of the axios request
        const token = localStorage.getItem('token');
        if (token){
            async function fetchData() {
                try {
                    const res = await  axios.get("http://127.0.0.1:5003/api/users/profile",{
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log("Profile data:", res);
                    setIsAdmin(res.data.role === 'admin');
                    setProfileData(res.data);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    // Optionally, you can redirect to login or show an error message
                    navigate('/login');
                    return;
                    
                }
                
        
            }
            fetchData();

        // then using axios access the end point  http://127.0.0.1:5003/api/users/profile
       

        }
        else{
            // if the token is not found redirect to the login page
            navigate('/login');
        }
        
    },[]);
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        {/* preview-start */}
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
            toolbarActions: ToolbarActionsSearch,
            sidebarFooter: SidebarFooter,
          }}
        >
            {profileData.role ? (
                <p>Welcome {profileData.role?profileData.role :"not Found" }</p>
            ): (
                <p>Loading...</p>
            ) }
          <DemoPageContent profileData={profileData} pathname={router.pathname} />
          
        </DashboardLayout>
        {/* preview-end */}
      </AppProvider>
    </DemoProvider>
  );
}

DashboardLayoutSlots.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutSlots;
