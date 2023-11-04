import { useEffect, useState } from "react";

async function getUsers() {
    const baseURL = process.env.REACT_APP_API_URL || "";
    
    console.log(`*** baseURL: ${baseURL}`)

    const response = await fetch(`${baseURL}/users`);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const users = await response.json();

    return users;
}

export function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            setUsers(await getUsers());
        })();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
            <h1>My App - Test Deployment with Action</h1>
            <div>
                <h2>Users</h2>
                <p>Users are fetched from the Node.js server that serves this app</p>
                <p>
                    In the server the users is a .json file however, you would probably
                    swap this out for database connection in production!
                </p>
                {users.map((user) => (
                    <div key={user.name}>
                        <h3>{user.name}</h3>
                        <a target="_blank" style={{color: "white"}} href={user.website}>{user.website}</a>
                    </div>
                ))}
            </div>
            </header>
        </div>
    );
}
