// ** React Imports
import { useState, useEffect, ChangeEvent, ReactNode, useContext } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import { Theme } from '@mui/material/styles'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Magnify from 'mdi-material-ui/Magnify'

// ** Types
import { ContactType, ChatSidebarLeftType, ChatsArrType } from 'src/types/apps/chatTypes'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Chat App Components Imports
import UserProfileLeft from 'src/views/apps/chat/UserProfileLeft'
import { ChatContext } from 'src/context/ChatContext'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
    if (hidden) {
        return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
    } else {
        return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
}

const SidebarLeft = (props: ChatSidebarLeftType) => {
    // ** Props
    const {
        store,
        hidden,
        mdAbove,
        statusObj,
        userStatus,
        selectChat,
        getInitials,
        sidebarWidth,
        setUserStatus,
        leftSidebarOpen,
        removeSelectedChat,
        userProfileLeftOpen,
        formatDateToMonthShort,
        handleLeftSidebarToggle,
        handleUserProfileLeftSidebarToggle,
    } = props

    // ** States
    const [query, setQuery] = useState<string>('')
    const [filteredChat, setFilteredChat] = useState<ChatsArrType[]>([])
    const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([])
    const [active, setActive] = useState<null | { type: string; id: string | number }>(null)

    // * Chat Context
    const { chats, chat, handleOnSelectChat } = useContext(ChatContext);

    // ** Hooks
    const router = useRouter()

    const handleChatClick = (type: 'chat' | 'contact', id: number | undefined) => {
        if(id){
            setActive({ type, id })
            handleOnSelectChat(id)
            if (!mdAbove) {
                handleLeftSidebarToggle()
            }
        }
    }

    useEffect(() => {
    }, [])

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderChats = () => {
        if (!chats || (chats && chats.length == 0)) {
            return (
                <ListItem>
                    <Typography sx={{ color: 'text.secondary' }}>No hay chats disponibles</Typography>
                </ListItem>
            )
        } else {
            const arrToMap = chats;

            return arrToMap.map((chat: any, index: number) => {
                const firstMessage = chat.Mensajes && chat.Mensajes.length > 0 ? chat.Mensajes[0] : null;
                const lastMessage = chat.Mensajes && chat.Mensajes.length > 0 ? chat.Mensajes[chat.Mensajes.length - 1] : null;
                let files = lastMessage.files ? JSON.parse(lastMessage.files) : [];
                let file = files && files.length > 0 && files[0] && files[0].uri ? files[0].uri : null;
                const activeCondition = active !== null && active.id === chat.id && active.type === 'chat';
                const pedido = `Pedido #${chat.PedidoId}`;

                return (
                    <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
                    <ListItemButton
                        disableRipple
                        onClick={() => handleChatClick('chat', chat.id)}
                        sx={{
                        px: 3,
                        py: 2.5,
                        width: '100%',
                        borderRadius: 1,
                        alignItems: 'flex-start',
                        ...(activeCondition && {
                            backgroundImage: theme =>
                            `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
                        })
                        }}
                    >
                        {/* Avatar */}
                        <ListItemAvatar sx={{ m: 0 }}>
                            <Badge
                                overlap='circular'
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                                }}
                                badgeContent={
                                    <></>

                                }
                            >
                                {/* Active inner badgeContent */}
                                {/* <Box
                                        component='span'
                                        sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        boxShadow: (theme: Theme) =>
                                            `0 0 0 2px ${
                                            !activeCondition ? theme.palette.background.paper : theme.palette.common.white
                                            }`
                                        }}
                                    /> */}
                                <CustomAvatar
                                    skin={activeCondition ? 'light-static' : 'light'}
                                    sx={{
                                    width: 38,
                                    height: 38,
                                    fontSize: '1rem',
                                    border: (theme: Theme) => (activeCondition ? `2px solid ${theme.palette.common.white}` : '')
                                    }}
                                >
                                    {firstMessage && firstMessage.Escritor ? getInitials(firstMessage.Escritor.nombre) : ''}
                                </CustomAvatar>
                            </Badge>
                        </ListItemAvatar>

                        {/* Last message info */}
                        <ListItemText
                            sx={{
                                my: 0,
                                ml: 4,
                                mr: 1.5,
                                '& .MuiTypography-root': { ...(activeCondition ? { color: 'common.white' } : {}) }
                            }}
                            primary={
                                <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                    {firstMessage && firstMessage.Escritor ? firstMessage.Escritor.nombre : ''}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                noWrap
                                variant='body2'
                                sx={{ color: !activeCondition ? (theme: Theme) => theme.palette.text.disabled : {} }}
                                >
                                    {/* Last message */}
                                    {lastMessage ? lastMessage.text : null}

                                    {/* Last atachment file */}
                                    {file ? 'Archivo adjunto' : null}
                                </Typography>
                            }
                        />

                        {/* Date last message */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                flexDirection: 'column',
                                justifyContent: 'flex-start'
                            }}
                            >
                            <Typography
                                variant='body2'
                                sx={{ whiteSpace: 'nowrap', color: activeCondition ? 'common.white' : 'text.disabled' }}
                            >
                                {lastMessage && lastMessage.fechaCreacion? String(formatDateToMonthShort(lastMessage.fechaCreacion as string, true)) : new Date()}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ whiteSpace: 'nowrap', color: activeCondition ? 'common.white' : '#919191', fontStyle: 'italic'}}
                            >
                                {pedido}
                            </Typography>
                        </Box>
                    </ListItemButton>
                    </ListItem>
                )
            })
        }
    }

    return (
        <Box>
            <Drawer
                open={leftSidebarOpen}
                onClose={handleLeftSidebarToggle}
                variant={mdAbove ? 'permanent' : 'temporary'}
                ModalProps={{
                disablePortal: true,
                keepMounted: true // Better open performance on mobile.
                }}
                sx={{
                    zIndex: 7,
                    height: '100%',
                    display: 'block',
                    position: mdAbove ? 'static' : 'absolute',
                    '& .MuiDrawer-paper': {
                        boxShadow: 'none',
                        width: sidebarWidth,
                        position: mdAbove ? 'static' : 'absolute',
                        borderTopLeftRadius: (theme: Theme) => theme.shape.borderRadius,
                        borderBottomLeftRadius: (theme: Theme) => theme.shape.borderRadius
                    },
                    '& > .MuiBackdrop-root': {
                        borderRadius: 1,
                        position: 'absolute',
                        zIndex: (theme: Theme) => theme.zIndex.drawer - 1
                    }
                }}
            >
                <Box
                    sx={{
                        py: 3,
                        px: 5,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`
                    }}
                >
                {store && store.userProfile ? (
                    <Badge
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        sx={{ mr: 4 }}
                        onClick={handleUserProfileLeftSidebarToggle}
                        badgeContent={
                            <Box
                            component='span'
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                color: `${statusObj[userStatus]}.main`,
                                backgroundColor: `${statusObj[userStatus]}.main`,
                                boxShadow: (theme: Theme) => `0 0 0 2px ${theme.palette.background.paper}`
                            }}
                            />
                        }
                    >
                    <MuiAvatar
                        src={store.userProfile.imagenUsuario}
                        alt={store.userProfile.nombre}
                        sx={{ width: '2.375rem', height: '2.375rem', cursor: 'pointer' }}
                    />
                    </Badge>
                ) : null}
                {!mdAbove ? (
                    <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
                    <Close sx={{ fontSize: '1.375rem' }} />
                    </IconButton>
                ) : null}
                </Box>

                {/* Chats */}
                <Box sx={{ height: `calc(100% - 4.0625rem)` }}>
                <ScrollWrapper hidden={hidden}>
                    <Box sx={{ p: (theme: Theme) => theme.spacing(7, 3, 3) }}>
                        <Typography variant='h6' sx={{ ml: 3, mb: 3, color: 'primary.main' }}>
                            Chats
                        </Typography>
                        <List sx={{ mb: 4, padding: 0 }}>{renderChats()}</List>
                    </Box>
                </ScrollWrapper>
                </Box>
            </Drawer>

            <UserProfileLeft
                store={store}
                hidden={hidden}
                statusObj={statusObj}
                userStatus={userStatus}
                sidebarWidth={sidebarWidth}
                setUserStatus={setUserStatus}
                userProfileLeftOpen={userProfileLeftOpen}
                handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
        </Box>
    )
}

export default SidebarLeft
