import { describe, it, expect } from 'vitest';
import admitCardReducer, { clearCurrentCard, clearSearchResults, resetAdmitCardStatus } from '../store/slice/admitCardSlice';

const initialState = {
    cards: [],
    currentCard: null,
    searchResults: [],
    loading: false,
    error: null
};

const mockCard = {
    _id: 'card1',
    page: 'page1',
    collegeName: 'ABC College',
    studentName: 'John Doe',
    rollNumber: '2024001',
    admitCardFile: 'https://example.com/admit.pdf',
    additionalInfo: '',
    isActive: true
};

const mockCard2 = {
    _id: 'card2',
    page: 'page1',
    collegeName: 'XYZ College',
    studentName: 'Jane Smith',
    rollNumber: '2024002',
    admitCardFile: '',
    isActive: true
};

describe('admitCardSlice', () => {
    it('should return initial state', () => {
        const state = admitCardReducer(undefined, { type: 'unknown' });
        expect(state).toEqual(initialState);
    });

    it('should handle clearCurrentCard', () => {
        const stateWithCard = { ...initialState, currentCard: mockCard };
        const state = admitCardReducer(stateWithCard, clearCurrentCard());
        expect(state.currentCard).toBeNull();
    });

    it('should handle clearSearchResults', () => {
        const stateWithResults = { ...initialState, searchResults: [mockCard] };
        const state = admitCardReducer(stateWithResults, clearSearchResults());
        expect(state.searchResults).toEqual([]);
    });

    it('should handle resetAdmitCardStatus', () => {
        const stateWithError = { ...initialState, error: 'Error occurred' };
        const state = admitCardReducer(stateWithError, resetAdmitCardStatus());
        expect(state.error).toBeNull();
    });

    it('should handle fetchAdmitCardsByPage.pending', () => {
        const action = { type: 'admitCards/fetchByPage/pending' };
        const state = admitCardReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle fetchAdmitCardsByPage.fulfilled', () => {
        const action = { type: 'admitCards/fetchByPage/fulfilled', payload: [mockCard, mockCard2] };
        const state = admitCardReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.cards).toHaveLength(2);
        expect(state.cards[0].studentName).toBe('John Doe');
    });

    it('should handle searchAdmitCards.fulfilled', () => {
        const action = { type: 'admitCards/search/fulfilled', payload: [mockCard] };
        const state = admitCardReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.searchResults).toHaveLength(1);
        expect(state.searchResults[0].rollNumber).toBe('2024001');
    });

    it('should handle createAdmitCard.fulfilled - prepend to cards', () => {
        const existingState = { ...initialState, cards: [mockCard2] };
        const newCard = { ...mockCard, _id: 'card3' };
        const action = { type: 'admitCards/create/fulfilled', payload: newCard };
        const state = admitCardReducer(existingState, action);
        expect(state.cards).toHaveLength(2);
        expect(state.cards[0]._id).toBe('card3');
    });

    it('should handle updateAdmitCard.fulfilled - update in list', () => {
        const existingState = { ...initialState, cards: [mockCard, mockCard2] };
        const updatedCard = { ...mockCard, studentName: 'John Updated' };
        const action = { type: 'admitCards/update/fulfilled', payload: updatedCard };
        const state = admitCardReducer(existingState, action);
        expect(state.cards[0].studentName).toBe('John Updated');
    });

    it('should handle updateAdmitCard.fulfilled - update currentCard', () => {
        const existingState = { ...initialState, cards: [mockCard], currentCard: mockCard };
        const updatedCard = { ...mockCard, rollNumber: '9999999' };
        const action = { type: 'admitCards/update/fulfilled', payload: updatedCard };
        const state = admitCardReducer(existingState, action);
        expect(state.currentCard.rollNumber).toBe('9999999');
    });

    it('should handle deleteAdmitCard.fulfilled - remove from list', () => {
        const existingState = { ...initialState, cards: [mockCard, mockCard2] };
        const action = { type: 'admitCards/delete/fulfilled', payload: 'card1' };
        const state = admitCardReducer(existingState, action);
        expect(state.cards).toHaveLength(1);
        expect(state.cards[0]._id).toBe('card2');
    });

    it('should handle deleteAdmitCard.fulfilled - clear currentCard', () => {
        const existingState = { ...initialState, cards: [mockCard], currentCard: mockCard };
        const action = { type: 'admitCards/delete/fulfilled', payload: 'card1' };
        const state = admitCardReducer(existingState, action);
        expect(state.currentCard).toBeNull();
    });

    it('should handle bulkCreateAdmitCards.fulfilled - prepend all cards', () => {
        const existingState = { ...initialState, cards: [mockCard] };
        const bulkCards = [
            { _id: 'card3', studentName: 'Alice', rollNumber: '2024003' },
            { _id: 'card4', studentName: 'Bob', rollNumber: '2024004' }
        ];
        const action = { type: 'admitCards/bulkCreate/fulfilled', payload: { cards: bulkCards } };
        const state = admitCardReducer(existingState, action);
        expect(state.cards).toHaveLength(3);
        expect(state.cards[0]._id).toBe('card3');
        expect(state.cards[1]._id).toBe('card4');
    });
});
