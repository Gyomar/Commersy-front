import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import TopAppBar from "../components/TopAppBar";
import AsideMenu from "../components/AsideMenu";
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const openAsideMenu = useSelector((state) => state.ui.openAsideMenu);
  return (
    <div className="Layout">
      <CssBaseline />
      <TopAppBar />
      <AsideMenu />
        <Box
          sx={{
            ml: openAsideMenu ? "240px" : "65px",
            width: openAsideMenu ? "calc(100% - 240px)" : "calc(100% - 65px)",
            height: "calc(100vh - 64px)",
            transition: openAsideMenu
              ? "195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
              : "225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            bgcolor: "rgba(0, 0, 0, .03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {children}
        </Box>
    </div>
  );
};

export default Layout;
