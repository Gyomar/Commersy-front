import { combineReducers } from 'redux';
import categoriesReducer from './categories.slice';
import subCategoriesReducer from './sub_categories.slice';
import productsReducer from './products.slice';
import taxesReducer from './taxes.slice';
import uiReducer from './ui.slice';
import sessionReducer from './session.slice';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  subCategories: subCategoriesReducer,
  products: productsReducer,
  taxes: taxesReducer,
  ui: uiReducer,
  session: sessionReducer,
});

export default rootReducer;