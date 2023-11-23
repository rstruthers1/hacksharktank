import React from 'react';
import {NavLink, Outlet, useParams} from 'react-router-dom';
import './HackathonAdminDashboard.css';

const HackathonAdminDashboard = () => {
    const { hackathonId } = useParams();

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <NavLink to={`/admin/hackathon/${hackathonId}/edit`}>Edit Hackathon</NavLink>
                <NavLink to={`/admin/hackathon/${hackathonId}/users`}>Manage Users</NavLink>
                {/* Additional links */}
            </aside>
            <main className="content">
                <Outlet /> {/* Child routes will render here */}
            </main>
        </div>
    );
};

export default HackathonAdminDashboard;
