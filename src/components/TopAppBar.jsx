import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import Cookies from 'js-cookie';
import endPoints from '../services/api';

import { postSession, setUser } from '../services/reducers/session.slice';

const TopAppBar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const cachedToken = Cookies.get('myAppToken');

      if (cachedToken) {
        dispatch(setUser(cachedToken));
        const renewalInterval = setInterval(async () => {
          try {
            const newToken = await axios.post(endPoints.auth.renew, { user: cachedToken }, {
              headers: {
                Auth: endPoints.apiKey,
              },
            });
            Cookies.set('myAppToken', newToken.data.accessToken, { expires: 1 / 24 });
            dispatch(setUser(newToken.data.accessToken));
          } catch (error) {
            console.error('Error renovando el token:', error);
          }
        }, 60 * 58 * 1000);

        return () => clearInterval(renewalInterval);
      } else {
        dispatch(
          postSession({
            user: {
              name: user.name || user.given_name || user.nickname || user.email,
              email: user.email,
              role: 'customer',
            },
          }),
        );
      }
    }
  }, [dispatch, isAuthenticated, isLoading, user]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    Cookies.remove('myAppToken');
    logout({ returnTo: window.location.origin + '/sign-in' });
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="false">
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box
            component={Link}
            to="/dashboard"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <AdbIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              COMMERSY
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Abrir Ajustes">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.name} src={user?.picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Cerrar Sesion</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TopAppBar;
