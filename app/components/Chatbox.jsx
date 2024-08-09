'use client'; // Ensure this is at the very top
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
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
        var passInput = input;
        setLoading(true);
        setQuery((prev) => ({ ...prev, content: input }));
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput("");

        try {
            // Step 1: Send query to Pinecone to get relevant information
            const pineconeRes = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: passInput }),
            });

            if (!pineconeRes.ok) {
                setLoading(false);
                const errorText = await pineconeRes.text();
                throw new Error(`Pinecone response was not ok: ${errorText}`);
            }

            // Step 1: Log the entire response to debug
            const pineconeResult = await pineconeRes.json();
            console.log("Pinecone Response:", pineconeResult);
            // Sample data to map to
            const data = {
                "store": {
                    "name": "Fashion Haven",
                    "address": "123 Fashion Street, Style City, SC 45678",
                    "owner": {
                        "name": "Sophia Carter",
                        "contact": {
                            "email": "sophia.carter@fashionhaven.com",
                            "phone": "+1-234-567-890"
                        }
                    },
                    "contacts": {
                        "email": "support@fashionhaven.com",
                        "phone": "+1-234-567-890",
                        "socialMedia": {
                            "instagram": "fashionhaven",
                            "facebook": "FashionHavenOfficial"
                        }
                    },
                    "products": [
                        {
                            "id": 201,
                            "name": "Elegant Silk Scarf",
                            "description": "A luxurious silk scarf available in various colors.",
                            "price": "$45",
                            "availability": "In Stock"
                        },
                        {
                            "id": 202,
                            "name": "Leather Handbag",
                            "description": "A premium leather handbag perfect for any occasion.",
                            "price": "$120",
                            "availability": "Limited Stock"
                        }
                    ],
                    "sales": [
                        {
                            "id": 301,
                            "product_id": 201,
                            "date": "2024-08-01",
                            "quantity": 15,
                            "totalAmount": "$675"
                        },
                        {
                            "id": 302,
                            "product_id": 202,
                            "date": "2024-08-05",
                            "quantity": 5,
                            "totalAmount": "$600"
                        }
                    ]
                }
            };

            // Step 2: Map Pinecone results to your original data
            const mappedResults = (pineconeResult.results.matches || []).map(match => {
                let matchedData = null;

                // Example of mapping the store info
                if (match.id === "store-info") {
                    matchedData = {
                        type: "Store Information",
                        name: data.store.name,
                        address: data.store.address,
                        owner: data.store.owner.name,
                        contactEmail: data.store.contacts.email,
                        contactPhone: data.store.contacts.phone,
                        socialMedia: data.store.contacts.socialMedia
                    };
                }

                // Example of mapping product information
                const productMatch = data.store.products.find(p => `product-${p.id}` === match.id);
                if (productMatch) {
                    matchedData = {
                        type: "Product Information",
                        name: productMatch.name,
                        description: productMatch.description,
                        price: productMatch.price,
                        availability: productMatch.availability
                    };
                }

                // Example of mapping sales information
                const saleMatch = data.store.sales.find(s => `sale-${s.id}` === match.id);
                if (saleMatch) {
                    const relatedProduct = data.store.products.find(p => p.id === saleMatch.product_id);
                    matchedData = {
                        type: "Sales Information",
                        saleDate: saleMatch.date,
                        product: relatedProduct.name,
                        quantitySold: saleMatch.quantity,
                        totalAmount: saleMatch.totalAmount
                    };
                }

                return matchedData;
            }).filter(item => item !== null); // Filter out any null matches

            // Step 3: Create a context block from the mapped results
            const contextBlock = mappedResults.map(result => JSON.stringify(result)).join('\n');

            // Log the final context block
            console.log("Context Block:", contextBlock);

            const prompt = `You are a customer service chatbot for Fashion Haven. Guide users based on the provided CONTEXT BLOCK. If the context doesn’t cover the question, provide contact information for Fashion Haven. Use reference links from the context when available and provide quotes with original sources if requested.
            Minimize your response length.
            For reference:
            Email: support@fashionhaven.com
            Phone: +1-234-567-890
            CONTEXT BLOCK:
            ${contextBlock}`

            // Step 4: Send query along with the context block to the LLM
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct:free",
                    messages: [
                        { role: "user", content: `${input}` },
                        { role: "system", content: prompt }, // Pass the relevant Pinecone data to the LLM
                    ],
                    max_tokens: 100, // Adjust as needed
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

            <img
                src="/chaticon.png"
                alt="Hi Sticker"
                className="w-16 h-16 cursor-pointer m-4 rounded-full hover:bg-gray-200 transition duration-300 p-2 shadow-lg hover:shadow-xl animate-pulse"
                onClick={toggleChatbox}
            />

            {isChatboxOpen && (
                <div
                    id="chat-container"
                    className={` fixed bottom-16 right-4 w-96 transition-opacity duration-900  ease-in-out  ${isChatboxOpen ? "opacity-100" : "opacity-0"
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
                                    className="w-8 h-8 mr-2 animate-pulse"
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
                                    className="w-10 h-10 mr-3 animate-spin"
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
