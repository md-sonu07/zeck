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
    },
});

export default store;
