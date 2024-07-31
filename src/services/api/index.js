const isDevelopment = import.meta.env.MODE === 'development';
const API = isDevelopment ? import.meta.env.VITE_API_URL : 'https://lareceta-server.azurewebsites.net/api';
const apiKey = import.meta.env.VITE_API_KEY;

const createEndpoint = (basePath, routes) => {
  const createUrl = (path, params) => {
    const notSlash = typeof params === 'string' && (params.startsWith('?') || params === '');
    const separator = notSlash ? '' : '/';

    return `${path}${separator}${params}`;
  };

  const result = {};

  for (const [key, value] of Object.entries(routes)) {
    if (typeof value === 'function') {
      result[key] = (...args) => createUrl(basePath, value(...args));
    } else {
      result[key] = createUrl(basePath, value);
    }
  }

  return result;
};

const baseRoutes = {
  count: 'count',
  getOne: (rowid) => rowid,
  getFiltered: (limit, offset) => `?limit=${limit}&offset=${offset}`,
  getAll: '',
  add: '',
  update: (rowid) => rowid,
  delete: (rowid) => rowid,
};

const endPoints = {
  apiKey,
  auth: createEndpoint(`${API}/auth`, {
    validate: 'validate',
    renew: 'renew-token',
  }),
  manage:{
    coins: createEndpoint(`${API}/coins`, baseRoutes),
    exchangeRates: createEndpoint(`${API}/exchange-rates`, baseRoutes),
    paymentCoditions: createEndpoint(`${API}/payment-coditions`, baseRoutes),
    paymentMethods: createEndpoint(`${API}/payment-methods`, baseRoutes),
    taxes: createEndpoint(`${API}/taxes`, baseRoutes),
    typesDocuments: createEndpoint(`${API}/types-documents`, baseRoutes),
  },
  product:{
    categories: createEndpoint(`${API}/categories`, baseRoutes),
    pricesLists: createEndpoint(`${API}/prices-lists`, baseRoutes),
    productsPrices: createEndpoint(`${API}/products-prices`, baseRoutes),
    products: createEndpoint(`${API}/products`, baseRoutes),
    subCategories: createEndpoint(`${API}/sub-categories`, baseRoutes),
  },
  purchase:{
    expenses: createEndpoint(`${API}/expenses`, baseRoutes),
    productsPurchases: createEndpoint(`${API}/products-purchases`, baseRoutes),
    providers: createEndpoint(`${API}/providers`, baseRoutes),
    purchases: createEndpoint(`${API}/purchases`, baseRoutes),
  },
  sale:{
    customers: createEndpoint(`${API}/customers`, baseRoutes),
    incomes: createEndpoint(`${API}/incomes`, baseRoutes),
    productsQuotations: createEndpoint(`${API}/products-quotations`, baseRoutes),
    productsSales: createEndpoint(`${API}/products-sales`, baseRoutes),
    quotations: createEndpoint(`${API}/quotations`, baseRoutes),
    sales: createEndpoint(`${API}/sales`, baseRoutes),
    zones: createEndpoint(`${API}/zones`, baseRoutes),
  },
  user:{
    subscriptions: createEndpoint(`${API}/subscriptions`, baseRoutes),
    users: createEndpoint(`${API}/users`, baseRoutes),
  },
  files:{
    addImage: `${API}/files/upload/`,
  },
};

export default endPoints;
