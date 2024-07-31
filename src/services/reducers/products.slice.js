import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import endPoints from '../api';
import { setLoading } from './ui.slice';

const initialState = {
  products: [],
  countProducts: 0,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ token, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const productsCount = await axios.get(
        endPoints.product.products.count,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productsRes = await axios.get(
        limit !== undefined && offset !== undefined
          ? endPoints.product.products.getFiltered(limit, offset)
          : endPoints.product.products.getAll,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setCountProducts(productsCount.data));
      dispatch(setProducts(productsRes.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const postProduct = createAsyncThunk(
  'products/postProduct ',
  async ({ token, newProduct, limit, offset }, { dispatch }) => {
    console.log(newProduct);
    try {
      dispatch(setLoading(true));
      await axios.post(endPoints.product.products.add, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchProducts({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  },
);

export const delProduct = createAsyncThunk(
  'products/delProduct ',
  async ({ token, rowid, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(endPoints.product.products.delete(rowid), {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchProducts({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const patchProduct = createAsyncThunk(
  'products/putProduct ',
  async ({ token, rowid, updatedRecord, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.patch(
        endPoints.product.products.update(rowid),
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(fetchProducts({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCountProducts: (state, action) => {
      state.countProducts = action.payload;
    },
    addProduct: (state, action) => {
      const id = action.payload;
      state.products = [
        ...state.products,
        { id, name: '', description: '', location: '', state: true, isNew: true, subCategoryRowid: '', taxRowid: '' },
      ];
    },
    removeNewProduct: (state, action) => {
      const id = action.payload;
      const editedRow = state.products.find((row) => row.id === id);
      if (editedRow && editedRow.isNew) {
        state.products = state.products.filter((row) => row.id !== id);
      }
    },
  },
});

export const {
  setProducts,
  setCountProducts,
  addProduct,
  removeNewProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
