import React, { useState } from 'react';
import {
    AdminTerminalButton,
    AdminTerminalConfirm,
    AdminTerminalNotice,
    AdminTerminalPanel,
    AdminWindow,
    AdminTerminalTable,
    adminTerminalIcons,
} from '../../UI/AdminTerminal';

const AdminProjects = ({ windowId, projects: initialProjects }) => {
    const [projects, setProjects] = useState(initialProjects || []);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [notice, setNotice] = useState(null);

    const handleConfirmDelete = async () => {
        if (!projectToDelete) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const formData = new FormData();
            formData.append('_method', 'DELETE');

            const response = await fetch(`/admin/projects/${projectToDelete.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                setProjects(projects.filter((project) => project.id !== projectToDelete.id));
                setNotice({ type: 'success', message: `Project "${projectToDelete.title}" deleted.` });
            } else {
                setNotice({ type: 'error', message: 'Failed to delete project.' });
            }
        } catch (error) {
            console.error('Delete error:', error);
            setNotice({ type: 'error', message: 'Error deleting project.' });
        } finally {
            setProjectToDelete(null);
        }
    };

    const rows = projects.map((project) => ({
        key: project.id,
        cells: [
            <div className="space-y-1">
                <div className="font-medium text-zinc-100">{project.title}</div>
                <div className="line-clamp-2 text-sm text-zinc-500">{project.description}</div>
            </div>,
            <span className={project.status === 'published' ? 'text-emerald-300' : 'text-amber-300'}>{project.status}</span>,
            project.link ? (
                <a className="break-all text-sky-300 hover:text-sky-200" href={project.link} target="_blank" rel="noreferrer">
                    {project.link}
                </a>
            ) : (
                <span className="text-zinc-600">-</span>
            ),
            <span className="text-zinc-500">{new Date(project.created_at).toLocaleDateString()}</span>,
            <div className="flex flex-wrap gap-2">
                <AdminTerminalButton tone="blue" onClick={() => { if (window.__APP_NAVIGATE__) window.__APP_NAVIGATE__(`/admin/projects/${project.id}/edit`); else window.location.href = `/admin/projects/${project.id}/edit`; }}>
                    Edit
                </AdminTerminalButton>
                <AdminTerminalButton tone="red" onClick={() => { setProjectToDelete(project); }}>
                    Delete
                </AdminTerminalButton>
            </div>,
        ],
    }));

    return (
        <AdminWindow
            windowId={windowId}
            title="Projects"
            subtitle="Simple Linux-style list for managing every portfolio entry."
            meta={[
                { label: 'total', value: projects.length, tone: 'blue' },
                { label: 'published', value: projects.filter((project) => project.status === 'published').length, tone: 'green' },
                { label: 'draft', value: projects.filter((project) => project.status === 'draft').length, tone: 'amber' },
            ]}
            actions={[
                { label: 'New Project', tone: 'green', icon: adminTerminalIcons.Plus, onClick: () => { if (window.__APP_NAVIGATE__) window.__APP_NAVIGATE__('/admin/projects/create'); else window.location.href = '/admin/projects/create'; } },
            ]}
        >
            <AdminTerminalPanel title="Project Registry" command="$ adminctl projects --list">
                <div className="space-y-4">
                    {notice ? <AdminTerminalNotice type={notice.type} message={notice.message} /> : null}
                    <AdminTerminalTable
                        columns={['project', 'status', 'link', 'created', 'actions']}
                        rows={rows}
                        emptyLabel="No project records"
                    />
                </div>
            </AdminTerminalPanel>

            <AdminTerminalConfirm
                open={Boolean(projectToDelete)}
                title="Delete Project"
                message={`Delete "${projectToDelete?.title}" permanently?`}
                confirmLabel="Delete"
                onCancel={() => { setProjectToDelete(null); }}
                onConfirm={handleConfirmDelete}
            />
        </AdminWindow>
    );
};

export default AdminProjects;
