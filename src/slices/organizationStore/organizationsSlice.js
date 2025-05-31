import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getOrganizations = createAsyncThunk(
  'organizations/getOrganizations',
  async () => {
    const response = await axios.get('/api/organization/foruser/list');
    if(response.status === 404){
      return [];
    }else if(response.status === 200){
      const data = await response.data.data;
      return data;
    }else{
      return [];
    }
  }
);

export const removeOrganizations = createAsyncThunk(
  'organizations/removeOrganizations',
  async (organizationIds, { dispatch, getState }) => {
    try {
      return organizationIds;
    } catch (error) {
      return [];
    }
  }
);

const organizationsAdapter = createEntityAdapter({});

export const { selectAll: selectOrganizations, selectById: selectOrganizationById } =
  organizationsAdapter.getSelectors((state) => state.organizations);

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState: organizationsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setOrganizationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (value) => ({ payload: value || '' }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizations.fulfilled, organizationsAdapter.setAll)
      .addCase(removeOrganizations.fulfilled, (state, action) =>
        organizationsAdapter.removeMany(state, action.payload)
      );
  },
});

export const { setOrganizationsSearchText } = organizationsSlice.actions;

export const selectOrganizationsSearchText = ({ organizations }) => organizations.searchText;

export default organizationsSlice.reducer;
