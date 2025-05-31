import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../slices/messageSlice';
import jwtService from '../auth/services/jwtService';

export const setUser = createAsyncThunk('user/setUser', async (user, { dispatch }) => {
  if (user.loginRedirectUrl) {

  }
  return user;
});

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { getState }) => {
    const { user } = getState();
    const updatedUser = {
      ...user,
      data: { ...user.data, settings },
    };
    
    return updatedUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  'user/updateShortcuts',
  async (shortcuts, { getState }) => {
    const { user } = getState();
    const updatedUser = {
      ...user,
      data: { ...user.data, shortcuts },
    };

    return updatedUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    return null;
  }

  dispatch(userLoggedOut());
  dispatch(showMessage({ message: 'Logged out successfully' }));
};

export const updateUserData = (user) => async (dispatch) => {
  if (!user.role || user.role.length === 0) {
    return;
  }

  try {
    await jwtService.updateUserData(user);
    dispatch(showMessage({ message: 'User data saved successfully' }));
  } catch (error) {
    dispatch(showMessage({ message: error.message }));
  }
};

const initialState = {
  role: [],
  data: {
    id: '',
    name: '',
    email: '',
    mobile: '',
    photoURL: '',
    shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
  },
  organization_id: '',
  stop_id: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.data.settings = action.payload.data.settings;
      })
      .addCase(updateUserShortcuts.fulfilled, (state, action) => {
        state.data.shortcuts = action.payload.data.shortcuts;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = (state) => state.user;

export const selectUserShortcuts = (state) => state.user.data.shortcuts;

export default userSlice.reducer;
