import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/notification.api.js';

export const fetchMyNotifications = createAsyncThunk(
    'notifications/fetchMine',
    async (unreadOnly, { rejectWithValue }) => {
        try {
            const { data } = await api.getMyNotificationsApi(unreadOnly);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed');
        }
    }
);

export const fetchAdminNotifications = createAsyncThunk(
    'notifications/fetchAdmin',
    async (unreadOnly, { rejectWithValue }) => {
        try {
            const { data } = await api.getAdminNotificationsApi(unreadOnly);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed');
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notifications/unreadCount',
    async (forAdmin, { rejectWithValue }) => {
        try {
            const { data } = await api.getUnreadCountApi(forAdmin);
            return data.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markRead',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.markAsReadApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed');
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (forAdmin, { rejectWithValue }) => {
        try {
            await api.markAllAsReadApi(forAdmin);
            return forAdmin;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: { myNotifications: [], adminNotifications: [], unreadCount: 0, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyNotifications.fulfilled, (state, action) => { state.myNotifications = action.payload; })
            .addCase(fetchAdminNotifications.fulfilled, (state, action) => { state.adminNotifications = action.payload; })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => { state.unreadCount = action.payload; })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const update = (arr) => {
                    const idx = arr.findIndex(n => n._id === action.payload._id);
                    if (idx !== -1) arr[idx].isRead = true;
                };
                update(state.myNotifications);
                update(state.adminNotifications);
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
                if (action.payload) {
                    state.adminNotifications.forEach(n => n.isRead = true);
                } else {
                    state.myNotifications.forEach(n => n.isRead = true);
                }
                state.unreadCount = 0;
            });
    }
});

export default notificationSlice.reducer;
