import React from 'react';
import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';
import PlasticButton from '../UI/PlasticButton';

const Contact = ({ page }) => {
    return (
        <MainLayout page={page}>
            <div className="max-w-lg mx-auto">
                <PlasticCard>
                    <h1 className="text-4xl font-black text-plastic-green mb-8 text-center">Say Hello!</h1>

                    <form className="space-y-4" action="/contact" method="POST">
                        {/* CSRF Token would be handled here if doing traditional form, 
                            but for React we usually specific token or use fetch. 
                            For now, assuming standard form sub since it's hybrid. 
                        */}
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />

                        <div>
                            <label className="block text-slate-500 font-bold mb-2 uppercase text-xs tracking-wider">Your Name</label>
                            <input type="text" name="name" className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-plastic-blue focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700" placeholder="Captain Awesome" />
                        </div>

                        <div>
                            <label className="block text-slate-500 font-bold mb-2 uppercase text-xs tracking-wider">Your Email</label>
                            <input type="email" name="email" className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-plastic-blue focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700" placeholder="captain@toybox.com" />
                        </div>

                        <div>
                            <label className="block text-slate-500 font-bold mb-2 uppercase text-xs tracking-wider">Message</label>
                            <textarea name="message" rows="4" className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-plastic-blue focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700" placeholder="I love your toys!"></textarea>
                        </div>

                        <PlasticButton color="green" className="w-full text-lg">
                            Send Message
                        </PlasticButton>
                    </form>
                </PlasticCard>
            </div>
        </MainLayout>
    );
};

export default Contact;
