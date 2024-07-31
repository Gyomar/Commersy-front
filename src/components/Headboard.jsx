import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import PropTypes from "prop-types";

const Headboard = ({ menu, subMenu, children }) => {

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        width: "100%",
        height: "112px",
        borderBottom: "1px #000000 solid",
        backgroundColor: "#ffffff",
      }}
    >
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            {menu}
          </Link>
          <Typography color="text.primary">{subMenu}</Typography>
        </Breadcrumbs>
      </div>
      <Toolbar
        disableGutters
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {subMenu}
        </Typography>
        {children}
      </Toolbar>
    </Box>
  );
};

Headboard.propTypes = {
  menu: PropTypes.string.isRequired,
  subMenu: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Headboard;
