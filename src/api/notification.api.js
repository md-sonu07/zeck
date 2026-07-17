import api from './axios.js';

export const getMyNotificationsApi = (unreadOnly = false) =>
    api.get(`/notifications/me${unreadOnly ? '?unreadOnly=true' : ''}`);

export const getAdminNotificationsApi = (unreadOnly = false) =>
    api.get(`/notifications/admin${unreadOnly ? '?unreadOnly=true' : ''}`);

export const getUnreadCountApi = (forAdmin = false) =>
    api.get(`/notifications/unread-count${forAdmin ? '?forAdmin=true' : ''}`);

export const markAsReadApi = (id) =>
    api.put(`/notifications/${id}/read`);

export const markAllAsReadApi = (forAdmin = false) =>
    api.put(`/notifications/mark-all-read${forAdmin ? '?forAdmin=true' : ''}`);
