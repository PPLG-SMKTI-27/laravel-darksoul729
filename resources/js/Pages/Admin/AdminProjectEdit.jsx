import React, { useState } from 'react';
import ToyIcon from '../../UI/ToyIcon';
import Toast from '../../UI/Toast';

const AdminProjectEdit = ({ project }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        link: project?.link || '',
        status: project?.status || 'draft'
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(project?.image_url ? `/storage/${project.image_url}` : null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const formDataToSend = new FormData();
            formDataToSend.append('_method', 'PUT');
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            // Only send link if not empty (nullable|url validation)
            if (formData.link && formData.link.trim()) {
                formDataToSend.append('link', formData.link);
            }
            formDataToSend.append('status', formData.status);
            if (image) {
                formDataToSend.append('image', image);
            }

            // Debug: Log FormData contents
            console.log('=== SENDING FormData ===');
            for (let [key, value] of formDataToSend.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    });
                } else {
                    console.log(`${key}:`, value);
                }
            }
            console.log('=======================');

            const response = await fetch(`/admin/projects/${project.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formDataToSend
            });

            if (response.ok) {
                setToast({ type: 'success', message: 'Project updated successfully! ✨' });
                setTimeout(() => {
                    window.location.href = '/admin/projects';
                }, 1500);
            } else {
                const data = await response.json();
                console.error('Validation errors:', data);
                console.error('Error details:', data.errors);
                console.error('Response status:', response.status);
                setErrors(data.errors || {});
                setToast({ type: 'error', message: data.message || 'Validation failed. Check form errors.' });
            }
        } catch (error) {
            console.error('Submit error:', error);
            setErrors({ general: 'Failed to update project. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

                    <div className="relative bg-white rounded-3xl p-8 border-b-8 border-r-8 border-blue-300 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"></div>

                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h1 className="text-5xl font-black text-blue-600 mb-3"
                                    style={{
                                        textShadow: `
                                            0 1px 0 #2563eb,
                                            0 2px 0 #1d4ed8,
                                            0 3px 0 #1e40af,
                                            0 4px 5px rgba(0,0,0,0.2)
                                        `
                                    }}>
                                    EDIT PROJECT
                                </h1>
                                <div className="flex items-center gap-3">
                                    <ToyIcon type="edit" size="md" />
                                    <p className="text-gray-700 font-black text-lg"
                                        style={{
                                            textShadow: `0 1px 0 #9ca3af, 0 2px 3px rgba(0,0,0,0.1)`
                                        }}>
                                        Update your project details
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.href = '/admin/projects'}
                                className="group/btn bg-gradient-to-br from-indigo-400 to-indigo-600 text-white font-black px-8 py-4 rounded-2xl border-b-6 border-indigo-800 shadow-xl hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                                <div className="relative flex items-center gap-3">
                                    <ToyIcon type="back" size="md" />
                                    <span className="text-lg">BACK</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-purple-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

                        <div className="relative bg-white rounded-3xl p-8 border-b-8 border-r-8 border-purple-200 shadow-xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none"></div>

                            <div className="relative z-10 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-black text-lg mb-3"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        <ToyIcon type="edit" size="sm" />
                                        Project Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter project title..."
                                        className="w-full px-6 py-4 text-lg font-bold bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all shadow-inner"
                                    />
                                    {errors.title && (
                                        <p className="mt-2 text-sm text-red-500 font-bold flex items-center gap-2">
                                            <ToyIcon type="warning" size="sm" />
                                            {errors.title[0]}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-black text-lg mb-3"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        <ToyIcon type="message" size="sm" />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Describe your project..."
                                        className="w-full px-6 py-4 text-lg font-medium bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all shadow-inner resize-none"
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-500 font-bold flex items-center gap-2">
                                            <ToyIcon type="warning" size="sm" />
                                            {errors.description[0]}
                                        </p>
                                    )}
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-black text-lg mb-3"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        <ToyIcon type="back" size="sm" />
                                        Project Link
                                    </label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                        className="w-full px-6 py-4 text-lg font-mono bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all shadow-inner"
                                    />
                                    {errors.link && (
                                        <p className="mt-2 text-sm text-red-500 font-bold flex items-center gap-2">
                                            <ToyIcon type="warning" size="sm" />
                                            {errors.link[0]}
                                        </p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-black text-lg mb-3"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        <ToyIcon type="image" size="sm" />
                                        Project Image
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer group/upload relative block w-full p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-dashed border-blue-300 rounded-2xl hover:border-blue-500 transition-all overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-blue-200 opacity-0 group-hover/upload:opacity-10 transition-opacity"></div>
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full max-h-64 object-contain rounded-xl shadow-lg"
                                                    />
                                                    <p className="mt-4 text-center text-sm text-blue-600 font-bold">Click to change image</p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <ToyIcon type="image" size="2xl" className="mx-auto mb-4" />
                                                    <p className="text-lg font-black text-blue-600 mb-2">Click to upload image</p>
                                                    <p className="text-sm text-blue-400 font-medium">PNG, JPG up to 2MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {errors.image && (
                                        <p className="mt-2 text-sm text-red-500 font-bold flex items-center gap-2">
                                            <ToyIcon type="warning" size="sm" />
                                            {errors.image[0]}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-black text-lg mb-3"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        <ToyIcon type="check" size="sm" />
                                        Status
                                    </label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 cursor-pointer group/radio relative p-6 rounded-2xl border-4 transition-all shadow-lg ${formData.status === 'draft'
                                            ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 shadow-orange-200'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="draft"
                                                checked={formData.status === 'draft'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-3">
                                                <ToyIcon type="edit" size="md" />
                                                <span className="font-black text-lg">DRAFT</span>
                                            </div>
                                        </label>

                                        <label className={`flex-1 cursor-pointer group/radio relative p-6 rounded-2xl border-4 transition-all shadow-lg ${formData.status === 'published'
                                            ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400 shadow-green-200'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="published"
                                                checked={formData.status === 'published'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-3">
                                                <ToyIcon type="check" size="md" />
                                                <span className="font-black text-lg">PUBLISHED</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {errors.general && (
                                    <div className="p-4 bg-red-50 border-4 border-red-200 rounded-2xl">
                                        <p className="text-red-600 font-bold flex items-center gap-2">
                                            <ToyIcon type="warning" size="md" />
                                            {errors.general}
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full group/submit relative bg-gradient-to-br from-blue-400 to-blue-600 text-white font-black py-6 px-8 rounded-2xl border-b-8 border-blue-800 shadow-2xl hover:shadow-3xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/submit:opacity-20 transition-opacity"></div>
                                    <div className="relative flex items-center justify-center gap-4">
                                        {submitting ? (
                                            <>
                                                <ToyIcon type="loading" size="lg" />
                                                <span className="text-2xl" style={{
                                                    textShadow: `0 1px 0 rgba(0,0,0,0.3), 0 2px 3px rgba(0,0,0,0.3)`
                                                }}>UPDATING...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ToyIcon type="check" size="lg" />
                                                <span className="text-2xl" style={{
                                                    textShadow: `0 1px 0 rgba(0,0,0,0.3), 0 2px 3px rgba(0,0,0,0.3)`
                                                }}>UPDATE PROJECT</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    isVisible={true}
                    message={toast.message}
                    type={toast.type || 'success'}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminProjectEdit;
