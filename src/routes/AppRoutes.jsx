
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/user/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProfilePage from '../pages/user/profile/ProfilePage';
import ContactPage from '../pages/user/contact/ContactPage';
import LatestNewsPage from '../pages/user/latestNews/LatestNewsPage';
import AdmitCardPage from '../pages/user/admitCard/AdmitCardPage';
import ResultPage from '../pages/user/result/ResultPage';
import AnswerKeyPage from '../pages/user/answerKey/AnswerKeyPage';
import AdmissionPage from '../pages/user/admission/AdmissionPage';
import UniversityPage from '../pages/user/university/UniversityPage';
import AboutPage from '../pages/user/about/AboutPage';
import ServicesPage from '../pages/user/services/ServicesPage';
import ArticleDetailPage from '../pages/user/article/ArticleDetailPage';
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoute from './AdminRoute';
import AdminRoutes from './AdminRoutes';

import SavedPostsPage from '../pages/user/savedPosts/SavedPostsPage';
import SearchResultsPage from '../pages/user/search/SearchResultsPage';
import ApplicationPage from '../pages/user/apply/ApplicationPage';


import GalleryPage from '../pages/user/gallery/GalleryPage';
import DynamicCategoryPage from '../pages/user/dynamic/DynamicCategoryPage';
import AdmitCardPagesList from '../pages/user/admitCardPages/AdmitCardPagesList';
import AdmitCardSearchPage from '../pages/user/admitCardSearch/AdmitCardSearchPage';
import CourseDetailsPage from '../pages/user/courses/CourseDetailsPage';
import ApplyNowPage from '../pages/user/apply/ApplyNowPage';
import MyApplicationsPage from '../pages/user/myApplications/MyApplicationsPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/latest-news" element={<LatestNewsPage />} />
            <Route path="/admit-cards" element={<AdmitCardPage />} />
            <Route path="/admit-cards/:slug" element={<AdmitCardSearchPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/answer-key" element={<AnswerKeyPage />} />
            <Route path="/admission" element={<AdmissionPage />} />
            <Route path="/university-cources" element={<UniversityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/service" element={<ServicesPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/apply/:slug" element={<ApplicationPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/course-admit-cards" element={<AdmitCardPagesList />} />
            <Route path="/course-admit-cards/:slug" element={<AdmitCardSearchPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/course-apply/:id" element={<ApplyNowPage />} />

            {/* Admin Panel Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>


            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/saved-posts" element={<SavedPostsPage />} />
                <Route path="/my-applications" element={<MyApplicationsPage />} />
            </Route>

            {/* Dynamic Article Detail Page Route */}
            <Route path="/:category/:slug" element={<ArticleDetailPage />} />

            {/* Dynamic Category Page Route (handles sections like /bca-batch) */}
            <Route path="/:categorySlug" element={<DynamicCategoryPage />} />

            {/* Catch all 404 */}
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
};

export default AppRoutes;
