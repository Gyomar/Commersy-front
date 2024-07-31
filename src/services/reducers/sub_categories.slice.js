import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import endPoints from '../api';
import { setLoading } from './ui.slice';
import { setProducts } from './products.slice'

const initialState = {
  subCategories: [],
  countSubCategories: 0,
};

export const fetchSubCategories = createAsyncThunk(
  'subCategories/fetchSubCategories',
  async ({ token, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const subCategoriesCount = await axios.get(
        endPoints.product.subCategories.count,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const subCategoriesRes = await axios.get(
        limit !== undefined && offset !== undefined
          ? endPoints.product.subCategories.getFiltered(limit, offset)
          : endPoints.product.subCategories.getAll,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(setCountSubCategories(subCategoriesCount.data));
      dispatch(setSubCategories(subCategoriesRes.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const fetchSubCategory = createAsyncThunk(
  'categories/fetchSubCategory',
  async ({ token, rowid }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const subCategoryRes = await axios.get(endPoints.product.subCategories.getOne(rowid),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setProducts(subCategoryRes.data.products));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const postSubCategory = createAsyncThunk(
  'subCategories/postSubCategory ',
  async ({ token, newSubCategory, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.post(endPoints.product.subCategories.add, newSubCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchSubCategories({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  },
);

export const delSubCategory = createAsyncThunk(
  'subCategories/delSubCategory ',
  async ({ token, rowid, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(endPoints.product.subCategories.delete(rowid), {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchSubCategories({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const patchSubCategory = createAsyncThunk(
  'subCategories/putSubCategory ',
  async ({ token, rowid, updatedRecord, limit, offset }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await axios.patch(
        endPoints.product.subCategories.update(rowid),
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(fetchSubCategories({ token, limit, offset }));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
    }
  },
);

export const subCategoriesSlice = createSlice({
  name: 'subCategories',
  initialState,
  reducers: {
    setSubCategories: (state, action) => {
      state.subCategories = action.payload.map(subCategory => ({
        ...subCategory,
        categoryRowid: subCategory.category?.rowid,
      }));
    },
    setCountSubCategories: (state, action) => {
      state.countSubCategories = action.payload;
    },
    addSubCategory: (state, action) => {
      const id = action.payload;
      state.subCategories = [
        ...state.subCategories,
        {
          id,
          name: '',
          description: '',
          state: true,
          isNew: true,
          categoryRowid: ''
        },
      ];
    },
    removeNewSubCategory: (state, action) => {
      const id = action.payload;
      const editedRow = state.subCategories.find((row) => row.id === id);
      if (editedRow && editedRow.isNew) {
        state.subCategories = state.subCategories.filter(
          (row) => row.id !== id,
        );
      }
    },
  },
});

export const {
  setSubCategories,
  setCountSubCategories,
  addSubCategory,
  removeNewSubCategory,
} = subCategoriesSlice.actions;

export default subCategoriesSlice.reducer;
