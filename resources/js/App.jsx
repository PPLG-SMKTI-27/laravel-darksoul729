import React from 'react';
import LandingPage from './Pages/LandingPage';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Feature from './Pages/Feature';
import Projects from './Pages/Projects';
import Login from './Pages/Login';
import Dashboard from './Pages/Admin/Dashboard';

// Admin Components
import AdminProjects from './Pages/Admin/AdminProjects';
import AdminProjectCreate from './Pages/Admin/AdminProjectCreate';
import AdminProjectEdit from './Pages/Admin/AdminProjectEdit';
import AdminMessages from './Pages/Admin/AdminMessages';

const App = ({ initialPage, initialProps }) => {
    // Simple Router based on the 'page' prop passed from Laravel
    const renderPage = () => {
        switch (initialPage) {
            case 'LandingPage':
                return <LandingPage page={initialPage} props={initialProps} />;
            case 'About':
                return <About page={initialPage} />;
            case 'Contact':
                return <Contact page={initialPage} />;
            case 'Feature':
                return <Feature page={initialPage} />;
            case 'Skills':
                // Mapping "Skills" to "Feature" page for now, as requested by the implicit design match
                return <Feature page={initialPage} />;
            case 'Projects':
                return <Projects page={initialPage} props={initialProps} />;
            case 'Login':
                return <Login page={initialPage} />;
            case 'Admin/Dashboard':
                return <Dashboard {...initialProps} />;
            case 'Dashboard': // Fallback or if used elsewhere
                return <Dashboard {...initialProps} />;
            case 'AdminProjects':
                return <AdminProjects {...initialProps} />;
            case 'AdminProjectCreate':
                return <AdminProjectCreate {...initialProps} />;
            case 'AdminProjectEdit':
                return <AdminProjectEdit {...initialProps} />;
            case 'AdminMessages':
                return <AdminMessages {...initialProps} />;
            default:
                return (
                    <div className="flex items-center justify-center min-h-screen bg-red-100">
                        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
                            <h1 className="text-4xl font-black text-plastic-red mb-4">404</h1>
                            <p className="font-bold text-slate-500">Page "{initialPage}" not found.</p>
                        </div>
                    </div>
                );
        }
    };

    return renderPage();
};

export default App;
