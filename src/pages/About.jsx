import React, { Suspense } from 'react';
import careerItems from '../data/career.json';

const AboutExperience = React.lazy(() => import('../components/AboutExperience'));

const AboutExperienceFallback = () => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #081221 0%, #020617 100%)',
        color: '#dbeafe',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'system-ui',
    }}>
        <div>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.32em', textTransform: 'uppercase', opacity: 0.7 }}>
                Loading Archive
            </div>
            <div style={{ marginTop: 16, fontSize: 28, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                Menyiapkan Ruang 3D...
            </div>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, opacity: 0.78 }}>
                Tur interaktif sedang dimuat.
            </div>
        </div>
    </div>
);

const About = () => {
    const debug = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('aboutDebug') === '1'
        : false;

    return (
        <Suspense fallback={<AboutExperienceFallback />}>
            <AboutExperience careerItems={careerItems} debug={debug} />
        </Suspense>
    );
};

export default About;
