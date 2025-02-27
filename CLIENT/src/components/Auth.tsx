import { useState } from "react";
import axios from "axios";

const Auth = ({ setToken }: { setToken: (token: string) => void }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // @ts-ignore
    const handleAuth = async (endpoint: string) => {
        try {
            const { data } = await axios.post(`http://localhost:3000/api/auth/${endpoint}`, { username, password });
            setToken(data.token);
            localStorage.setItem("token", data.token);
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    };

    return (
        <div>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => handleAuth("register")}>Register</button>
            <button onClick={() => handleAuth("login")}>Login</button>
        </div>
    );
};

export default Auth;
