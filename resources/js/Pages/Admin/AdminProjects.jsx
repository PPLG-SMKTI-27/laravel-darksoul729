import React, { useState } from 'react';
import ToyIcon from '../../UI/ToyIcon';
import ConfirmModal from '../../UI/ConfirmModal';
import SuccessToast from '../../UI/SuccessToast';

const AdminProjects = ({ projects: initialProjects }) => {
    const [projects, setProjects] = useState(initialProjects || []);
    const [showModal, setShowModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const formData = new FormData();
            formData.append('_method', 'DELETE');

            const response = await fetch(`/admin/projects/${projectToDelete.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== projectToDelete.id));
                setShowModal(false);
                setProjectToDelete(null);
                setToastMessage('Project deleted successfully!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                alert('Failed to delete project');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting project');
        }
    };

    const ProjectCard = ({ project }) => (
        <div className="group relative">
            {/* Shadow */}
            <div className="absolute inset-0 bg-purple-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

            {/* Card */}
            <div className="relative bg-white rounded-3xl p-6 border-b-8 border-r-8 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent rounded-full blur-2xl opacity-50 transform translate-x-20 -translate-y-20 pointer-events-none"></div>

                <div className="relative z-10">
                    {/* Image */}
                    {project.image_url && (
                        <div className="mb-4 relative rounded-2xl overflow-hidden border-4 border-purple-100 shadow-lg group-hover:border-purple-300 transition-colors">
                            <img
                                src={`/storage/${project.image_url}`}
                                alt={project.title}
                                className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg border-b-4 ${project.status === 'published'
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-700'
                            : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-700'
                            }`}>
                            <ToyIcon type={project.status === 'published' ? 'check' : 'edit'} size="sm" />
                            {project.status}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-gray-800 mb-3 line-clamp-2"
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

                    {/* Link */}
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 font-bold underline mb-4 block truncate"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {project.link}
                        </a>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 pt-4 border-t-2 border-gray-100">
                        <button
                            onClick={() => window.location.href = `/admin/projects/${project.id}/edit`}
                            className="flex-1 group/btn relative bg-gradient-to-br from-blue-400 to-blue-600 text-white font-black py-3 px-4 rounded-xl border-b-4 border-blue-800 shadow-lg hover:shadow-xl active:border-b-0 active:translate-y-1 transition-all duration-200 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <ToyIcon type="edit" size="sm" />
                                <span className="text-sm">EDIT</span>
                            </div>
                        </button>

                        <button
                            onClick={() => handleDeleteClick(project)}
                            className="flex-1 group/btn relative bg-gradient-to-br from-red-400 to-red-600 text-white font-black py-3 px-4 rounded-xl border-b-4 border-red-800 shadow-lg hover:shadow-xl active:border-b-0 active:translate-y-1 transition-all duration-200 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <ToyIcon type="trash" size="sm" />
                                <span className="text-sm">DELETE</span>
                            </div>
                        </button>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-400 font-mono mt-3 text-center">
                        Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-purple-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

                    <div className="relative bg-white rounded-3xl p-8 border-b-8 border-r-8 border-purple-300 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-purple-600 mb-3"
                                    style={{
                                        textShadow: `
                                            0 1px 0 #7c3aed,
                                            0 2px 0 #6d28d9,
                                            0 3px 0 #5b21b6,
                                            0 4px 5px rgba(0,0,0,0.2)
                                        `
                                    }}>
                                    MANAGE PROJECTS
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <ToyIcon type="folder" size="md" />
                                    <p className="text-gray-700 font-black text-lg"
                                        style={{
                                            textShadow: `0 1px 0 #9ca3af, 0 2px 3px rgba(0,0,0,0.1)`
                                        }}>
                                        Total Projects: {projects.length}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => window.location.href = '/admin/projects/create'}
                                    className="group/btn bg-gradient-to-br from-green-400 to-green-600 text-white font-black px-8 py-4 rounded-2xl border-b-6 border-green-800 shadow-xl hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden w-full sm:w-auto"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        <ToyIcon type="plus" size="md" />
                                        <span className="text-lg">NEW PROJECT</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="group/btn bg-gradient-to-br from-indigo-400 to-indigo-600 text-white font-black px-8 py-4 rounded-2xl border-b-6 border-indigo-800 shadow-xl hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden w-full sm:w-auto"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                                    <div className="relative flex items-center justify-center gap-3">
                                        <ToyIcon type="back" size="md" />
                                        <span className="text-lg">BACK</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gray-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>

                        <div className="relative bg-white rounded-3xl p-16 border-b-8 border-r-8 border-gray-200 shadow-xl text-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <ToyIcon type="empty" size="2xl" className="mx-auto" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-700 mb-3"
                                    style={{
                                        textShadow: `0 1px 0 #9ca3af, 0 2px 3px rgba(0,0,0,0.1)`
                                    }}>
                                    No Projects Yet
                                </h3>
                                <p className="text-gray-600 mb-8 text-lg font-bold">Create your first project to get started!</p>
                                <button
                                    onClick={() => window.location.href = '/admin/projects/create'}
                                    className="group/btn inline-flex items-center gap-3 bg-gradient-to-br from-green-400 to-green-600 text-white font-black py-4 px-10 rounded-full border-b-6 border-green-800 shadow-xl hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                                    <ToyIcon type="plus" size="md" />
                                    <span className="relative text-xl"
                                        style={{
                                            textShadow: `0 1px 0 rgba(0,0,0,0.3), 0 2px 3px rgba(0,0,0,0.3)`
                                        }}>
                                        CREATE FIRST PROJECT
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals & Toasts */}
            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Project?"
                message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
            />

            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default AdminProjects;
