import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import ToyIcon from '../../UI/ToyIcon';
import IntroDashboard from '../../components/IntroDashboard';

const Dashboard = ({ stats, recentProjects }) => {
    const containerRef = useRef(null);
    const [introComplete, setIntroComplete] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Initial state: Hide content
            if (!introComplete) {
                gsap.set('.dashboard-content', { opacity: 0, y: 50 });
            } else {
                // Animate Content IN
                gsap.to('.dashboard-content', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.2)"
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [introComplete]);

    const handleLogout = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                }
            });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Enhanced Stat Card with better 3D
    const StatCard = ({ label, value, color, bgColor, icon, gradientFrom, gradientTo }) => (
        <div className="group relative dashboard-content">
            {/* 3D Shadow Layer */}
            <div className={`absolute inset-0 ${bgColor} rounded-3xl opacity-40 transform translate-y-2 translate-x-2 blur-sm`}></div>

            {/* Main Card */}
            <div className={`relative bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-3xl p-6 border-b-6 border-r-6 ${bgColor} shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-3 hover:shadow-3xl cursor-pointer overflow-hidden`}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black rounded-full blur-2xl opacity-10 transform -translate-x-12 translate-y-12"></div>
                </div>

                {/* Glossy shine effect */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl"></div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-white text-xs font-black uppercase tracking-widest mb-2"
                            style={{
                                textShadow: `
                                   0 1px 2px rgba(0,0,0,0.3),
                                   0 2px 4px rgba(0,0,0,0.2)
                               `
                            }}>
                            {label}
                        </p>
                        <p className="text-white text-6xl font-black transform transition-all duration-300 group-hover:scale-110"
                            style={{
                                textShadow: `
                                   0 1px 0 rgba(0,0,0,0.3),
                                   0 2px 0 rgba(0,0,0,0.25),
                                   0 3px 0 rgba(0,0,0,0.2),
                                   0 4px 0 rgba(0,0,0,0.15),
                                   0 5px 0 rgba(0,0,0,0.1),
                                   0 6px 1px rgba(0,0,0,0.1),
                                   0 0 5px rgba(0,0,0,0.1),
                                   0 2px 5px rgba(0,0,0,0.3),
                                   0 5px 10px rgba(0,0,0,0.25),
                                   0 10px 20px rgba(0,0,0,0.2)
                               `
                            }}>
                            {value}
                        </p>
                    </div>

                    {/* Icon with pulse animation on hover */}
                    <div className="transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                        <ToyIcon type={icon} size="xl" />
                    </div>
                </div>

                {/* Bottom highlight */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 rounded-b-3xl"></div>
            </div>
        </div>
    );

    // Enhanced Action Button
    const ActionButton = ({ icon, label, onClick, gradientFrom, gradientTo, borderColor }) => (
        <button
            onClick={onClick}
            className={`relative group bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-6 md:p-8 border-b-8 border-r-8 ${borderColor} shadow-2xl hover:shadow-3xl active:border-b-2 active:border-r-2 active:translate-y-2 active:translate-x-2 transition-all duration-200 overflow-hidden w-full dashboard-content`}
        >
            {/* Animated background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
            </div>

            {/* Shine effect */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2">
                    <ToyIcon type={icon} size="2xl" />
                </div>
                <span className="text-white font-black text-lg md:text-xl text-center uppercase tracking-wider"
                    style={{
                        textShadow: `
                              0 1px 0 rgba(0,0,0,0.3),
                              0 2px 0 rgba(0,0,0,0.2),
                              0 3px 0 rgba(0,0,0,0.15),
                              0 4px 5px rgba(0,0,0,0.3),
                              0 6px 10px rgba(0,0,0,0.2)
                          `
                    }}>
                    {label}
                </span>
            </div>

            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-black/20 rounded-b-2xl"></div>
        </button>
    );

    // Enhanced Project Card
    const ProjectCard = ({ project }) => {
        const handleCardClick = () => {
            // Navigate to project detail or edit page
            window.location.href = `/admin/projects/${project.id}/edit`;
        };

        return (
            <div className="group relative dashboard-content" onClick={handleCardClick}>
                {/* Shadow */}
                <div className="absolute inset-0 bg-purple-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-6 border-b-8 border-r-8 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 cursor-pointer overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent rounded-full blur-2xl opacity-50 transform translate-x-20 -translate-y-20 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Image Preview */}
                        {project.image_url && (
                            <div className="mb-4 relative rounded-2xl overflow-hidden border-4 border-purple-100 shadow-lg group-hover:border-purple-300 transition-colors">
                                <img
                                    src={`/storage/${project.image_url}`}
                                    alt={project.title}
                                    className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Shine effect on image */}
                                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/20 to-transparent"></div>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="mb-4">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg border-b-4 transform transition-all duration-300 hover:scale-105 ${project.status === 'published'
                                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-700'
                                : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-700'
                                }`}>
                                <ToyIcon type={project.status === 'published' ? 'check' : 'edit'} size="sm" />
                                {project.status}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors"
                            style={{
                                textShadow: `
                                    0 1px 0 #d1d5db,
                                    0 2px 3px rgba(0,0,0,0.1)
                                `
                            }}>
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {project.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                            <p className="text-xs text-gray-400 font-mono">
                                {new Date(project.created_at).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 text-purple-500 text-sm font-bold group-hover:translate-x-2 transition-transform">
                                View <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8 relative overflow-hidden">

            {/* INTRO OVERLAY */}
            {!introComplete && <IntroDashboard onComplete={() => setIntroComplete(true)} />}

            <div className="max-w-7xl mx-auto space-y-8">
                {/* ===== HEADER ===== */}
                <div className="relative group dashboard-content">
                    {/* Shadow */}
                    <div className="absolute inset-0 bg-purple-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

                    {/* Header Card */}
                    <div className="relative bg-white rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-purple-300 shadow-2xl overflow-hidden">
                        {/* Animated background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                            <div>
                                {/* 3D Solid Text with Depth */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-purple-600 mb-3"
                                    style={{
                                        textShadow: `
                                            0 1px 0 #7c3aed,
                                            0 2px 0 #6d28d9,
                                            0 3px 0 #5b21b6,
                                            0 4px 0 #4c1d95,
                                            0 5px 0 #3b0764,
                                            0 6px 1px rgba(0,0,0,.1),
                                            0 0 5px rgba(0,0,0,.1),
                                            0 1px 3px rgba(0,0,0,.3),
                                            0 3px 5px rgba(0,0,0,.2),
                                            0 5px 10px rgba(0,0,0,.25),
                                            0 10px 20px rgba(0,0,0,.15)
                                        `
                                    }}>
                                    ADMIN BOARD
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <ToyIcon type="dashboard" size="md" />
                                    <p className="text-gray-700 font-black text-lg md:text-xl"
                                        style={{
                                            textShadow: `
                                               0 1px 0 #9ca3af,
                                               0 2px 0 #6b7280,
                                               0 3px 5px rgba(0,0,0,0.1)
                                           `
                                        }}>
                                        Welcome back, Admin!
                                    </p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full md:w-auto group bg-gradient-to-br from-red-400 to-red-600 text-white font-black px-6 py-4 rounded-2xl border-b-6 border-r-6 border-red-800 shadow-xl hover:shadow-2xl active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="relative flex items-center justify-center gap-3">
                                    <ToyIcon type="back" size="sm" />
                                    <span className="text-lg">LOGOUT</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ===== STATISTICS ===== */}
                <div className="dashboard-content">
                    <div className="flex items-center gap-3 mb-6">
                        <ToyIcon type="dashboard" size="lg" />
                        <h2 className="text-2xl md:text-3xl font-black text-blue-600 uppercase tracking-wide"
                            style={{
                                textShadow: `
                                    0 1px 0 #2563eb,
                                    0 2px 0 #1d4ed8,
                                    0 3px 0 #1e40af,
                                    0 4px 5px rgba(0,0,0,0.2)
                                `
                            }}>
                            Statistics Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            label="Total Projects"
                            value={stats?.total || 0}
                            gradientFrom="from-blue-400"
                            gradientTo="to-blue-600"
                            bgColor="bg-blue-800"
                            icon="folder"
                        />
                        <StatCard
                            label="Published"
                            value={stats?.published || 0}
                            gradientFrom="from-green-400"
                            gradientTo="to-green-600"
                            bgColor="bg-green-800"
                            icon="check"
                        />
                        <StatCard
                            label="Drafts"
                            value={stats?.draft || 0}
                            gradientFrom="from-orange-400"
                            gradientTo="to-orange-600"
                            bgColor="bg-orange-800"
                            icon="edit"
                        />
                        <StatCard
                            label="New Messages"
                            value={stats?.messages || 0}
                            gradientFrom="from-pink-400"
                            gradientTo="to-pink-600"
                            bgColor="bg-pink-800"
                            icon="message"
                        />
                    </div>
                </div>

                {/* ===== QUICK ACTIONS ===== */}
                <div className="dashboard-content">
                    <div className="flex items-center gap-3 mb-6">
                        <ToyIcon type="settings" size="lg" />
                        <h2 className="text-3xl font-black text-green-600 uppercase tracking-wide"
                            style={{
                                textShadow: `
                                    0 1px 0 #16a34a,
                                    0 2px 0 #15803d,
                                    0 3px 0 #166534,
                                    0 4px 5px rgba(0,0,0,0.2)
                                `
                            }}>
                            Quick Actions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionButton
                            icon="plus"
                            label="New Project"
                            onClick={() => window.location.href = '/admin/projects/create'}
                            gradientFrom="from-green-400"
                            gradientTo="to-green-600"
                            borderColor="border-green-800"
                        />
                        <ActionButton
                            icon="folder"
                            label="Manage Projects"
                            onClick={() => window.location.href = '/admin/projects'}
                            gradientFrom="from-blue-400"
                            gradientTo="to-blue-600"
                            borderColor="border-blue-800"
                        />
                        <ActionButton
                            icon="message"
                            label="View Messages"
                            onClick={() => window.location.href = '/admin/messages'}
                            gradientFrom="from-pink-400"
                            gradientTo="to-pink-600"
                            borderColor="border-pink-800"
                        />
                    </div>
                </div>

                {/* ===== RECENT PROJECTS ===== */}
                <div className="dashboard-content">
                    <div className="flex items-center gap-3 mb-6">
                        <ToyIcon type="folder" size="lg" />
                        <h2 className="text-3xl font-black text-pink-600 uppercase tracking-wide"
                            style={{
                                textShadow: `
                                    0 1px 0 #db2777,
                                    0 2px 0 #be185d,
                                    0 3px 0 #9f1239,
                                    0 4px 5px rgba(0,0,0,0.2)
                                `
                            }}>
                            Recent Projects
                        </h2>
                    </div>

                    {recentProjects && recentProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="relative group">
                            {/* Shadow */}
                            <div className="absolute inset-0 bg-gray-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>

                            {/* Empty State */}
                            <div className="relative bg-white rounded-3xl p-16 border-b-8 border-r-8 border-gray-200 shadow-xl text-center overflow-hidden">
                                {/* Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>

                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <ToyIcon type="empty" size="2xl" className="mx-auto" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-700 mb-3"
                                        style={{
                                            textShadow: `
                                                0 1px 0 #9ca3af,
                                                0 2px 0 #6b7280,
                                                0 3px 5px rgba(0,0,0,0.15)
                                            `
                                        }}>No Projects Yet</h3>
                                    <p className="text-gray-600 mb-8 text-lg font-bold">Create your first project to get started!</p>
                                    <button
                                        onClick={() => window.location.href = '/admin/projects/create'}
                                        className="group inline-flex items-center gap-3 bg-gradient-to-br from-blue-400 to-blue-600 text-white font-black py-4 px-10 rounded-full border-b-6 border-blue-800 shadow-xl hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <ToyIcon type="plus" size="md" />
                                        <span className="relative text-xl"
                                            style={{
                                                textShadow: `
                                                      0 1px 0 rgba(0,0,0,0.3),
                                                      0 2px 3px rgba(0,0,0,0.3)
                                                  `
                                            }}>CREATE FIRST PROJECT</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
