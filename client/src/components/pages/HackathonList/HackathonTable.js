import HackathonTableBase from './HackathonTableBase';
import {Link} from "react-router-dom";
import {formatDateTimeAsDate} from "../../../utils/dateTimeUtils";


const HackathonTable = ({ hackathons }) => {
    const columns = ['ID', 'Event Name', 'Description', 'Start Date', 'End Date'];
    const linkPath = '/admin/hackathon/';

    const renderRow = (hackathon) => (
        <tr key={hackathon.id}>
            <td>{hackathon.id}</td>
            <td><Link to={`${linkPath}${hackathon.id}/edit`}>{hackathon.eventName}</Link></td>
            <td>{hackathon.description}</td>
            <td>{formatDateTimeAsDate(hackathon.startDate)}</td>
            <td>{formatDateTimeAsDate(hackathon.endDate)}</td>
        </tr>
    );

    return <HackathonTableBase hackathons={hackathons} columns={columns} renderRow={renderRow} />;
};

export default HackathonTable;