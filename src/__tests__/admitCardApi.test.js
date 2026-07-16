import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios';

vi.mock('../api/axios', () => {
    const mock = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    };
    return { default: mock };
});

const {
    getAdmitCardPagesApi,
    getAdmitCardPageByIdApi,
    getAdmitCardPageBySlugApi,
    createAdmitCardPageApi,
    updateAdmitCardPageApi,
    deleteAdmitCardPageApi
} = await import('../api/admitCardPage.api');

const {
    getAdmitCardsByPageApi,
    searchAdmitCardsApi,
    createAdmitCardApi,
    updateAdmitCardApi,
    deleteAdmitCardApi,
    bulkCreateAdmitCardsApi
} = await import('../api/admitCard.api');

describe('AdmitCardPage API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAdmitCardPagesApi should call GET /admit-card-pages', async () => {
        api.get.mockResolvedValue({ data: [{ _id: '1', title: 'Test' }] });
        const result = await getAdmitCardPagesApi({ includeInactive: 'true' });
        expect(api.get).toHaveBeenCalledWith('/admit-card-pages', { params: { includeInactive: 'true' } });
        expect(result).toEqual([{ _id: '1', title: 'Test' }]);
    });

    it('getAdmitCardPageByIdApi should call GET /admit-card-pages/:id', async () => {
        api.get.mockResolvedValue({ data: { _id: 'page1', title: 'Page 1' } });
        const result = await getAdmitCardPageByIdApi('page1');
        expect(api.get).toHaveBeenCalledWith('/admit-card-pages/page1');
        expect(result.title).toBe('Page 1');
    });

    it('getAdmitCardPageBySlugApi should call GET /admit-card-pages/slug/:slug', async () => {
        api.get.mockResolvedValue({ data: { _id: 'p1', slug: 'test-page' } });
        const result = await getAdmitCardPageBySlugApi('test-page');
        expect(api.get).toHaveBeenCalledWith('/admit-card-pages/slug/test-page');
        expect(result.slug).toBe('test-page');
    });

    it('createAdmitCardPageApi should POST with multipart/form-data', async () => {
        const formData = new FormData();
        formData.append('title', 'New Page');
        api.post.mockResolvedValue({ data: { _id: 'new1', title: 'New Page' } });
        const result = await createAdmitCardPageApi(formData);
        expect(api.post).toHaveBeenCalledWith('/admit-card-pages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        expect(result.title).toBe('New Page');
    });

    it('updateAdmitCardPageApi should PUT with multipart/form-data', async () => {
        const formData = new FormData();
        formData.append('title', 'Updated');
        api.put.mockResolvedValue({ data: { _id: 'p1', title: 'Updated' } });
        const result = await updateAdmitCardPageApi('p1', formData);
        expect(api.put).toHaveBeenCalledWith('/admit-card-pages/p1', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        expect(result.title).toBe('Updated');
    });

    it('deleteAdmitCardPageApi should call DELETE /admit-card-pages/:id', async () => {
        api.delete.mockResolvedValue({ data: { message: 'Deleted' } });
        const result = await deleteAdmitCardPageApi('p1');
        expect(api.delete).toHaveBeenCalledWith('/admit-card-pages/p1');
        expect(result.message).toBe('Deleted');
    });
});

describe('AdmitCard API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAdmitCardsByPageApi should call GET /admit-cards/page/:pageId', async () => {
        api.get.mockResolvedValue({ data: [{ _id: 'c1', studentName: 'John' }] });
        const result = await getAdmitCardsByPageApi('page1', { includeInactive: 'true' });
        expect(api.get).toHaveBeenCalledWith('/admit-cards/page/page1', { params: { includeInactive: 'true' } });
        expect(result).toEqual([{ _id: 'c1', studentName: 'John' }]);
    });

    it('searchAdmitCardsApi should call GET /admit-cards/search', async () => {
        api.get.mockResolvedValue({ data: [{ _id: 'c1', rollNumber: '123' }] });
        const result = await searchAdmitCardsApi({ pageId: 'page1', q: '123' });
        expect(api.get).toHaveBeenCalledWith('/admit-cards/search', { params: { pageId: 'page1', q: '123' } });
        expect(result[0].rollNumber).toBe('123');
    });

    it('createAdmitCardApi should POST with multipart/form-data', async () => {
        const formData = new FormData();
        formData.append('studentName', 'Test User');
        api.post.mockResolvedValue({ data: { _id: 'c1', studentName: 'Test User' } });
        const result = await createAdmitCardApi(formData);
        expect(api.post).toHaveBeenCalledWith('/admit-cards', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        expect(result.studentName).toBe('Test User');
    });

    it('updateAdmitCardApi should PUT with multipart/form-data', async () => {
        const formData = new FormData();
        formData.append('studentName', 'Updated');
        api.put.mockResolvedValue({ data: { _id: 'c1', studentName: 'Updated' } });
        const result = await updateAdmitCardApi('c1', formData);
        expect(api.put).toHaveBeenCalledWith('/admit-cards/c1', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        expect(result.studentName).toBe('Updated');
    });

    it('deleteAdmitCardApi should call DELETE /admit-cards/:id', async () => {
        api.delete.mockResolvedValue({ data: { message: 'Deleted' } });
        const result = await deleteAdmitCardApi('c1');
        expect(api.delete).toHaveBeenCalledWith('/admit-cards/c1');
        expect(result.message).toBe('Deleted');
    });

    it('bulkCreateAdmitCardsApi should POST /admit-cards/bulk', async () => {
        const data = { pageId: 'page1', cards: [{ collegeName: 'C1', studentName: 'S1', rollNumber: 'R1' }] };
        api.post.mockResolvedValue({ data: { message: 'Created', cards: [] } });
        const result = await bulkCreateAdmitCardsApi(data);
        expect(api.post).toHaveBeenCalledWith('/admit-cards/bulk', data);
        expect(result.message).toBe('Created');
    });
});
