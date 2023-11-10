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

async function getMyVar() {
    const baseURL = process.env.REACT_APP_API_URL || "";

    console.log(`*** baseURL: ${baseURL}`)

    const response = await fetch(`${baseURL}/myvar`);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();


}

export function App() {
    const [users, setUsers] = useState([]);
    const [myVar, setMyVar] = useState('');

    useEffect(() => {
        (async () => {
            setUsers(await getUsers());
        })();
        (async () => {
            setMyVar(await getMyVar());
        })();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
            <h1>My Hack Tank App</h1>
            <div>
                <h2>Users</h2>
                <p>Users are fetched from the Node.js server that serves this app</p>
                <p>
                    In the server the users is a .json file however, you would probably
                    swap this out for database connection in production!
                </p>
                <div>
                    <h3>MY_VAR: {myVar?.MY_VAR}</h3>
                </div>
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
