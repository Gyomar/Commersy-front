import { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
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
} from '@mui/x-data-grid';
import {
  Box,
  Paper,
  Snackbar,
  Alert,
  Tooltip,
  LinearProgress,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { v4 as uuidv4 } from 'uuid';
import Layout from '../containers/Layout';
import Headboard from '../components/Headboard';
import TooltipAdd from '../components/TooltipAdd';
import NoRowsOverlay from '../components/NoRowsOverlay';
import {
  fetchTaxes,
  fetchTax,
  postTax,
  delTax,
  patchTax,
  addTax,
  removeNewTax,
} from '../services/reducers/taxes.slice';

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

const Taxes = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const isLoading = useSelector((state) => state.ui.loading);
  const products = useSelector(
    (state) => state.products.products,
  );
  const taxes = useSelector(
    (state) => state.taxes.taxes,
    shallowEqual,
  );
  const totalTaxes = useSelector(
    (state) => state.taxes.countTaxes,
  );
  let heightWindow = window.innerHeight;
  let heigthGrid = undefined;

  if (heightWindow <= 600) {
    heigthGrid = heightWindow * 0.6;
  } else if (heightWindow <= 700) {
    heigthGrid = heightWindow * 0.65;
  } else if (heightWindow <= 800) {
    heigthGrid = heightWindow * 0.7;
  } else {
    heigthGrid = heightWindow * 0.75;
  }

  const [rowModesModel, setRowModesModel] = useState({});
  const [rowCountState, setRowCountState] = useState(totalTaxes || 0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const [snackbar, setSnackbar] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [taxView, setTaxView] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(
        fetchTaxes({
          token: user,
          limit: paginationModel.pageSize,
          offset: paginationModel.pageSize * paginationModel.page,
        }),
      );
    }
  }, [dispatch, paginationModel, user]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      totalTaxes !== undefined ? totalTaxes : prevRowCountState,
    );
  }, [totalTaxes, setRowCountState]);

  const handleView = (rowid, name) => () => {
    dispatch(
      fetchTax({
        token: user,
        rowid: rowid,
      }),
    );
    setTaxView(name);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };

  const handleAdd = () => {
    const id = generateUuidV4();
    dispatch(addTax(id));
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  const taxesModel = [
    {
      field: 'name',
      headerName: 'Impuesto',
      width: 200,
      editable: true,
    },
    {
      field: 'value',
      headerName: 'Valor',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      field: 'state',
      headerName: 'Estado',
      type: 'boolean',
      width: 100,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
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
                  color: 'primary.main',
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
            key="view-action"
            icon={<VisibilityIcon />}
            label="Ver"
            onClick={handleView(params.row.rowid, params.row.name)}
            color="inherit"
            showInMenu
          />,
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
            onClick={handleDeleteClick(params.row.rowid)}
            color="inherit"
            showInMenu
          />,
        ];
      },
    },
  ];

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    dispatch(removeNewTax(id));
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (rowid) => () => {
    dispatch(
      delTax({
        token: user,
        rowid: rowid,
        limit: paginationModel.pageSize,
        offset: paginationModel.pageSize * paginationModel.page,
      }),
    );
  };

  const difObj = (newObj, oldObj) => {
    const difObj = {};
    for (const key in oldObj) {
      if (oldObj[key] !== newObj[key]) {
        difObj[key] = newObj[key];
      }
    }
    return difObj;
  };

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      if (newRow.isNew) {
        await dispatch(
          postTax({
            token: user,
            newTax: newRow,
            limit: paginationModel.pageSize,
            offset: paginationModel.pageSize * paginationModel.page,
          }),
        );
      } else {
        const dataNewRow = difObj(newRow, oldRow);
        dispatch(
          patchTax({
            token: user,
            rowid: newRow.rowid,
            updatedRecord: dataNewRow,
            limit: paginationModel.pageSize,
            offset: paginationModel.pageSize * paginationModel.page,
          }),
        );
      }
      setSnackbar({
        children: 'Registro guardado con éxito',
        severity: 'success',
      });
      return newRow;
    },
    [dispatch, paginationModel.page, paginationModel.pageSize, user],
  );

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Layout>
      <Headboard menu={'Gestion'} subMenu={'Impuestos'}>
        <TooltipAdd onOpenForm={handleAdd} />
      </Headboard>
      <Box sx={{ width: '90%', height: heigthGrid }}>
        <Paper sx={{ width: '100%', mb: 2, height: heigthGrid }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{ p: 1 }}
            rows={taxes}
            columns={taxesModel}
            loading={isLoading}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
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
                vertical: 'bottom',
                horizontal: 'center',
              }}
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
        </Paper>
      </Box>
      {isLoading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <Dialog
        onClose={handleCloseView}
        open={openView}
        scroll="paper"
        maxWidth="sm"
      >
        <DialogTitle>{taxView}</DialogTitle>
        <DialogContent dividers={true}>
          {products.length !== 0 ? (
            <Table
              sx={{ minWidth: 370 }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripcion</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((row) => (
                  <TableRow
                    key={row.rowid}
                  >
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.state? <CheckIcon/> : <CloseIcon/>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <NoRowsOverlay />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default Taxes;
