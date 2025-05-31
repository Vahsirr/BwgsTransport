import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: null,
  options: {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    autoHideDuration: 2000,
    message: 'Hi',
    variant: null,
  },
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
      };
    },
    hideMessage: (state) => {
      state.state = null;
    },
  },
});

export const { hideMessage, showMessage } = messageSlice.actions;

export const selectAppMessageState = (state) => state.message.state;
export const selectAppMessageOptions = (state) => state.message.options;

export default messageSlice.reducer;
