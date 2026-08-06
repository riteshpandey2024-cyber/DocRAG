import { useEffect } from "react";
import axiosInstance from "../api/axios";
import useChatStore from "../store/chatStore";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { Trash2,BookOpenText } from "lucide-react";


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)
  const selectedChat = useChatStore((state) => state.selectedChat)
  const messages = useChatStore((state) => state.messages)
  const deleteChat = useChatStore((state) => state.deleteChat)
  const clearChatState = useChatStore((state) => state.clearChatState);

  const logout=useAuthStore((state)=>state.logout)

  const handleNewChat = async () => {
    if (selectedChat && messages.length == 0) {
      toast("☕ You are already in a new chat");
      return
    }
    try {
      const response = await axiosInstance.post("/chats/")
      addChat(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      await axiosInstance.delete(`/chats/${chatId}/`)
      deleteChat(chatId)
      if (selectedChat?.id === chatId) {
        setSelectedChat(null)
      }
      toast.success("🗑 Chat deleted successfully");
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get("/chats/")
        setChats(response.data);
        if (response.data.length > 0) {
          setSelectedChat(response.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchChats();
  }, [])

  return (

    <div className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#ede0d4] border-r border-[#d6c0b3] flex flex-col p-4 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>

      <div className="flex items-center justify-between mb-8">

        <h1 className="flex items-center gap-2 text-3xl font-bold text-[#7f5539]">
          <span><BookOpenText size={36} /></span>DocRAG
        </h1>

        <button
          className="md:hidden text-3xl text-[#7f5539]"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>

      </div>


      <button
        onClick={handleNewChat}
        className="w-full py-3 rounded-xl bg-[#7f5539] text-white font-semibold hover:bg-[#6f4518] transition"
      >
        + New Chat
      </button>


     <div className="mt-6 flex-1 overflow-y-auto space-y-2">

{

    chats.map((chat)=>(

        <div

            key={chat.id}

            className={`flex items-center justify-between p-3 rounded-2xl transition ${
                selectedChat?.id===chat.id
                ?
                "bg-[#d6c0b3] font-semibold text-[#6f4518]"
                :
                "hover:bg-[#e5d5c5]"
            }`}

        >

            <div

                className="flex-1 truncate cursor-pointer"

                onClick={()=>{

                    setSelectedChat(chat)

                    setSidebarOpen(false)

                }}

            >

                {chat.title}

            </div>

            <button
              onClick={(e) => {
                  e.stopPropagation();
                  const confirmed=window.confirm("Delete this chat permanently?\n\nThis will remove:\n• Messages\n• Uploaded PDFs\n• Embeddings");
                  if(confirmed){
                    handleDeleteChat(chat.id)
                  }
              }}
              className="ml-3 p-1 rounded hover:bg-red-100 hover:text-red-600 transition-all duration-200"
          >
              <Trash2 size={18} />
              </button>
        </div>
    ))
}
</div>
      <button
        onClick={()=>{
          const confirmed=window.confirm("Aare you sure you want to logout")
          if(confirmed){
            clearChatState();
            logout();
          }
        }}

        className="w-full py-3 rounded-xl border border-[#7f5539] text-[#7f5539] hover:bg-[#7f5539] hover:text-white transition"

      >

        Logout

      </button>

    </div>

  )

}

export default Sidebar;