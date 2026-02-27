import React from 'react';
import AboutExperience from '../components/AboutExperience';
import careerItems from '../data/career.json';

const About = () => {
    const debug = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('aboutDebug') === '1'
        : false;

    return <AboutExperience careerItems={careerItems} debug={debug} />;
};

export default About;
