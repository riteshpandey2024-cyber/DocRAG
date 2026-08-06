import useChatStore from "../store/chatStore";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axios";
import { FileText,Upload } from 'lucide-react';
import ReactMarkdown from "react-markdown"


const ChatWindow = ({setSidebarOpen}) => {

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)

    const selectedChat = useChatStore(
        (state) => state.selectedChat
    );

    const messages = useChatStore(
        (state) => state.messages
    );

    const documents = useChatStore(
        (state) => state.documents
    )

    const setMessages = useChatStore(
        (state) => state.setMessages
    );
    
    const updateChatTitle=useChatStore((state)=>state.updateChatTitle)

    const addMessage = useChatStore((state) => state.addMessage)

    const setDocuments = useChatStore((state) => state.setDocuments)


    const handleFileClick = () => {
        fileInputRef.current.click()
    }

    const uploadPdf = async (file) => {
        if (!selectedChat) {
            alert("Please create/select a chat first");
            return;
        }
        try {
            setUploading(true)
            const formData = new FormData();
            formData.append('file', file)
            const response = await axiosInstance.post(`/chats/${selectedChat.id}/upload/`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            console.log(response.data)
        } catch (error) {
            console.error("PDF upload failed", error);
        }
        finally {
            setUploading(false);
        }
    }

    const loadDocuments = async () => {
        try {
            const response = await axiosInstance.get(`/chats/${selectedChat.id}/documents/`)
            setDocuments(response.data)
        } catch (error) {
            console.error("Error fetching the documents", error)
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setSelectedFile(file)
        await uploadPdf(file);
    }

    

    useEffect(() => {
        if (!selectedChat) return;
        // setSelectedFile(null);
        const fetchMessages = async () => {
            setSelectedFile(null);
            try {
                const response = await axiosInstance.get(`/chats/${selectedChat.id}/messages/`);
                setMessages(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchMessages();
        loadDocuments();
    }, [selectedChat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behaviour: "smooth"
        })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || !selectedChat) return;
        const question = input;
        addMessage({
            role: "user",
            content: question
        })
        setInput("");
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/chats/${selectedChat.id}/message/`, {
                message: question,
            })

            addMessage({
                role: "assistant",
                content: response.data.answer,
                sources: response.data.sources
            })
            updateChatTitle(selectedChat.id,response.data.chat_title)
        } catch (error) {
            console.error("Error sending messages to the bot", error)
            addMessage({
                role: "assistant",
                content: "Something went wrong."
            });
        } finally {
            setLoading(false);
        }
    }

    return (

            <div className="flex flex-col flex-1 h-screen bg-[#f5eee6] w-full">
            {
                selectedChat ?
                    <>
                        <div className="p-6 border-b border-[#d6ccc2]">
                             <div className="flex items-center gap-4">
                                <button
                                    className="md:hidden text-3xl text-[#7f5539]"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    ☰
                                </button>

                                <h1 className="text-2xl font-bold text-[#6f4518]">
                                    {selectedChat.title}
                                </h1>

                            </div>

                            {
                                documents.length > 0 && (

                                    <div className="mt-4">

                                        {/* <p className="text-sm font-semibold text-[#7f5539] mb-2">
                                            Documents
                                        </p> */}
                                        <div className="flex flex-wrap gap-2">
                                            {
                                                documents.map((doc) => (
                                                    <div key={doc.id} className="px-3 py-1 bg-[#ede0d4] rounded-full text-sm text-[#6f4518] border border-[#d6ccc2]">
                                                        {/* <FileText /> */}
                                                             {doc.filename}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }

                        </div>



                        <div className="flex-1 overflow-y-auto p-6 space-y-4">

                            {
                                messages.length === 0 ?
                                    (
                                        <div className="h-full flex items-center justify-center">

                                            <div className="text-center max-w-md">

                                                <div className="flex justify-center text-6xl mb-6">
                                                    <FileText size={50} color="#7f5539" />

                                                    {/* 📄 */}

                                                </div>

                                                <h2 className="text-2xl font-bold text-[#6f4518] mb-4">

                                                    Upload PDFs and Start Chatting

                                                </h2>

                                                <p className="text-[#7f5539] mb-6">

                                                    Ask questions about research papers,
                                                    books, notes, resumes, reports,
                                                    or any PDF document.

                                                </p>

                                                {
                                                    documents.length === 0 &&
                                                    <div className="bg-[#ede0d4] rounded-2xl p-6 text-[#6f4518] flex flex-col items-center text-center">
                                                    <p>No PDFs uploaded yet.</p>
                                                    <Upload size={32} className="my-3" />
                                                    <p>Click on the icon beside the input to upload one.</p>
                                                    </div>
                                                }

                                            </div>

                                        </div>
                                    )

                                    : (messages.map((message, index) => (

                                        <div key={index} className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.role === "user" ? "ml-auto bg-[#7f5539] text-white" : "bg-[#ede0d4] text-[#3d2b1f]"}`}>
                                            <ReactMarkdown>
                                            {message.content}
                                        </ReactMarkdown>

                                            {
                                                message.role === "assistant"
                                                &&
                                                message.sources
                                                &&
                                                message.sources.length > 0
                                                &&
                                                <div className="mt-4 pt-3 border-t border-[#c9b8a8]">
                                                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                                                        Sources
                                                    </p>
                                                    {
                                                        message.sources.map((source, idx) => (
                                                            <div key={idx} className=" text-sm py-1">
                                                                📄
                                                                {" "}
                                                                {source.source}
                                                                {" "}
                                                                <span className="opacity-70">
                                                                    (Page {source.page})
                                                                </span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            }
                                        </div>
                                    )))
                            }
                            <div ref={messagesEndRef}></div>


                            {
                                loading && (
                                    <div className="flex justify-start mb-4">
                                        <div className=" bg-[#ede0d4] px-4 py-3 rounded-2xl text-[#6f4518] max-w-xs animate-pulse">
                                            Thinking...
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="p-4 border-t border-[#d6ccc2]">
                            {
                                selectedFile && (
                                    <div className="mb-3 inline-flex items-center gap-2 bg-[#ede0d4] text-[#6f4518] px-4 py-2 rounded-full text-sm font-medium">
                                        📄 {selectedFile.name}
                                        <span className="ml-2 text-xs">
                                            {
                                                uploading ? "Uploading..." : "✓ Uploaded"
                                            }
                                        </span>
                                    </div>
                                )
                            }
                            <div className="flex gap-3 items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <button
                                    onClick={handleFileClick}
                                    className="px-4 py-3 rounded-xl bg-[#ede0d4] hover:bg-[#dbc7b8]"
                                >
                                        <Upload color="#6f4518"/>

                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e)=>{
                                        if(e.key==="Enter" && !loading){handleSend();}
                                    }}
                                    placeholder="Ask something about your documents..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#d6ccc2] outline-none"
                                />

                                <button onClick={handleSend} disabled={loading} className="px-6 py-3 rounded-xl bg-[#7f5539] text-white"
                                >
                                    {
                                        loading
                                            ?
                                            "..."
                                            :
                                            "Send"
                                    }
                                </button>
                            </div>
                        </div>
                    </>
                    :
                    <div className="flex flex-1 items-center justify-center">

                        <div className="text-center">

                            <div className="text-6xl mb-6">

                                ☕📄

                            </div>

                            <h1 className="text-3xl font-bold text-[#6f4518] mb-3">

                                Welcome to DocRAG

                            </h1>

                            <p className="text-[#7f5539] text-lg">

                                Create a chat and upload PDFs to start asking questions.

                            </p>

                        </div>

                    </div>
            }
        </div>
    )

}

export default ChatWindow