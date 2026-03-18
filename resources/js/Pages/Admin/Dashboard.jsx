import React from 'react';
import {
    AdminTerminalAction,
    AdminTerminalButton,
    AdminTerminalPanel,
    AdminWindow,
    AdminTerminalStat,
    AdminTerminalTable,
    adminTerminalIcons,
} from '../../UI/AdminTerminal';

const Dashboard = ({ windowId, stats, recentProjects }) => {
    const projectRows = (recentProjects || []).map((project) => ({
        key: project.id,
        cells: [
            <div className="truncate font-medium text-zinc-100">{project.title}</div>,
            <span className={project.status === 'published' ? 'text-emerald-300' : 'text-amber-300'}>{project.status}</span>,
            <span className="text-zinc-500">{new Date(project.created_at).toLocaleDateString()}</span>,
            <div className="flex flex-wrap gap-2">
                <AdminTerminalButton tone="blue" onClick={() => { if (window.__APP_NAVIGATE__) window.__APP_NAVIGATE__(`/admin/projects/${project.id}/edit`); else window.location.href = `/admin/projects/${project.id}/edit`; }}>
                    Edit
                </AdminTerminalButton>
            </div>,
        ],
    }));

    return (
        <AdminWindow
            windowId={windowId}
            title="Admin Dashboard"
            subtitle="Linux-style control room for projects, messages, and quick admin actions."
            meta={[
                { label: 'projects', value: stats?.total || 0, tone: 'blue' },
                { label: 'published', value: stats?.published || 0, tone: 'green' },
                { label: 'drafts', value: stats?.draft || 0, tone: 'amber' },
                { label: 'messages', value: stats?.messages || 0, tone: 'neutral' },
            ]}
            actions={[
                { label: 'View Site', tone: 'neutral', icon: adminTerminalIcons.Boxes, onClick: () => { window.location.href = '/'; } },
            ]}
        >
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                    <AdminTerminalPanel title="System Stats" command="$ adminctl stats --overview">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <AdminTerminalStat label="total" value={stats?.total || 0} hint="all portfolio records" tone="blue" />
                            <AdminTerminalStat label="published" value={stats?.published || 0} hint="publicly visible" tone="green" />
                            <AdminTerminalStat label="drafts" value={stats?.draft || 0} hint="still in progress" tone="amber" />
                            <AdminTerminalStat label="messages" value={stats?.messages || 0} hint="inbox records" tone="neutral" />
                        </div>
                    </AdminTerminalPanel>

                    <AdminTerminalPanel title="Quick Actions" command="$ adminctl shortcuts">
                        <div className="grid gap-4 md:grid-cols-3">
                            <AdminTerminalAction
                                icon={adminTerminalIcons.Plus}
                                label="New Project"
                                description="Create a new portfolio entry."
                                tone="green"
                                onClick={() => { window.location.href = '/admin/projects/create'; }}
                            />
                            <AdminTerminalAction
                                icon={adminTerminalIcons.FolderKanban}
                                label="Manage Projects"
                                description="Review, edit, and delete entries."
                                tone="blue"
                                onClick={() => { window.location.href = '/admin/projects'; }}
                            />
                            <AdminTerminalAction
                                icon={adminTerminalIcons.Mail}
                                label="Open Inbox"
                                description="Read and respond to contact messages."
                                tone="neutral"
                                onClick={() => { window.location.href = '/admin/messages'; }}
                            />
                        </div>
                    </AdminTerminalPanel>
                </div>

                <AdminTerminalPanel
                    title="Recent Projects"
                    command="$ adminctl projects --recent"
                    headerAction={
                        <AdminTerminalButton tone="blue" onClick={() => { window.location.href = '/admin/projects'; }}>
                            Open List
                        </AdminTerminalButton>
                    }
                >
                    <AdminTerminalTable
                        columns={['title', 'status', 'created', 'action']}
                        rows={projectRows}
                        emptyLabel="No recent projects"
                    />
                </AdminTerminalPanel>
            </div>
        </AdminWindow>
    );
};

export default Dashboard;
