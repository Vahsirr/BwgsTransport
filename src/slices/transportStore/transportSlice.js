import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTransport = createAsyncThunk('transport/getTransport', async (transportId) => {
    const response = await axios.get(`/api/transportdetails/foruser?id=${transportId}`);
    if (response.status === 200) {
        const data = await response.data.data;
        return data;
    }
});

export const getTransportByDriverId = createAsyncThunk('transport/getTransportByDriverId', async (driverId) => {
    const response = await axios.get(`/api/transportdetails/fordriver?driverId=${driverId}`);
    if (response.status === 200) {
        const data = await response.data.data;
        return data;
    }
})

const initialState = {
    id: '',
    organizationId: '',
    organization_name: '',
    route_id: '',
    driverId: '',
    registrationNumber: '',
    transportType: '',
    capacity: '',
    driverName: '',
    driverContact: '',
    status: '',
}

const transportSlice = createSlice({
    name: 'transport',
    initialState: initialState,
    reducers: {
        resetTransport: () => null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransport.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(getTransportByDriverId.fulfilled, (state, action) => {
                return action.payload;
            })
    }
});

export const { resetTransport } = transportSlice.actions;

export const selectTransport = ({ transport }) => transport;

export default transportSlice.reducer;
