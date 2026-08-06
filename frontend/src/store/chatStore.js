import {create} from "zustand"
const useChatStore=create((set)=>({
    chats:[],
    selectedChat:null,
    messages:[],
    documents:[],

    setChats:(chats)=>{
        set({chats})
    },
    addChat:(chat)=>{
        set((state)=>({
            chats:[chat,...state.chats],
            selectedChat:chat
        }))
    },
    setSelectedChat:(chat)=>{
        set({selectedChat:chat})
    },
    setMessages:(messages)=>{
        set({messages})
    },
    addMessage:(message)=>{
        set((state)=>({
            messages:[...state.messages,message]
        }))
    },
    setDocuments:(documents)=>{
        set({documents})
    },
    updateChatTitle:(chatId,newTitle)=>
        set((state)=>({
            chats:state.chats.map((chat)=>
            chat.id==chatId?{ ...chat, title: newTitle }:chat
        )
    })),
    deleteChat:(chatId)=>{
        set((state)=>({
            chats:state.chats.filter((chat)=>chat.id!=chatId)
        }))
    },
    clearChatState:()=>{
        set({
            chats:[],
            selectedChat:null,
            messages:[],
            documents:[]
        })
    }
}))

export default useChatStore