import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import {
  setOpenAsideMenu,
  setOpenListMenu,
  setOpenSubMenuPopover,
  setAnchorSubMenuPopover,
} from '../services/reducers/ui.slice';

const drawerWidth = 240;

const navSubItems = [
  {
    index: 1,
    icon: <InventoryIcon />,
    label: 'Producto',
    submenu: [
      {
        label: 'Categorias',
        link: '/categories',
        index: 1,
      },
      {
        label: 'Precios',
        link: '/product-price',
        index: 2,
      },
      {
        label: 'Productos',
        link: '/products',
        index: 3,
      },
      {
        label: 'SubCategorias',
        link: '/sub-categories',
        index: 4,
      },
    ],
  },
  {
    index: 2,
    icon: <AddShoppingCartIcon />,
    label: 'Compras',
    submenu: [
      {
        label: 'Compras',
        link: '/purchase',
        index: 1,
      },
      {
        label: 'Cuentas por Pagar',
        link: '/accounts-payable',
        index: 2,
      },
      {
        label: 'Proveedores',
        link: '/providers',
        index: 3,
      },
    ],
  },
  {
    index: 3,
    icon: <ReceiptIcon />,
    label: 'Ventas',
    submenu: [
      {
        label: 'Clientes',
        link: '/customers',
        index: 1,
      },
      {
        label: 'Cotizaciones',
        link: '/quotes',
        index: 2,
      },
      {
        label: 'Cuentas por Cobrar',
        link: '/accounts-receivable',
        index: 3,
      },
      {
        label: 'Ventas',
        link: '/sales',
        index: 4,
      },
    ],
  },
  {
    index: 4,
    icon: <SettingsSuggestIcon />,
    label: 'Gestion',
    submenu: [
      {
        label: 'Generar Listas',
        link: '/generate-lists',
        index: 1,
      },
      {
        label: 'Impuestos',
        link: '/taxes',
        index: 2,
      },
      {
        label: 'Listas de Precios',
        link: '/price-lists',
        index: 3,
      },
      {
        label: 'Medios de Pago',
        link: '/payment-methods',
        index: 4,
      },
      {
        label: 'Monedas',
        link: '/coins',
        index: 5,
      },
      {
        label: 'Tasas de Cambio',
        link: '/exchange-rates',
        index: 6,
      },
    ],
  },
];

const openedMixin = (theme) => ({
  top: '56px',
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    top: '64px',
  },
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  top: '56px',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    top: '64px',
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const AsideMenu = () => {
  const openAsideMenu = useSelector((state) => state.ui.openAsideMenu);
  const openListMenu = useSelector((state) => state.ui.openListMenu);
  const openSubMenuPopover = useSelector(
    (state) => state.ui.openSubMenuPopover,
  );
  const anchorSubMenuPopover = useSelector(
    (state) => state.ui.anchorSubMenuPopover,
  );

  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch(setOpenAsideMenu(!openAsideMenu));
    if (openAsideMenu === true) {
      dispatch(setOpenListMenu(null));
    }
  };

  const handleClickListOpen = (panel, openAside) => (event) => {
    if (openAside) {
      dispatch(setOpenListMenu(openListMenu === panel ? null : panel));
    } else {
      dispatch(setAnchorSubMenuPopover(event.currentTarget));
      dispatch(setOpenSubMenuPopover(panel));
    }
  };

  const handleClosePopover = () => {
    dispatch(setAnchorSubMenuPopover(null));
    dispatch(setOpenSubMenuPopover(null));
  };

  return (
    <Drawer variant="permanent" open={openAsideMenu}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerOpen}>
          {openAsideMenu ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {navSubItems.map((item) => (
          <Box key={'lib-menu-' + item.index}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: openAsideMenu ? 'center' : 'initial',
                px: 2.5,
              }}
              onClick={handleClickListOpen(item.index, openAsideMenu)}
            >
              {openAsideMenu ? (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openAsideMenu ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              ) : (
                <Tooltip title={item.label}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openAsideMenu ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
              )}
              <ListItemText
                primary={item.label}
                sx={{ opacity: openAsideMenu ? 1 : 0 }}
              />
              {openListMenu === item.index ? (
                openAsideMenu ? (
                  <ExpandLess />
                ) : null
              ) : openAsideMenu ? (
                <ExpandMore />
              ) : null}
            </ListItemButton>
            <Collapse
              key={'cls-menu-' + item.index}
              in={openListMenu === item.index}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {item.submenu.map((subItem) => (
                  <ListItemButton
                    LinkComponent={Link}
                    to={subItem.link}
                    key={'lib-sub-item-' + item.index + '-' + subItem.index}
                    sx={{
                      minHeight: 48,
                      justifyContent: openAsideMenu ? 'center' : 'initial',
                      px: 2.5,
                    }}
                  >
                    <ListItemText
                      primary={subItem.label}
                      sx={{ opacity: openAsideMenu ? 1 : 0 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <Popover
              key={'pop-sub-item-' + item.index}
              id={'simple-popover-' + item.label}
              open={openSubMenuPopover === item.index}
              anchorEl={anchorSubMenuPopover}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <List component="div" disablePadding>
                {item.submenu.map((subItem) => (
                  <ListItemButton
                    onClick={handleClosePopover}
                    LinkComponent={Link}
                    to={subItem.link}
                    key={'poplib-sub-item-' + item.index + '-' + subItem.index}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemText primary={subItem.label} />
                  </ListItemButton>
                ))}
              </List>
            </Popover>
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default AsideMenu;
