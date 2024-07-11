// ** React Imports
import { useRef, useEffect, Ref, ReactNode, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Check from 'mdi-material-ui/Check'
import CheckAll from 'mdi-material-ui/CheckAll'

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import {
  ChatLogType,
  MessageType,
  MsgFeedbackType,
  ChatLogChatType,
  MessageGroupType,
  FormattedChatsType
} from 'src/types/apps/chatTypes'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import React from 'react'
import { DownloadOutline } from 'mdi-material-ui'

interface TestProps {
    message: ChatLogChatType,
    index: number,
    isSender: boolean,
}

const TestItem = React.memo(({ message, index, isSender }: TestProps) => {
    const renderMsgFeedback = (isSender: boolean, feedback: MsgFeedbackType) => {
        if (isSender) {
            if (feedback.isSent && !feedback.isDelivered) {
                return <Check sx={{ mr: 2, fontSize: '1rem', color: 'text.secondary' }} />
            } else if (feedback.isSent && feedback.isDelivered) {
                return <CheckAll sx={{ mr: 2, fontSize: '1rem', color: feedback.isSeen ? 'success.main' : 'text.secondary' }} />
            } else {
                return null
            }
        }
    }

    const time = new Date(message.time);

    return(
        <Box key={index} sx={{ '&:not(:last-of-type)': { mb: 3.5 } }}>
            <Box>
                {/* Message */}
                {
                    message.msg && message.msg.length > 0 ?
                    <Typography
                        sx={{
                            boxShadow: 1,
                            borderRadius: 1,
                            width: 'fit-content',
                            fontSize: '0.875rem',
                            p: theme => theme.spacing(3, 4),
                            marginLeft: isSender ? 'auto' : undefined,
                            borderTopLeftRadius: !isSender ? 0 : undefined,
                            borderTopRightRadius: isSender ? 0 : undefined,
                            color: isSender ? 'common.white' : 'text.primary',
                            backgroundColor: isSender ? 'primary.main' : 'background.paper'
                        }}
                        >
                            {/* Text */}
                            {message.msg}
                    </Typography>
                    : null
                }

                {/* Download image */}
                {
                    !!message.file ? <DownloadButton url={message.file} isSender={isSender}/> : null
                }
            </Box>
            {index + 1 === length ? (
                <Box
                    sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSender ? 'flex-end' : 'flex-start'
                    }}
                >
                {renderMsgFeedback(isSender, message.feedback)}
                <Typography variant='caption'>
                    {time
                    ? new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                    : null}
                </Typography>
                </Box>
            ) : null}
        </Box>
    );
});

interface ChatGroupProps {
    chat: any,
    index: number,
    length: number,
    item: FormattedChatsType,
    isSender: boolean,
    idUser: number | undefined
}

const ChatGroup = React.memo(({ chat, index, item, isSender, length, idUser }: ChatGroupProps) => {
    const usuario = chat.Mensajes.find((msg: any) => msg.Escritor.id !== idUser)?.Escritor || {};

    const admin = {
      nombre: 'Administrador',
      imagenUsuario: null // Reemplaza con la URL de la imagen del admin si está disponible
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSender ? 'row-reverse' : 'row',
                mb: index !== length - 1 ? 4 : undefined
            }}
        >
            <Box>
                <CustomAvatar
                skin='light'
                sx={{
                    width: '2rem',
                    height: '2rem',
                    fontSize: '0.875rem',
                    ml: isSender ? 3.5 : undefined,
                    mr: !isSender ? 3.5 : undefined
                }}
                src={isSender ? admin.imagenUsuario : usuario.imagenUsuario}
                alt={isSender ? admin.nombre : usuario.nombre}
                >
                {getInitials(isSender ? admin.nombre : usuario.nombre)}
                </CustomAvatar>
            </Box>

            <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
                {item.messages.map((message: ChatLogChatType, indexMessage: number, { length }: { length: number }) => {
                return <TestItem key={`chat-${index}-message-${indexMessage}`} message={message} index={index} isSender={isSender} />;
                })}
            </Box>
        </Box>
    );
  });

const DownloadButton = ({ url, isSender } : { url: string, isSender: boolean }) => {

    return (
        <Box sx={{
                boxShadow: 1,
                borderRadius: 1,
                width: 'fit-content',
                fontSize: '0.875rem',
                p: theme => theme.spacing(3, 4),
                marginLeft: isSender ? 'auto' : undefined,
                borderTopLeftRadius: !isSender ? 0 : undefined,
                borderTopRightRadius: isSender ? 0 : undefined,
                color: isSender ? 'common.white' : 'text.primary',
                backgroundColor: isSender ? 'primary.main' : 'background.paper',
                alignContent: 'center',
                justifyContent: 'center'
            }}>
            <a target={'_blank'} href={url}>
                <DownloadOutline fontSize='small' sx={{ mr: 1 }} />
            </a>
        </Box>
    )
}

const ChatLog = (props: ChatLogType) => {
    // ** Props
    const { hidden, chat, messages } = props

    // ** Hooks
    const auth = useAuth();

    // ** Hooks
    const chatArea = useRef();

    // ** Formats chat data based on sender
    const formattedChatData = () => {
        let chatLog: any[] | [] = []
        if (messages && messages.length > 0) {
            chatLog = messages;
        }

        const formattedChatLog: FormattedChatsType[] = []
        let chatMessageSenderId = auth.user?.id
        let msgGroup: MessageGroupType = {
            senderId: chatMessageSenderId ? chatMessageSenderId : -1,
            messages: []
        };

        chatLog.forEach((msg: any, index: number) => {
            let { fechaCreacion, text } = msg;
            let files = msg.files ? JSON.parse(msg.files) : [];
            let file = files && files.length > 0 && files[0] && files[0].uri ? files[0].uri : null;

            if (chatMessageSenderId ===  msg.UsuarioEscritorId) {
                if(fechaCreacion && (text || file)){
                    msgGroup.messages.push({
                        time: fechaCreacion,
                        msg: text ? text : '',
                        feedback: {
                            isDelivered: true,
                            isSeen: true,
                            isSent: true,
                        },
                        file: file
                    })
                }
            } else if(msg.UsuarioEscritorId) {
                if(fechaCreacion && (text || file)){
                    chatMessageSenderId = msg.UsuarioEscritorId;
                    formattedChatLog.push(msgGroup)
                    msgGroup = {
                        senderId: msg.UsuarioEscritorId,
                        messages: [
                            {
                                time: fechaCreacion,
                                msg: text ? text : '',
                                feedback: {
                                    isDelivered: true,
                                    isSeen: true,
                                    isSent: true,
                                },
                                file: file
                            }
                        ]
                    }
                }

            }

            if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
        })

        return formattedChatLog
    }

    useEffect(() => {
        // scrollToBottom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, chat])

    // ** Renders user chat
    const renderChats = () => {
        return formattedChatData().map((item: FormattedChatsType, index: number, array: FormattedChatsType[]) => {
            const isSender = item.senderId === auth.user?.id;

            return (
                <ChatGroup
                    key={`chat-group-${index}`}
                    chat={chat}
                    index={index}
                    length={array.length}
                    item={item}
                    isSender={isSender}
                    idUser={auth.user?.id}
                />
            )
        })
    }

    const ScrollWrapper = ({ children }: { children: ReactNode }) => {
        if (hidden) {
            return (
                <Box sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    {children}
                </Box>
            )
            } else {
            return (
                <PerfectScrollbar ref={(ref: any) => { if(chatArea) chatArea.current = ref ;} } options={{ wheelPropagation: false }}>
                    {children}
                </PerfectScrollbar>
            )
        }
    }


    return (
        <Box sx={{ height: 'calc(100% - 8.4375rem)' }}>
            <ScrollWrapper >{renderChats()}</ScrollWrapper>
        </Box>
    )
}

export default ChatLog
