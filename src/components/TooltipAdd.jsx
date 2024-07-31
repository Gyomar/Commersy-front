import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

// eslint-disable-next-line react/prop-types
const TooltipAdd = ({onOpenForm}) => {
  

  return (
    <Tooltip title="Nuevo">
      <Fab
        size="small"
        color="primary"
        aria-label="add"
        onClick={onOpenForm}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default TooltipAdd;
