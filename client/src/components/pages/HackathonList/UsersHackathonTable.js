import HackathonTableBase from './HackathonTableBase';
import {Link} from "react-router-dom";
import {formatDateTimeAsDate} from "../../../utils/dateTimeUtils";

const UsersHackathonTable = ({ hackathons }) => {
    const columns = ['ID', 'Event Name', 'Description', 'Start Date', 'End Date', 'Your Roles'];
    const linkPath = '/dashboard/hackathon/';

    const renderRow = (hackathon) => (
        <tr key={hackathon.id}>
            <td>{hackathon.id}</td>
            <td><Link to={`${linkPath}${hackathon.id}/about`}>{hackathon.eventName}</Link></td>
            <td>{hackathon.description}</td>
            <td>{formatDateTimeAsDate(hackathon.startDate)}</td>
            <td>{formatDateTimeAsDate(hackathon.endDate)}</td>
            <td>{hackathon.hackathonUserRoles.map((role) => (
                <div key={role}>{role}</div>
            ))}</td>
        </tr>
    );

    return <HackathonTableBase hackathons={hackathons} columns={columns} renderRow={renderRow} />;
};

export default UsersHackathonTable;