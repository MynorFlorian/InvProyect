// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types
import { RootState } from 'src/store'
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'
import { formatDateToMonthShort } from 'src/@core/utils/format'

// ** Chat App Components Imports
import SidebarLeft from 'src/views/apps/chat/SidebarLeft'
import ChatContent from 'src/views/apps/chat/ChatContent'
import React from 'react'
import { ChatProvider } from 'src/context/ChatContext'

const AppChat = () => {
    // ** States
    const [userStatus, setUserStatus] = useState<StatusType>('online')
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
    const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
    const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

    // ** Hooks
    const theme = useTheme()
    const { settings } = useSettings()
    const hidden = useMediaQuery(theme.breakpoints.down('lg'))
    const store = useSelector((state: RootState) => state.chat)
    const auth = useAuth()

    // ** Vars
    const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
    const sidebarWidth = smAbove ? 370 : 300
    const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
    const { skin, appBar, footer, layout, navHidden } = settings
    const statusObj: StatusObjType = {
        busy: 'error',
        away: 'warning',
        online: 'success',
        offline: 'secondary'
    }

    const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
    const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
    const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)

    const calculateAppHeight = () => {
        return `(${
        (appBar === 'hidden' ? 0 : (theme.mixins.toolbar.minHeight as number)) *
            (layout === 'horizontal' && !navHidden ? 2 : 1) +
        (footer === 'hidden' ? 0 : 56)
        }px + ${theme.spacing(6)} * 2)`
    }

    // ** Ref
    const chatArea = useRef(null)

    function scrollBottom() {
        const curr = chatArea.current
        if (curr) {
            // @ts-ignore
            curr.scrollTop = Number.MAX_SAFE_INTEGER;
        }
    }

    return (
        <Box
            className='app-chat'
            sx={{
                width: '100%',
                display: 'flex',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'background.paper',
                boxShadow: skin === 'bordered' ? 0 : 6,
                height: `calc(100vh - ${calculateAppHeight()})`,
                ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
            }}
        >
            <ChatProvider>
                {/* Chats Bar */}
                <SidebarLeft
                    store={store}
                    hidden={hidden}
                    mdAbove={mdAbove}
                    statusObj={statusObj}
                    userStatus={userStatus}
                    selectChat={() => {}}
                    getInitials={getInitials}
                    sidebarWidth={sidebarWidth}
                    setUserStatus={setUserStatus}
                    leftSidebarOpen={leftSidebarOpen}
                    removeSelectedChat={() => {}}
                    userProfileLeftOpen={userProfileLeftOpen}
                    formatDateToMonthShort={formatDateToMonthShort}
                    handleLeftSidebarToggle={handleLeftSidebarToggle}
                    handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
                />

                {/* Chat content */}
                <ChatContent
                    store={store}
                    hidden={hidden}
                    sendMsg={() => {}}
                    mdAbove={mdAbove}
                    statusObj={statusObj}
                    getInitials={getInitials}
                    sidebarWidth={sidebarWidth}
                    userProfileRightOpen={userProfileRightOpen}
                    handleLeftSidebarToggle={handleLeftSidebarToggle}
                    handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
                />
            </ChatProvider>


        </Box>
    )
}

export default AppChat
