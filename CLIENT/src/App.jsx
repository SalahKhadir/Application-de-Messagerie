import { useState } from "react";
import Chat from "./components/Chat";
import Auth from "./components/Auth";
import socket from "./services/socket";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    if (token) {
        socket.auth = { token };
        socket.connect();
    }

    return <div>{token ? <Chat /> : <Auth setToken={setToken} />}</div>;
}

export default App;
