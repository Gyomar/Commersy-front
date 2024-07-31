import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { esES } from '@mui/x-data-grid';
import { esES as pickersEsES } from '@mui/x-date-pickers/locales';
import { esES as coreEsES } from '@mui/material/locale';

import Inter300woff2 from '/src/assets/fonts/inter-v12-latin-300.woff2';
import Inter300woff from '/src/assets/fonts/inter-v12-latin-300.woff';
import Inter400woff2 from '/src/assets/fonts/inter-v12-latin-regular.woff2';
import Inter400woff from '/src/assets/fonts/inter-v12-latin-regular.woff';
import Inter500woff2 from '/src/assets/fonts/inter-v12-latin-500.woff2';
import Inter500woff from '/src/assets/fonts/inter-v12-latin-500.woff';
import Inter600woff2 from '/src/assets/fonts/inter-v12-latin-600.woff2';
import Inter600woff from '/src/assets/fonts/inter-v12-latin-600.woff';
import Home from '/src/pages/Home';
import SignIn from '/src/pages/SignIn';
import Categories from '/src/pages/Categories';
import Products from '/src/pages/Products';
import Providers from '/src/pages/Providers';
import Customers from '/src/pages/Customers';
import Taxes from '/src/pages/Taxes';
import PriceLists from '/src/pages/PriceLists';
import PaymentMethods from '/src/pages/PaymentMethods';
import Coins from '/src/pages/Coins';
import SubCategories from '/src/pages/SubCategories';
import NotFound from '/src/pages/NotFound';
import Purchase from '/src/pages/Purchase';
import Dashboard from '/src/pages/Dashboard';
import Loading from '/src/components/Loading';

const theme = createTheme({
  typography: {
    fontFamily: ['Inter'],
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
			@font-face {
        font-display: swap; 
        font-family: 'Inter';
        font-style: normal;
        font-weight: 300;
        src: url(${Inter300woff2}) format('woff2'),
						url(${Inter300woff}) format('woff');
      }
      @font-face {
        font-display: swap; 
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url(${Inter400woff2}) format('woff2'),
						url(${Inter400woff}) format('woff');
      }
      @font-face {
        font-display: swap; 
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        src: url(${Inter500woff2}) format('woff2'),
						url(${Inter500woff}) format('woff');
      }
      @font-face {
        font-display: swap; 
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        src: url(${Inter600woff2}) format('woff2'),
						url(${Inter600woff}) format('woff');
      }
      `,
    },
  },
  esES,
  pickersEsES,
  coreEsES,
});

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {isAuthenticated && !isLoading ? (
              <>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/sign-in" element={<SignIn />} />
                <Route path="*" element={<NotFound />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/categories" element={<Categories />} />
                <Route exact path="/product-price" element={<Categories />} />
                <Route exact path="/products" element={<Products />} />
                <Route exact path="/sub-categories" element={<SubCategories />} />
                <Route exact path="/purchase" element={<Purchase />} />
                <Route
                  exact
                  path="/accounts-payable"
                  element={<Categories />}
                />
                <Route exact path="/providers" element={<Providers />} />
                <Route exact path="/customers" element={<Customers />} />
                <Route exact path="/quotes" element={<Categories />} />
                <Route
                  exact
                  path="/accounts-receivable"
                  element={<Categories />}
                />
                <Route exact path="/sale" element={<Categories />} />
                <Route exact path="/generate-lists" element={<Categories />} />
                <Route exact path="/taxes" element={<Taxes />} />
                <Route exact path="/price-lists" element={<PriceLists />} />
                <Route exact path="/payment-methods" element={<PaymentMethods />} />
                <Route exact path="/coins" element={<Coins />} />
                <Route exact path="/exchange-rates" element={<Categories />} />
              </>
            ) : isLoading ? (
              <Route path="*" element={<Loading />} />
            ) : (
              <>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/sign-in" element={<SignIn />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
