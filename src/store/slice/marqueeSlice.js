import { createSlice } from '@reduxjs/toolkit';
import {
    fetchMarquees,
    fetchActiveMarquees,
    createMarquee,
    updateMarquee,
    deleteMarquee
} from '../thunk/marqueeThunk';

const marqueeSlice = createSlice({
    name: 'marquee',
    initialState: {
        marquees: [],
        activeMarquees: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearMarqueeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Marquees
            .addCase(fetchMarquees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarquees.fulfilled, (state, action) => {
                state.loading = false;
                state.marquees = action.payload;
            })
            .addCase(fetchMarquees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Active Marquees
            .addCase(fetchActiveMarquees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveMarquees.fulfilled, (state, action) => {
                state.loading = false;
                state.activeMarquees = action.payload;
            })
            .addCase(fetchActiveMarquees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Marquee
            .addCase(createMarquee.fulfilled, (state, action) => {
                state.marquees.unshift(action.payload);
                if (action.payload.isActive) {
                    state.activeMarquees.unshift(action.payload);
                }
            })
            // Update Marquee
            .addCase(updateMarquee.fulfilled, (state, action) => {
                const index = state.marquees.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.marquees[index] = action.payload;
                }

                // Update activeMarquees list
                if (action.payload.isActive) {
                    const activeIndex = state.activeMarquees.findIndex(m => m._id === action.payload._id);
                    if (activeIndex !== -1) {
                        state.activeMarquees[activeIndex] = action.payload;
                    } else {
                        state.activeMarquees.unshift(action.payload);
                    }
                } else {
                    state.activeMarquees = state.activeMarquees.filter(m => m._id !== action.payload._id);
                }
            })
            // Delete Marquee
            .addCase(deleteMarquee.fulfilled, (state, action) => {
                state.marquees = state.marquees.filter(m => m._id !== action.payload);
                state.activeMarquees = state.activeMarquees.filter(m => m._id !== action.payload);
            });
    }
});

export const { clearMarqueeError } = marqueeSlice.actions;
export default marqueeSlice.reducer;
