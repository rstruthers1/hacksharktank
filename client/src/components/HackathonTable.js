import React, { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import {formatDateTimeAsDate} from "../utils/dateTimeUtils";
import './HackathonTable.css'

const HackathonTable = ({ hackathons, itemsPerPage = 5 }) => {
    const [activePage, setActivePage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHackathons = searchTerm
        ? hackathons.filter(hackathon =>
            hackathon.eventName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : hackathons;

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHackathons.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setActivePage(pageNumber);

    const totalPages = Math.ceil(hackathons.length / itemsPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === activePage} onClick={() => paginate(number)}>
                {number}
            </Pagination.Item>,
        );
    }



    return (
        <div className="table-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by event name..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="table-scrollable">
            <Table bordered hover>
                <thead>
                <tr>
                    <th className="idColumn">ID</th>
                    <th className="eventNameColumn">Event Name</th>
                    <th className="descriptionColumn">Description</th>
                    <th className="startDateColumn">Start Date</th>
                    <th className="endDateColumn">End Date</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((hackathon) => (
                    <tr key={hackathon.id}>
                        <td>{hackathon.id}</td>
                        <td>{hackathon.eventName}</td>
                        <td>{hackathon.description}</td>
                        <td>{formatDateTimeAsDate(hackathon.startDate)}</td>
                        <td>{formatDateTimeAsDate(hackathon.endDate)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </div>
            <div className="pagination-container">
                <Pagination>
                    <Pagination.First onClick={() => paginate(1)} disabled={activePage === 1} />
                    <Pagination.Prev onClick={() => paginate(activePage - 1)} disabled={activePage === 1} />

                    {items}

                    <Pagination.Next onClick={() => paginate(activePage + 1)} disabled={activePage === totalPages} />
                    <Pagination.Last onClick={() => paginate(totalPages)} disabled={activePage === totalPages} />
                </Pagination>
            </div>
        </div>
    );
};

export default HackathonTable;
