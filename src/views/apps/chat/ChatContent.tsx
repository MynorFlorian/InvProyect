// ** React Imports
import { useState, SyntheticEvent, Fragment, useContext } from 'react'

// ** MUI Imports
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import MenuIcon from 'mdi-material-ui/Menu'
import Magnify from 'mdi-material-ui/Magnify'
import PhoneOutline from 'mdi-material-ui/PhoneOutline'
import VideoOutline from 'mdi-material-ui/VideoOutline'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import MessageOutline from 'mdi-material-ui/MessageOutline'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/apps/chat/SendMsgForm'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserProfileRight from 'src/views/apps/chat/UserProfileRight'

// ** Types
import { ChatContentType } from 'src/types/apps/chatTypes'
import { ChatContext } from 'src/context/ChatContext'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const ChatWrapperStartChat = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  borderRadius: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover
}))

const ChatContent = (props: ChatContentType) => {
    // ** Props
    const {
        store,
        hidden,
        sendMsg,
        mdAbove,
        statusObj,
        getInitials,
        sidebarWidth,
        userProfileRightOpen,
        handleLeftSidebarToggle,
        handleUserProfileRightSidebarToggle,
    } = props

    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)


    const auth = useAuth();
    const { chats, chat, mensajes, handleOnSelectChat } = useContext(ChatContext);

    const open = Boolean(anchorEl)

    const handleClick = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget as HTMLElement)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleStartConversation = () => {
        if (!mdAbove) {
        handleLeftSidebarToggle()
        }
    }

    const renderContent = () => {
        if (!mensajes || mensajes.length == 0 || !chat) {
            return (
                <ChatWrapperStartChat
                    sx={{
                    ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
                    }}
                >
                    <MuiAvatar
                    sx={{
                        mb: 6,
                        pt: 8,
                        pb: 7,
                        px: 7.5,
                        width: 110,
                        height: 110,
                        backgroundColor: 'background.paper',
                        boxShadow: theme => theme.shadows[3]
                    }}
                    >
                    <MessageOutline sx={{ fontSize: '3.125rem' }} />
                    </MuiAvatar>
                    <Box
                    onClick={handleStartConversation}
                    sx={{
                        py: 2,
                        px: 6,
                        borderRadius: 5,
                        backgroundColor: 'background.paper',
                        boxShadow: theme => theme.shadows[3],
                        cursor: mdAbove ? 'default' : 'pointer'
                    }}
                    >
                    <Typography sx={{ fontWeight: 500, fontSize: '1.125rem', lineHeight: 'normal' }}>
                        Selecciona un chat
                    </Typography>
                    </Box>
                </ChatWrapperStartChat>
            )
        } else if(chat.Escritor) {
            const chatFormated: any = chat;
            const usuario = chatFormated.Mensajes.find((msg: any) => msg.Escritor.id !== auth.user?.id)?.Escritor || {};

            return (
                <Box
                    sx={{
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme => theme.palette.action.hover
                    }}
                >
                    <Box
                    sx={{
                        py: 3,
                        px: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                    >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {mdAbove ? null : (
                        <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        )}
                        <Box
                        onClick={handleUserProfileRightSidebarToggle}
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        >
                        <Badge
                            overlap='circular'
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                            }}
                            sx={{ mr: 3 }}
                            badgeContent={
                            <Box
                                component='span'
                                sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                                }}
                            />
                            }
                        >
                            {(
                                <CustomAvatar
                                    skin='light'
                                    sx={{ width: '2.375rem', height: '2.375rem', fontSize: '1rem' }}
                                >
                                    {getInitials(usuario.nombre)}
                                </CustomAvatar>
                            )}
                        </Badge>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                {usuario.nombre}
                            </Typography>
                        </Box>
                        </Box>
                    </Box>

                    {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {mdAbove ? (
                        <Fragment>
                            <IconButton size='small' sx={{ color: 'text.secondary' }}>
                            <PhoneOutline sx={{ fontSize: '1.25rem' }} />
                            </IconButton>
                            <IconButton size='small' sx={{ color: 'text.secondary' }}>
                            <VideoOutline sx={{ fontSize: '1.5rem' }} />
                            </IconButton>
                            <IconButton size='small' sx={{ color: 'text.secondary' }}>
                            <Magnify sx={{ fontSize: '1.25rem' }} />
                            </IconButton>
                        </Fragment>
                        ) : null}
                        <IconButton size='small' onClick={handleClick} sx={{ color: 'text.secondary' }}>
                        <DotsVertical sx={{ fontSize: '1.25rem' }} />
                        </IconButton>
                        <Menu
                        open={open}
                        sx={{ mt: 2 }}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        >
                        <MenuItem onClick={handleClose}>Ver contacto</MenuItem>
                        <MenuItem onClick={handleClose}>Mute Notifications</MenuItem>
                        <MenuItem onClick={handleClose}>Block Contact</MenuItem>
                        <MenuItem onClick={handleClose}>Clear Chat</MenuItem>
                        <MenuItem onClick={handleClose}>Report</MenuItem>
                        </Menu>
                    </Box> */}
                    </Box>

                    {chat && mensajes ? (
                        <ChatLog
                            hidden={hidden}
                            chat={chat}
                            messages={mensajes}
                        />
                    ) : null}

                    {
                        chat ?
                        <SendMsgForm store={store} chat={chat} sendMsg={sendMsg} />
                        : null
                    }

                    <UserProfileRight
                        store={store}
                        hidden={hidden}
                        statusObj={statusObj}
                        getInitials={getInitials}
                        sidebarWidth={sidebarWidth}
                        userProfileRightOpen={userProfileRightOpen}
                        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
                    />
                </Box>
            )
        }

        return <></>
    }

    return renderContent()
}

export default ChatContent
