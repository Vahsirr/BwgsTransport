import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getRoute = createAsyncThunk('route/getRoute', async (routeId) => {
    const response = await axios.get(`/api/routeDetails/foruser?route_id=${routeId}`);
    if(response.status === 200){
      const data = await response.data.data;
      return data;
    }
});

const initialState = {
    id: '',
    routeName: '',
    startpoint: '',
    endpoint: '',
    estimatedDistance: '',
    estimatedTravelTime: '',
    organization_id: '',
    mapId: '',
    created_at: '',
    updated_at: '',
    organizationName: ''
}

const routeSlice = createSlice({
    name: 'route',
    initialState: initialState,
    reducers: {
        resetRoute: () => null
    },
    extraReducers: (builder) => {
        builder.addCase(getRoute.fulfilled, (state, action) => {
            return action.payload;
        })
    }
});

export const { resetRoute } = routeSlice.actions;

export const selectRoute = ({ route }) => route;

export default routeSlice.reducer;
