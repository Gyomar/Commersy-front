import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import endPoints from '../api';

const initialState = {
  user: null,
};

export const postSession = createAsyncThunk(
  'sessions/postSession ',
  async ({ user }, { dispatch }) => {
    try {
      const session = await axios.post(endPoints.auth.validate, { user }, {
        headers: {
          Auth: endPoints.apiKey,
        },
      });
      if (session.data.accessToken) {
        const token = session.data.accessToken;

        dispatch(setUser(token));
        Cookies.set('myAppToken', token, { expires: 1 / 24 });

        const renewalInterval = setInterval(async () => {
          try {
            const newToken = await axios.post(endPoints.auth.renew, { user: token }, {
              headers: {
                Auth: endPoints.apiKey,
              },
            });
            Cookies.set('myAppToken', newToken.data.accessToken, {
              expires: 1 / 24,
            });
            dispatch(setUser(newToken.data.accessToken));
          } catch (error) {
            console.error('Error renovando el token:', error);
          }
        }, 60 * 58 * 1000);

        return () => clearInterval(renewalInterval);
      }
    } catch (error) {
      console.error(error);
    }
  },
);

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = sessionSlice.actions;

export default sessionSlice.reducer;
