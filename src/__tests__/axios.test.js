import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api/axios.js';
import axios from 'axios';

vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal();
    const mockApi = {
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        post: vi.fn(),
    };
    return {
        default: {
            ...actual.default,
            create: vi.fn(() => mockApi),
            post: vi.fn(),
        },
    };
});

describe('axios interceptors', () => {
    let responseInterceptor;
    let mockApi;

    beforeEach(() => {
        vi.clearAllMocks();
        // Redefine to capture interceptor
        mockApi = axios.create();
        
        // Mock window.location
        if (typeof globalThis.window === 'undefined') {
            globalThis.window = {};
        }
        globalThis.window.location = { href: '' };
        
        // Setup spy on localStorage
        if (typeof globalThis.localStorage === 'undefined') {
            globalThis.localStorage = {
                removeItem: vi.fn(),
                getItem: vi.fn(),
                setItem: vi.fn()
            };
        }
        vi.spyOn(globalThis.localStorage, 'removeItem');
    });

    it('should be defined', () => {
        expect(api).toBeDefined();
    });
});
