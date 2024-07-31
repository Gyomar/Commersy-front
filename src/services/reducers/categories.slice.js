import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import endPoints from '../api';
import { setLoading } from './ui.slice';
import { setSubCategories } from './sub_categories.slice'

const initialState = {
  categories: [],
  countCategories: 0,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ token, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const categoriesCount = await axios.get(
        endPoints.product.categories.count,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const categoriesRes = await axios.get(
        limit !== undefined && offset !== undefined
          ? endPoints.product.categories.getFiltered(limit, offset)
          : endPoints.product.categories.getAll,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setCountCategories(categoriesCount.data));
      dispatch(setCategories(categoriesRes.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const fetchCategory = createAsyncThunk(
  'categories/fetchCategory',
  async ({ token, rowid }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const categoryRes = await axios.get(endPoints.product.categories.getOne(rowid),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setSubCategories(categoryRes.data.subCategories));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);


export const postCategory = createAsyncThunk(
  'categories/postCategory ',
  async ({ token, newCategory, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.post(endPoints.product.categories.add, newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchCategories({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  },
);

export const delCategory = createAsyncThunk(
  'categories/delCategory ',
  async ({ token, rowid, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(endPoints.product.categories.delete(rowid), {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchCategories({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const patchCategory = createAsyncThunk(
  'categories/putCategory ',
  async ({ token, rowid, updatedRecord, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.patch(
        endPoints.product.categories.update(rowid),
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(fetchCategories({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCountCategories: (state, action) => {
      state.countCategories = action.payload;
    },
    addCategory: (state, action) => {
      const id = action.payload;
      state.categories = [
        ...state.categories,
        { id, name: '', description: '', state: true, isNew: true },
      ];
    },
    removeNewCategory: (state, action) => {
      const id = action.payload;
      const editedRow = state.categories.find((row) => row.id === id);
      if (editedRow && editedRow.isNew) {
        state.categories = state.categories.filter((row) => row.id !== id);
      }
    },
  },
});

export const {
  setCategories,
  setCountCategories,
  addCategory,
  removeNewCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
