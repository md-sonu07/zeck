import { describe, it, expect } from 'vitest';
import admitCardPageReducer, { clearCurrentPage, resetAdmitCardPageStatus } from '../store/slice/admitCardPageSlice';

const initialState = {
    pages: [],
    currentPage: null,
    loading: false,
    error: null
};

const mockPage = {
    _id: 'page1',
    title: 'Test Page',
    slug: 'test-page',
    description: 'A test admit card page',
    imageUrl: 'https://example.com/image.jpg',
    isActive: true,
    createdBy: 'user1',
    cardCount: 0
};

const mockPage2 = {
    _id: 'page2',
    title: 'College Admit Cards',
    slug: 'college-admit-cards',
    description: 'College admit cards',
    isActive: true,
    createdBy: 'user1'
};

describe('admitCardPageSlice', () => {
    it('should return initial state', () => {
        const state = admitCardPageReducer(undefined, { type: 'unknown' });
        expect(state).toEqual(initialState);
    });

    it('should handle clearCurrentPage', () => {
        const stateWithPage = { ...initialState, currentPage: mockPage };
        const state = admitCardPageReducer(stateWithPage, clearCurrentPage());
        expect(state.currentPage).toBeNull();
    });

    it('should handle resetAdmitCardPageStatus', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const state = admitCardPageReducer(stateWithError, resetAdmitCardPageStatus());
        expect(state.error).toBeNull();
    });

    it('should handle fetchAdmitCardPages.pending', () => {
        const action = { type: 'admitCardPages/fetchAll/pending' };
        const state = admitCardPageReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle fetchAdmitCardPages.fulfilled', () => {
        const action = { type: 'admitCardPages/fetchAll/fulfilled', payload: [mockPage, mockPage2] };
        const state = admitCardPageReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.pages).toHaveLength(2);
        expect(state.pages[0].title).toBe('Test Page');
    });

    it('should handle fetchAdmitCardPages.rejected', () => {
        const action = { type: 'admitCardPages/fetchAll/rejected', payload: 'Failed to fetch' };
        const state = admitCardPageReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to fetch');
    });

    it('should handle fetchAdmitCardPageById.fulfilled', () => {
        const action = { type: 'admitCardPages/fetchById/fulfilled', payload: mockPage };
        const state = admitCardPageReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.currentPage).toEqual(mockPage);
    });

    it('should handle fetchAdmitCardPageBySlug.pending', () => {
        const action = { type: 'admitCardPages/fetchBySlug/pending' };
        const state = admitCardPageReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle fetchAdmitCardPageBySlug.fulfilled', () => {
        const action = { type: 'admitCardPages/fetchBySlug/fulfilled', payload: mockPage };
        const state = admitCardPageReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.currentPage).toEqual(mockPage);
    });

    it('should handle fetchAdmitCardPageBySlug.rejected', () => {
        const action = { type: 'admitCardPages/fetchBySlug/rejected', payload: 'Page not found' };
        const state = admitCardPageReducer({ ...initialState, loading: true }, action);
        expect(state.loading).toBe(false);
        expect(state.currentPage).toBeNull();
        expect(state.error).toBe('Page not found');
    });

    it('should handle createAdmitCardPage.fulfilled - prepend page', () => {
        const existingState = { ...initialState, pages: [mockPage2] };
        const newPage = { ...mockPage, _id: 'page3' };
        const action = { type: 'admitCardPages/create/fulfilled', payload: newPage };
        const state = admitCardPageReducer(existingState, action);
        expect(state.pages).toHaveLength(2);
        expect(state.pages[0]._id).toBe('page3');
    });

    it('should handle updateAdmitCardPage.fulfilled - update in list', () => {
        const existingState = { ...initialState, pages: [mockPage, mockPage2] };
        const updatedPage = { ...mockPage, title: 'Updated Title' };
        const action = { type: 'admitCardPages/update/fulfilled', payload: updatedPage };
        const state = admitCardPageReducer(existingState, action);
        expect(state.pages[0].title).toBe('Updated Title');
    });

    it('should handle updateAdmitCardPage.fulfilled - update currentPage', () => {
        const existingState = { ...initialState, pages: [mockPage], currentPage: mockPage };
        const updatedPage = { ...mockPage, title: 'Updated Current' };
        const action = { type: 'admitCardPages/update/fulfilled', payload: updatedPage };
        const state = admitCardPageReducer(existingState, action);
        expect(state.currentPage.title).toBe('Updated Current');
    });

    it('should handle deleteAdmitCardPage.fulfilled - remove from list', () => {
        const existingState = { ...initialState, pages: [mockPage, mockPage2] };
        const action = { type: 'admitCardPages/delete/fulfilled', payload: 'page1' };
        const state = admitCardPageReducer(existingState, action);
        expect(state.pages).toHaveLength(1);
        expect(state.pages[0]._id).toBe('page2');
    });

    it('should handle deleteAdmitCardPage.fulfilled - clear currentPage if deleted', () => {
        const existingState = { ...initialState, pages: [mockPage], currentPage: mockPage };
        const action = { type: 'admitCardPages/delete/fulfilled', payload: 'page1' };
        const state = admitCardPageReducer(existingState, action);
        expect(state.currentPage).toBeNull();
    });
});
