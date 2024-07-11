// ** React Imports
import { createContext, useEffect, useState, ReactNode, useRef, Dispatch, SetStateAction } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { MensajeData } from 'src/interfaces/objects/MensajeData';
import UserService from 'src/services/UserService';
import MessageService from 'src/services/MessageService';
import { useAuth } from 'src/hooks/useAuth';
import ChatService from '../services/ChatService';
import { ChatData } from 'src/interfaces/objects/ChatData';


interface ChatValuesType{
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    handleOnSelectChat: (chat: number) => void;
    chat: ChatData | undefined,
    chats: ChatData[],
    mensajes: MensajeData[]
}

const defaultProvider: ChatValuesType = {
    loading: false,
    setLoading: () => Boolean,
    handleOnSelectChat: (chat: number) => {},
    chat: {},
    chats: [],
    mensajes: [],
}

const ChatContext = createContext(defaultProvider)

type Props = {
    children: ReactNode
}


const ChatProvider = ({ children }: Props) => {
    // ** States
    const [chat, setChat] = useState<ChatData | undefined>();
    const [chats, setChats] = useState<ChatData[]>([]);
    const [mensajes, setMensajes] = useState<MensajeData[]>([]);
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading);

    // ** Services
    const service = new ChatService();
    const serviceMessages = new MessageService();

    useEffect(() => {
        getChats();
    }, [])

    // Refresh chats
    useEffect(() => {
        const intervalChats = setInterval(() => {
            getChats();
        }, 5000);

        const intervalMsg = setInterval(updateChatMsg, 2500);

        return () => {
            clearInterval(intervalChats);
            clearInterval(intervalMsg);
        };
    }, [useState]);

    // Get List
    const getChats = () => {
        let query = '?portal=true';

        service.getAll(query).then((result) => {
            if(result && !result.error && result.result){
                const chatsTemp: ChatData[] = result.result;
                setChats((oldChats) => {
                    if(oldChats && oldChats.length == 0){
                        setChats(chatsTemp);
                        oldChats = chatsTemp;
                        return chatsTemp;
                    } else {
                        if(!oldChats) oldChats = [];

                        const newChats = chatsTemp.filter(element => {
                            let exist = oldChats.find(old => element.id == old.id);
                            return !exist;
                        });
                        if(newChats && newChats.length > 0){
                            setChats([...newChats, ...oldChats]);
                            setTimeout(() => {
                                scrollToBottom();
                            }, 200)
                        }
                        return oldChats;
                    }
                })
            } else {
                let error = `Error al obtener datos: ${result.mensaje}`;
                // await setMessageAlert(error);
                // setOpenAlert(true);
                console.log(error);
            }
        });

    }

    const updateChatMsg = () => {
        // Get chat
        setChat((oldChat) => {

            // Validate chat
            if(oldChat && !loading){

                // Update Messages
                setMensajes((oldMessages) => {
                    let chatId = Number(oldChat.id);
                    serviceMessages.listByChat(chatId).then((resultMessages) => {
                        if(resultMessages && resultMessages.result && Array.isArray(resultMessages.result) && !loading){
                            let mensajesTemp: MensajeData[] = resultMessages.result;
                            let idsExist = oldMessages.map(element => element.id);
                            let idsNews = mensajesTemp.map(element => element.id);
                            let newMessages = mensajesTemp.filter(element => !idsExist.includes(element.id));

                            // Reset values
                            if(newMessages && newMessages.length > 0){
                                oldMessages = [...oldMessages, ...newMessages]
                                setMensajes(oldMessages);

                                setTimeout(() => {
                                    scrollToBottom();
                                }, 200)
                            }
                        }
                    });
                    return oldMessages;
                });
            }
            return oldChat;
        });
    }

    const onSelectChat = (ChatId: number) => {
        // Set Current Chat
        setLoading(true);
        setChat((oldChat) => {
            const selectedChat = chats.find(element => element.id == ChatId);
            return {...selectedChat};
        });
        setMensajes((oldMessages) => { return [] });

        getChatMessages(ChatId);

        updateChatMsg();

        setLoading(false);
    }

    const getChatMessages = async (ChatId: number) => {
        var resultMessages = await serviceMessages.listByChat(ChatId);
        if(resultMessages && resultMessages.result && Array.isArray(resultMessages.result)){
            let mensajes: MensajeData[] = resultMessages.result;

            setMensajes((oldValue) => mensajes);
            setChat((oldChat) => {
                oldChat = chats.find(element => element.id == ChatId)
                return {...oldChat}
            });
            setTimeout(() => {
                scrollToBottom();
            }, 200)
        }
    }

    // ** Ref
    const chatArea = useRef(null)

    // ** Scroll to chat bottom
    const scrollToBottom = () => {
        // @ts-ignore
        if (chatArea.current && chatArea.current._container) {
            // @ts-ignore
            chatArea.current._container.scrollTop = Number.MAX_SAFE_INTEGER
        }
    }


    // Set auth values
    const values = {
        loading,
        setLoading,
        chat,
        chats,
        mensajes,
        chatArea,
        handleOnSelectChat: onSelectChat,
    }

    // Return all values
    return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

export { ChatContext, ChatProvider }
