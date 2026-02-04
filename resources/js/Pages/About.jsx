import React from 'react';
import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';

const About = ({ page }) => {
    return (
        <MainLayout page={page}>
            <div className="max-w-2xl mx-auto">
                <PlasticCard>
                    <h1 className="text-4xl font-black text-plastic-pink mb-6">About Me</h1>
                    <div className="prose prose-lg prose-slate font-medium">
                        <p>
                            Hi! I'm a developer who loves building things that are fun to use.
                            I believe software should bring as much joy as opening a new toy.
                        </p>
                        <p>
                            My mission is to de-serious-ize the web, one glossy button at a time.
                        </p>
                    </div>
                </PlasticCard>
            </div>
        </MainLayout>
    );
};

export default About;
