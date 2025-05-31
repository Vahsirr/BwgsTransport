import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getStops = createAsyncThunk("stops/getStops", async (routeId) => {
  const response = await axios.get(`/api/bus-stop/foruser/list?route_id=${routeId}`);
  if (response.status === 200) {
    const data = await response.data.data.busStopsList;
    return data;
  } else {
    return [];
  }
});

export const removeStops = createAsyncThunk(
  "stops/removeStops",
  async (stopIds, { dispatch, getState }) => {
    return stopIds;
  }
);

const stopsAdapter = createEntityAdapter({});

export const { selectAll: selectStops, selectById: selectStopById } =
  stopsAdapter.getSelectors((state) => state.stops);

const stopsSlice = createSlice({
  name: "stops",
  initialState: stopsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setStopsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStops.fulfilled, stopsAdapter.setAll)
      .addCase(removeStops.fulfilled, (state, action) =>
        stopsAdapter.removeMany(state, action.payload)
      );
  },
});

export const { setStopsSearchText } = stopsSlice.actions;

export const selectStopsSearchText = ({ stops }) => stops.searchText;

export default stopsSlice.reducer;
