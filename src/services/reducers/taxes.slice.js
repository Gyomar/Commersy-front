import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import endPoints from '../api';
import { setLoading } from './ui.slice';
import { setProducts } from './products.slice'

const initialState = {
  taxes: [],
  countTaxes: 0,
};

export const fetchTaxes = createAsyncThunk(
  'taxes/fetchTaxes',
  async ({ token, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const taxesCount = await axios.get(
        endPoints.manage.taxes.count,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const taxesRes = await axios.get(
        limit !== undefined && offset !== undefined
          ? endPoints.manage.taxes.getFiltered(limit, offset)
          : endPoints.manage.taxes.getAll,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setCountTaxes(taxesCount.data));
      dispatch(setTaxes(taxesRes.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const fetchTax = createAsyncThunk(
  'taxes/fetchTax',
  async ({ token, rowid }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const taxRes = await axios.get(endPoints.manage.taxes.getOne(rowid),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setProducts(taxRes.data.products));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);


export const postTax = createAsyncThunk(
  'taxes/postTax ',
  async ({ token, newTax, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.post(endPoints.manage.taxes.add, newTax, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchTaxes({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  },
);

export const delTax = createAsyncThunk(
  'taxes/delTax ',
  async ({ token, rowid, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(endPoints.manage.taxes.delete(rowid), {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchTaxes({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const patchTax = createAsyncThunk(
  'taxes/putTax ',
  async ({ token, rowid, updatedRecord, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.patch(
        endPoints.manage.taxes.update(rowid),
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(fetchTaxes({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const taxesSlice = createSlice({
  name: 'taxes',
  initialState,
  reducers: {
    setTaxes: (state, action) => {
      state.taxes = action.payload;
    },
    setCountTaxes: (state, action) => {
      state.countTaxes = action.payload;
    },
    addTax: (state, action) => {
      const id = action.payload;
      state.taxes = [
        ...state.taxes,
        { id, name: '', state: true, isNew: true },
      ];
    },
    removeNewTax: (state, action) => {
      const id = action.payload;
      const editedRow = state.taxes.find((row) => row.id === id);
      if (editedRow && editedRow.isNew) {
        state.taxes = state.taxes.filter((row) => row.id !== id);
      }
    },
  },
});

export const {
  setTaxes,
  setCountTaxes,
  addTax,
  removeNewTax,
} = taxesSlice.actions;

export default taxesSlice.reducer;
