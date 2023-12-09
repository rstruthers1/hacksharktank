import React from 'react';
import {NavLink, Outlet, useParams} from 'react-router-dom';
import '../Dashboard.css';
import {useGetUsersHackathonQuery} from "../../../apis/hackathonApi";
import {getLoggedInUser} from "../../../utils/authUtils";

const HackathonDashboard = () => {
    const {hackathonId} = useParams();
    const userId = getLoggedInUser()?.id;
    const {data: hackathon, isLoading} = useGetUsersHackathonQuery({hackathonId, userId});

    return (
        <div className="dashboard">
            <aside className="sidebar">
                {isLoading ? <div>Loading...</div> :
                    <>
                    <div className="menu-header">{hackathon?.eventName}</div>
                        <NavLink to={`/dashboard/hackathon/${hackathonId}/about`}>About Hackathon</NavLink>
                        <NavLink to={`/dashboard/hackathon/${hackathonId}/ideas`}>Ideas</NavLink>
                        {hackathon?.hackathonUserRoles?.some(role => role === 'admin') ?
                            <>

                                <NavLink to={`/dashboard/hackathon/${hackathonId}/edit`}>Edit Hackathon</NavLink>
                                <NavLink to={`/dashboard/hackathon/${hackathonId}/users`}>Manage Users</NavLink>
                            </> :
                            <>
                                <NavLink to={`/dashboard/hackathon/${hackathonId}/users`}>View Users</NavLink>
                            </>

                        }
                   </>
                }

            </aside>
            <main className="content">
                <Outlet/> {/* Child routes will render here */}
            </main>
        </div>
    );
};

export default HackathonDashboard;
