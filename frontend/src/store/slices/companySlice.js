import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  company: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
      state.error = null;
    },
    updateCompany: (state, action) => {
      state.company = { ...state.company, ...action.payload };
    },
    clearCompany: (state) => {
      state.company = null;
      state.error = null;
    },
    setCompanyLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCompanyError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCompany,
  updateCompany,
  clearCompany,
  setCompanyLoading,
  setCompanyError,
  clearCompanyError,
} = companySlice.actions;

export default companySlice.reducer;

// Selectors
export const selectCompany = (state) => state.company.company;
export const selectCompanyLoading = (state) => state.company.loading;
export const selectCompanyError = (state) => state.company.error;