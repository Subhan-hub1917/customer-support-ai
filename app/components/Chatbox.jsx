import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import hi from "../../public/hi.gif"
const Chatbox = () => {
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const toggleChatbox = () => setIsChatboxOpen(!isChatboxOpen);

    const [query, setQuery] = useState({
        role: "user",
        content: "",
    });

    const messagesRef = useRef(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: "system", content: "Hi! How can I assist you?" },
    ]);

    const scrollToBottom = () => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuery = async (e) => {
        e.preventDefault();
        if (input === "") {
            return;
        }
        setLoading(true);
        setQuery((prev) => ({ ...prev, content: input }));
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput("");
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct:free",
                    messages: [
                        { role: "user", content: `Clothing Brand Kingmen Customer Support. ${input}` },
                    ],
                    max_tokens: 10,
                }),
            });

            if (!res.ok) {
                setLoading(false);
                const errorText = await res.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const result = await res.json();
            const systemResponse = {
                role: "system",
                content: result.choices[0].message.content,
            };
            setMessages((prev) => [...prev, systemResponse]);
            setLoading(false);
        } catch (error) {
            alert(`Error requesting the model: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <>
            <button
                id="open-chat"
                className="bg-orange-500 text-white py-2 px-4 rounded-md hover:border-orange-600 transition duration-600 flex items-center"
                onClick={toggleChatbox}
            >
                <img
                    src="/hi.gif"
                    alt="Hi Sticker"
                    className="w-6 h- mr-2"
                />
                Customer Service
            </button>


            {isChatboxOpen && (
                <div
                    id="chat-container"
                    className={` fixed bottom-16 right-4 w-96 transition-opacity duration-900 ease-in-out ${isChatboxOpen ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ visibility: isChatboxOpen ? "visible" : "hidden" }}
                >
                    <div className="bg-white shadow-2xl rounded-lg border border-orange-500 max-w-lg w-full overflow-hidden">
                        <div className="p-4 border-b bg-orange-500 text-white rounded-t-lg flex justify-between items-center">
                            <div className="flex flex-row justify-start align-middle">
                                <p className="text-lg font-semibold mx-3.5">SilkBot</p>
                            </div>
                            <button
                                id="close-chat"
                                className="text-orange-300 hover:text-orange-400 focus:outline-none focus:text-orange-400 transition-colors duration-300"
                                onClick={toggleChatbox}
                            >
                                <img
                                    src="/close.png"
                                    alt="Chatbot Icon"
                                    className="w-8 h-8 mr-2"
                                />
                            </button>
                        </div>
                        <div id="chatbox" className="p-4 h-80 overflow-y-auto">
                            {messages.map((m, index) => (
                                <div
                                    key={index}
                                    className={`my-1 flex items-start ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {m.role === "user" ? (
                                        <>
                                            <Markdown
                                                className={`text-sm p-2 inline-block text-white bg-slate-500 text-end rounded-s-2xl rounded-b-2xl`}
                                            >
                                                {m.content}
                                            </Markdown>
                                            <img
                                                src="/profile.png"
                                                alt="User Icon"
                                                className="w-8 h-8 ml-2"
                                            />
                                        </>
                                    ) : m.role === "system" && (
                                        <>
                                            <img
                                                src="/service.png"
                                                alt="Chatbot Icon"
                                                className="w-8 h-8 mr-2"
                                            />
                                            <Markdown
                                                className={`text-sm p-2 inline-block text-white bg-orange-500 text-left mt-2 mb-2 rounded-e-2xl rounded-b-2xl`}
                                            >
                                                {m.content}
                                            </Markdown>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesRef} />
                        </div>


                        <div className="p-4 border-t flex">
                            {loading && (
                                <img
                                    src="/loading.gif"
                                    alt="Loading"
                                    className="w-10 h-10 mr-3"
                                />

                            )}
                            <form
                                onSubmit={handleQuery}
                                className="w-full flex items-center justify-between space-x-3 "
                            >
                                <input
                                    id="user-input"
                                    type="text"
                                    placeholder="Type a message"
                                    className="w-full px-3 py-2 border rounded-l-full  border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    id="send-button"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-r-full hover:bg-orange-700 transition-transform transform hover:scale-105 duration-500"
                                    type="submit"
                                >
                                    Send
                                </button>
                            </form>
                        </div>


                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbox;
