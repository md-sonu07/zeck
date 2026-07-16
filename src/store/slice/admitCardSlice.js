import { createSlice } from '@reduxjs/toolkit';
import {
    fetchAdmitCardsByPage,
    fetchAdmitCardById,
    searchAdmitCards,
    createAdmitCard,
    updateAdmitCard,
    deleteAdmitCard,
    bulkCreateAdmitCards
} from '../thunk/admitCardThunk';

const admitCardSlice = createSlice({
    name: 'admitCards',
    initialState: {
        cards: [],
        currentCard: null,
        searchResults: [],
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentCard: (state) => {
            state.currentCard = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        resetAdmitCardStatus: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmitCardsByPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmitCardsByPage.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload;
            })
            .addCase(fetchAdmitCardsByPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAdmitCardById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmitCardById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCard = action.payload;
            })
            .addCase(fetchAdmitCardById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchAdmitCards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchAdmitCards.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchAdmitCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAdmitCard.fulfilled, (state, action) => {
                state.cards.unshift(action.payload);
            })
            .addCase(updateAdmitCard.fulfilled, (state, action) => {
                const index = state.cards.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.cards[index] = action.payload;
                }
                if (state.currentCard && state.currentCard._id === action.payload._id) {
                    state.currentCard = action.payload;
                }
            })
            .addCase(deleteAdmitCard.fulfilled, (state, action) => {
                state.cards = state.cards.filter(c => c._id !== action.payload);
                if (state.currentCard && state.currentCard._id === action.payload) {
                    state.currentCard = null;
                }
            })
            .addCase(bulkCreateAdmitCards.fulfilled, (state, action) => {
                if (action.payload.cards) {
                    state.cards.unshift(...action.payload.cards);
                }
            });
    }
});

export const { clearCurrentCard, clearSearchResults, resetAdmitCardStatus } = admitCardSlice.actions;
export default admitCardSlice.reducer;
