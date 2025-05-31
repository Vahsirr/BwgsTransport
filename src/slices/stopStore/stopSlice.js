import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getStop = createAsyncThunk('stop/getStop', async (stopId) => {
        const response = await axios.get(`/api/bus-stop/foruser?stop_id=${stopId}`);
        if (response.status === 200) {
            const data = await response.data.data;
            return data;
        }
    });

const initialState = {
    id: '',
    route_id: '',
    stopName: '',
    stopOrder: '',
    latitude: '',
    longitude: '',
    arrivalTime: '',
    departureTime: '',
    createdAt: '',
    updatedAt: '',
    organization_id: '',
    stopDetails: '',
    stopLandMark: '',
    routeName: '',
    organizationName: ''
}

const stopSlice = createSlice({
    name: 'stop',
    initialState: initialState,
    reducers: {
        resetStop: () => null
    },
    extraReducers: (builder) => {
        builder.addCase(getStop.fulfilled, (state, action) => {
            return action.payload;
        })
    }
});

export const { resetStop } = stopSlice.actions;

export const selectStop = ({ stop }) => stop;

export default stopSlice.reducer;
