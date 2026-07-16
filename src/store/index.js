import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';
import themeReducer from './slice/themeSlice';
import categoryReducer from './slice/categorySlice';
import articleReducer from './slice/articleSlice';
import importantServiceReducer from './slice/importantServiceSlice';
import contactReducer from './slice/contactSlice';

import marqueeReducer from './slice/marqueeSlice';
import pageSectionReducer from './slice/pageSectionSlice';
import searchReducer from './slice/searchSlice';
import aboutReducer from './slice/aboutSlice';
import dashboardReducer from './slice/dashboardSlice';
import paymentReducer from './slice/paymentSlice';
import applicationReducer from './slice/applicationSlice';
import paymentSlipReducer from './slice/paymentSlipSlice';
import slipSettingReducer from './slice/slipSettingSlice';
import galleryReducer from './slice/gallerySlice';
import admitCardPageReducer from './slice/admitCardPageSlice';
import admitCardReducer from './slice/admitCardSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        theme: themeReducer,
        categories: categoryReducer,
        articles: articleReducer,
        importantServices: importantServiceReducer,
        contact: contactReducer,
        marquee: marqueeReducer,
        pageSections: pageSectionReducer,
        search: searchReducer,
        about: aboutReducer,
        dashboard: dashboardReducer,
        payment: paymentReducer,
        applications: applicationReducer,
        paymentSlips: paymentSlipReducer,
        slipSetting: slipSettingReducer,
        gallery: galleryReducer,
        admitCardPages: admitCardPageReducer,
        admitCards: admitCardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                warnAfter: 1000,
            },
            immutableCheck: {
                warnAfter: 1000,
            },
        }),
});

export default store;
