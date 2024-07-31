import { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
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
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../containers/Layout';
import Headboard from '../components/Headboard';
import TooltipAdd from '../components/TooltipAdd';
import NoRowsOverlay from '../components/NoRowsOverlay';
import {
  fetchProducts,
  postProduct,
  delProduct,
  patchProduct,
  addProduct,
  removeNewProduct,
} from '../services/reducers/products.slice';
import {
  fetchCategories,
} from '../services/reducers/categories.slice';
import {
  fetchSubCategories,
} from '../services/reducers/sub_categories.slice';
import {
  fetchTaxes,
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

const Products = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const isLoading = useSelector((state) => state.ui.loading);
  const categories = useSelector((state) => state.categories.categories);
  const subCategories = useSelector(
    (state) => state.subCategories.subCategories,
  );
  const taxes = useSelector(
    (state) => state.taxes.taxes,
  );
  const products = useSelector(
    (state) => state.products.products,
    shallowEqual,
  );
  const totalProducts = useSelector(
    (state) => state.products.countProducts,
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
  const [rowCountState, setRowCountState] = useState(totalProducts || 0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    if(user) {
      dispatch(
        fetchProducts({
          token: user,
          limit: paginationModel.pageSize,
          offset: paginationModel.pageSize * paginationModel.page,
        }),
      );
      dispatch(
        fetchCategories({
          token: user,
        }),
      );
      dispatch(
        fetchSubCategories({
          token: user,
        }),
      );
      dispatch(
        fetchTaxes({
          token: user,
        }),
      );
    }
  }, [dispatch, paginationModel, user]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      totalProducts !== undefined ? totalProducts : prevRowCountState,
    );
  }, [totalProducts, setRowCountState]);

  const handleAdd = () => {
    const id = generateUuidV4();
    dispatch(addProduct(id));
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'reference' },
    }));
  };

  const productsModel = [
    {
      field: 'reference',
      headerName: 'Referencia',
      width: 100,
      editable: true,
    },
    {
      field: 'name',
      headerName: 'Producto',
      width: 200,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Descripcion',
      width: 300,
      editable: true,
    },
    {
      field: 'location',
      headerName: 'Ubicacion',
      width: 200,
      editable: true,
    },
    {
      field: 'cost',
      headerName: 'Costo',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      field: 'stock',
      headerName: 'Existencia',
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
      field: 'taxRowid',
      headerName: 'Impuesto',
      type: 'singleSelect',
      width: 200,
      editable: true,
      getOptionValue: (value) => value.rowid,
      getOptionLabel: (value) => value.name,
      valueOptions: taxes,
    },
    {
      field: 'subCategoryRowid',
      headerName: 'SubCategoria',
      type: 'singleSelect',
      width: 200,
      editable: true,
      getOptionValue: (value) => value.rowid,
      getOptionLabel: (value) => value.name,
      valueOptions: subCategories,
    },
    {
      field: 'categoryRowid',
      headerName: 'Categoria',
      type: 'singleSelect',
      width: 200,
      editable: false,
      getOptionValue: (value) => value.rowid,
      getOptionLabel: (value) => value.name,
      valueOptions: categories,
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
    dispatch(removeNewProduct(id));
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (rowid) => () => {
    dispatch(
      delProduct({
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
          postProduct({
            token: user,
            newProduct: newRow,
            limit: paginationModel.pageSize,
            offset: paginationModel.pageSize * paginationModel.page,
          }),
        );
      } else {
        const dataNewRow = difObj(newRow, oldRow);
        dispatch(
          patchProduct({
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
      <Headboard menu={'Producto'} subMenu={'Productos'}>
        <TooltipAdd onOpenForm={handleAdd} />
      </Headboard>
        <Box sx={{ width: '90%', height: heigthGrid }}>
          <Paper sx={{ width: '100%', mb: 2, height: heigthGrid }}>
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              sx={{ p: 1 }}
              rows={products}
              columns={productsModel}
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
    </Layout>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default Products;
