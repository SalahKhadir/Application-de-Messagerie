import { useEffect, useState } from "react";
import socket from "../services/socket";

const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        socket.on("receiveMessage", (message: string) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit("sendMessage", input);
            setInput("");
        }
    };

    return (
        <div>
            <h2>Chat en temps réel</h2>
            <div>
                {messages.map((msg, i) => (
                    <p key={i}>{msg}</p>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tapez votre message..."
            />
            <button onClick={sendMessage}>Envoyer</button>
        </div>
    );
};

export default Chat;
