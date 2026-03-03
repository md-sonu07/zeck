import { Route, Routes, useParams } from 'react-router-dom';
import AdminLayout from '../components/adminSection/AdminLayout';
import DashboardPage from '../pages/admin/dashboard/DashboardPage';
import UsersManagementPage from '../pages/admin/users/UsersManagementPage';
import CategoriesManagementPage from '../pages/admin/categories/CategoriesManagementPage';
import PostManagementPage from '../pages/admin/post/PostManagementPage';
import AboutManagementPage from '../pages/admin/about/AboutManagementPage';
import ContactManagementPage from '../pages/admin/contact/ContactManagementPage';
import ContactMessagesPage from '../pages/admin/contact/ContactMessagesPage';
import PageArticleManagement from '../pages/admin/pageArticle/PageArticleManagement';
import ImportantServicesManagementPage from '../pages/admin/importantServices/ImportantServicesManagementPage';
import MarqueeManagementPage from '../pages/admin/marquee/MarqueeManagementPage';
import RecentActivityPage from '../pages/admin/activities/RecentActivityPage';
import PaymentManagementPage from '../pages/admin/payment/PaymentManagementPage';




const DynamicCustomRoute = () => {
    const { slug } = useParams();
    const title = decodeURIComponent(slug);
    return <PostManagementPage categoryTitle={title} />;
};

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="activities" element={<RecentActivityPage />} />
                <Route path="users" element={<UsersManagementPage />} />



                <Route path="categories" element={<CategoriesManagementPage />} />

                {/* Master Page Articles Navigation */}
                <Route path="page-articles" element={<PageArticleManagement />} />

                {/* Dynamically Generated Post Management Pages */}
                <Route path="university" element={<PostManagementPage categoryTitle="University" />} />
                <Route path="admission" element={<PostManagementPage categoryTitle="Admission" />} />
                <Route path="admit-cards" element={<PostManagementPage categoryTitle="Admit Card" />} />
                <Route path="results" element={<PostManagementPage categoryTitle="Result" />} />
                <Route path="syllabus" element={<PostManagementPage categoryTitle="Syllabus" />} />
                <Route path="answer-key" element={<PostManagementPage categoryTitle="Answer Key" />} />
                <Route path="latest-news" element={<PostManagementPage categoryTitle="Latest News" />} />
                <Route path="custom/:slug" element={<DynamicCustomRoute />} />

                {/* Specific Management Pages */}
                <Route path="about-us" element={<AboutManagementPage />} />
                <Route path="contact-messages" element={<ContactMessagesPage />} />
                <Route path="contact-us" element={<ContactManagementPage />} />
                <Route path="important-services" element={<ImportantServicesManagementPage />} />
                <Route path="marquee" element={<MarqueeManagementPage />} />
                <Route path="payments" element={<PaymentManagementPage />} />

                <Route path="settings" element={<DashboardPage />} />

            </Route>
        </Routes>
    );
};

export default AdminRoutes;
