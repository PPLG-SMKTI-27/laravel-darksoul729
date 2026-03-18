import React, { useState } from 'react';
import AdminProjectFormPage from './AdminProjectFormPage';

const AdminProjectEdit = ({ windowId, project }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        link: project?.link || '',
        status: project?.status || 'draft',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(project?.image_url ? `/storage/${project.image_url}` : null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        if (errors[name]) {
            setErrors((previous) => ({ ...previous, [name]: null }));
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});
        setNotice(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const payload = new FormData();
            payload.append('_method', 'PUT');
            payload.append('title', formData.title);
            payload.append('description', formData.description);
            if (formData.link.trim()) {
                payload.append('link', formData.link);
            }
            payload.append('status', formData.status);
            if (image) {
                payload.append('image', image);
            }

            const response = await fetch(`/admin/projects/${project.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: payload,
            });

            if (response.ok) {
                setNotice({ type: 'success', message: 'Project updated. Redirecting to project list...' });
                window.setTimeout(() => {
                    window.location.href = '/admin/projects';
                }, 900);
            } else {
                const data = await response.json();
                setErrors(data.errors || {});
                setNotice({ type: 'error', message: data.message || 'Validation failed. Review the input fields.' });
            }
        } catch (error) {
            console.error('Submit error:', error);
            setErrors({ general: 'Failed to update project. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminProjectFormPage
            windowId={windowId}
            mode="edit"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            submitting={submitting}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            notice={notice}
        />
    );
};

export default AdminProjectEdit;
