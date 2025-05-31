import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getRoutes = createAsyncThunk(
    'routes/getRoutes',
    async (organizationId, { dispatch, getState }) => {
        const response = await axios.get(`/api/routeDetails/foruser/list?organization_id=${organizationId}`);
        if (response.status === 200) {
            const data = await response.data.data.routeDetails;
            return data;
        } else {
            return [];
        }
    });

export const removeRoutes = createAsyncThunk(
    'routes/removeRoutes',
    async (routeIds, { dispatch, getState }) => {
        return routeIds;
    }
);

const routesAdapter = createEntityAdapter({});

export const { selectAll: selectRoutes, selectById: selectRouteById } =
    routesAdapter.getSelectors((state) => state.routes);

const routesSlice = createSlice({
    name: 'routes',
    initialState: routesAdapter.getInitialState({
        searchText: '',
    }),
    reducers: {
        setRoutesSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload;
            },
            prepare: (event) => ({ payload: event.target.value || '' }),
        },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getRoutes.fulfilled, routesAdapter.setAll)
        .addCase(removeRoutes.fulfilled, (state, action) =>
          routesAdapter.removeMany(state, action.payload)
        );
    },
});

export const { setRoutesSearchText } = routesSlice.actions;

export const selectRoutesSearchText = ({ routes }) => routes.searchText;

export default routesSlice.reducer;
