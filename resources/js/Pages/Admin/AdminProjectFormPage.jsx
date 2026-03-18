import React from 'react';
import {
    AdminTerminalButton,
    AdminTerminalField,
    AdminTerminalNotice,
    AdminTerminalPanel,
    AdminWindow,
    AdminTerminalStatusPicker,
    AdminTerminalUpload,
    adminTerminalIcons,
} from '../../UI/AdminTerminal';

const AdminProjectFormPage = ({
    windowId,
    mode,
    formData,
    onChange,
    onSubmit,
    errors,
    submitting,
    imagePreview,
    onImageChange,
    notice,
}) => {
    const isEdit = mode === 'edit';

    return (
        <AdminWindow
            windowId={windowId}
            title={isEdit ? 'Edit Project' : 'Create Project'}
            subtitle={isEdit ? 'Update project metadata, link, image, and publish status.' : 'Register a new portfolio entry using the lightweight admin shell.'}
            meta={[
                { label: 'mode', value: isEdit ? 'edit' : 'create', tone: isEdit ? 'blue' : 'green' },
                { label: 'status', value: formData.status, tone: formData.status === 'published' ? 'green' : 'amber' },
            ]}
            actions={[
                { label: 'Back to Projects', tone: 'neutral', icon: adminTerminalIcons.FolderKanban, onClick: () => { if (window.__APP_NAVIGATE__) window.__APP_NAVIGATE__('/admin/projects'); else window.location.href = '/admin/projects'; } },
            ]}
        >
            <form onSubmit={onSubmit}>
                <AdminTerminalPanel
                    title={isEdit ? 'Project Mutation' : 'Project Creation'}
                    command={isEdit ? '$ adminctl projects --update' : '$ adminctl projects --create'}
                    headerAction={
                        <AdminTerminalButton
                            type="submit"
                            tone={isEdit ? 'blue' : 'green'}
                            icon={isEdit ? adminTerminalIcons.Save : adminTerminalIcons.Plus}
                            disabled={submitting}
                        >
                            {submitting ? (isEdit ? 'Updating' : 'Creating') : (isEdit ? 'Save Changes' : 'Create Project')}
                        </AdminTerminalButton>
                    }
                >
                    <div className="space-y-5">
                        {notice ? <AdminTerminalNotice type={notice.type} message={notice.message} /> : null}
                        {errors.general ? <AdminTerminalNotice type="error" message={errors.general} /> : null}

                        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-5">
                                <AdminTerminalField
                                    label="Project title"
                                    name="title"
                                    value={formData.title}
                                    onChange={onChange}
                                    placeholder="Inventory tracker"
                                    error={errors.title?.[0]}
                                />

                                <AdminTerminalField
                                    label="Description"
                                    name="description"
                                    as="textarea"
                                    rows={7}
                                    value={formData.description}
                                    onChange={onChange}
                                    placeholder="Describe the project scope, stack, and result."
                                    error={errors.description?.[0]}
                                />

                                <AdminTerminalField
                                    label="Project link"
                                    name="link"
                                    type="url"
                                    value={formData.link}
                                    onChange={onChange}
                                    placeholder="https://example.com"
                                    error={errors.link?.[0]}
                                />
                            </div>

                            <div className="space-y-5">
                                <AdminTerminalUpload imagePreview={imagePreview} onChange={onImageChange} error={errors.image?.[0]} />
                                <div>
                                    <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500">Status</div>
                                    <AdminTerminalStatusPicker value={formData.status} onChange={onChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminTerminalPanel>
            </form>
        </AdminWindow>
    );
};

export default AdminProjectFormPage;
