import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Layout from "../containers/Layout";
import Headboard from "../components/Headboard";
import TooltipAdd from "../components/TooltipAdd";
import NoRowsOverlay from "../components/NoRowsOverlay";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {
  GridRowModes,
  GridActionsCellItem,
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowEditStopReasons,
  esES,
} from "@mui/x-data-grid";
import { DateField } from "@mui/x-date-pickers/DateField";
import { fetchCategories } from "../services/reducers/categories.slice";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}

const generateUuidV4 = () => {
  return uuidv4();
};

function EditToolbar(props) {
  const { setPurchaseRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = generateUuidV4();
    setPurchaseRows((oldRows) => [
      ...oldRows,
      {
        id,
        product: "",
        quantity: "",
        unitCost: "",
        totalCost: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "product" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Añadir Registro
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setPurchaseRows: PropTypes.array.isRequired,
  setRowModesModel: PropTypes.object.isRequired,
};

const currencyFormatter = new Intl.NumberFormat("en-CO", {
  style: "currency",
  currency: "COP",
});

const usdPrice = {
  type: "number",
  valueFormatter: ({ value }) => currencyFormatter.format(value),
  cellClassName: "font-tabular-nums",
};

const Purchase = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.ui.loading);
  const categories = [];
  const totalCategories = 0;
  let heightWindow = window.innerHeight;
  let heigthGrid = undefined;
  let heigthGridForm = undefined;

  if (heightWindow <= 600) {
    heigthGrid = heightWindow * 0.6;
    heigthGridForm = heightWindow * 0.4;
  } else if (heightWindow <= 700) {
    heigthGrid = heightWindow * 0.65;
    heigthGridForm = heightWindow * 0.45;
  } else if (heightWindow <= 800) {
    heigthGrid = heightWindow * 0.7;
    heigthGridForm = heightWindow * 0.5;
  } else {
    heigthGrid = heightWindow * 0.75;
    heigthGridForm = heightWindow * 0.55;
  }

  const [purchaseRows, setPurchaseRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rowCountState, setRowCountState] = useState(totalCategories || 0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [snackbar, setSnackbar] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    dispatch(
      fetchCategories({
        limit: paginationModel.pageSize,
        offset: paginationModel.pageSize * paginationModel.page,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      totalCategories !== undefined ? totalCategories : prevRowCountState
    );
  }, [totalCategories, setRowCountState]);

  const categoriesModel = [
    {
      field: "date",
      headerName: "Fecha",
      type: "date",
      width: 100,
    },
    {
      field: "purchase",
      headerName: "Compra",
      type: "number",
      width: 120,
    },
    {
      field: "provider",
      headerName: "Proveedor",
      width: 300,
    },
    {
      field: "coin",
      headerName: "Moneda",
      width: 150,
    },
    {
      field: "payment-condition",
      headerName: "Condicion de Pago",
      width: 150,
    },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      ...usdPrice,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: () => {
        return [
          <GridActionsCellItem
            key="view-action"
            icon={<EditIcon />}
            label="Ver"
            className="textPrimary"
            color="inherit"
            showInMenu
          />,
          <GridActionsCellItem
            key="print-action"
            icon={<DeleteIcon />}
            label="Imprimir"
            color="inherit"
            showInMenu
          />,
          <GridActionsCellItem
            key="null-action"
            icon={<DeleteIcon />}
            label="Anular"
            color="inherit"
            showInMenu
          />,
        ];
      },
    },
  ];

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setPurchaseRows(purchaseRows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = purchaseRows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setPurchaseRows(purchaseRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setPurchaseRows(
      purchaseRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const purchaseFormModel = [
    {
      field: "product",
      headerName: "Producto",
      width: 400,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      type: "number",
      width: 100,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "unitCost",
      headerName: "Costo Unitario",
      width: 150,
      align: "right",
      headerAlign: "center",
      editable: true,
      ...usdPrice,
    },
    {
      field: "totalCost",
      headerName: "Costo total",
      width: 180,
      align: "right",
      headerAlign: "center",
      editable: true,
      ...usdPrice,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Tooltip key="save-action" title="Guardar">
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Guardar"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(params.id)}
              />
            </Tooltip>,
            <Tooltip key="cancel-action" title="Cancelar">
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancelar"
                className="textPrimary"
                onClick={handleCancelClick(params.id)}
                color="inherit"
              />
            </Tooltip>,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit-action"
            icon={<EditIcon />}
            label="Editar"
            className="textPrimary"
            onClick={handleEditClick(params.id)}
            color="inherit"
            showInMenu
          />,

          <GridActionsCellItem
            key="delete-action"
            icon={<DeleteIcon />}
            label="Eliminar"
            onClick={handleDeleteClick(params.id)}
            color="inherit"
            showInMenu
          />,
        ];
      },
    },
  ];

  return (
    <Layout>
      <Headboard menu={"Compras"} subMenu={"Compra"}>
        <TooltipAdd onOpenForm={handleClickOpenForm} />
      </Headboard>
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box sx={{ width: "90%", height: heigthGrid }}>
          <Paper sx={{ width: "100%", mb: 2, height: heigthGrid }}>
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              sx={{ p: 1 }}
              rows={categories}
              columns={categoriesModel}
              disableColumnMenu
              rowCount={rowCountState}
              pageSizeOptions={[5, 10, 20]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              slots={{
                toolbar: CustomToolbar,
                loadingOverlay: LinearProgress,
                noRowsOverlay: NoRowsOverlay,
              }}
            />
            {!!snackbar && (
              <Snackbar
                open
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
              >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}
          </Paper>
        </Box>
      )}
      <div>
        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          fullWidth
          maxWidth={"lg"}
        >
          <DialogTitle>Compra</DialogTitle>
          <DialogContent sx={{ pb: 0 }}>
            <Grid container spacing={1} columns={{ xs: 8 }} sx={{ mt: 0 }}>
              <Grid item xs={6}>
                <Grid item xs={2}>
                  <DateField
                    label="Fecha"
                    readOnly
                    defaultValue={dayjs()}
                    format="DD-MM-YYYY"
                  />
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Grid item xs={8}>
                  <Typography variant="h6">Compra No.</Typography>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid item xs={8}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={[
                      { label: "The Shawshank Redemption", year: 1994 },
                      { label: "The Godfather", year: 1972 },
                      { label: "The Godfather: Part II", year: 1974 },
                      { label: "The Dark Knight", year: 2008 },
                      { label: "12 Angry Men", year: 1957 },
                      { label: "Schindler's List", year: 1993 },
                    ]}
                    renderInput={(params) => (
                      <TextField {...params} label="Proveedor" />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="outlined-select-currency"
                    select
                    label="Moneda"
                  ></TextField>
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="outlined-select-currency"
                    select
                    label="Condicion de Pago"
                  ></TextField>
                </Grid>
              </Grid>
              <Grid item xs={8}>
                <Box sx={{ height: heigthGridForm }}>
                  <DataGrid
                    localeText={
                      esES.components.MuiDataGrid.defaultProps.localeText
                    }
                    sx={{ p: 1 }}
                    rows={purchaseRows}
                    columns={purchaseFormModel}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    disableColumnMenu
                    hideFooter
                    slots={{
                      toolbar: EditToolbar,
                      loadingOverlay: LinearProgress,
                      noRowsOverlay: NoRowsOverlay,
                    }}
                    slotProps={{
                      toolbar: { setPurchaseRows, setRowModesModel },
                    }}
                  />
                </Box>
              </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={1}>
                  <Grid item xs={8}>
                    <Typography variant="h6">Total</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={1}>
                  <Grid item xs={8}>
                    <Typography textAlign={"right"} variant="subtitle1">COP 1.200.000</Typography>
                  </Grid>
                </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", py: 2 }}>
            <Button onClick={handleCloseForm}>Generar Compra</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Purchase;
