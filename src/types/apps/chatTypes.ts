import { UserData } from './../../interfaces/objects/UserData';
// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type StatusType = 'busy' | 'away' | 'online' | 'offline'

export type StatusObjType = {
  busy: ThemeColor
  away: ThemeColor
  online: ThemeColor
  offline: ThemeColor
}

export type ProfileUserType = UserData;

export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}

export type ChatType = any;

export type ChatsObj = any;

export type ContactType = UserData;

export type ChatsArrType = any;

export type SelectedChatType = null | {
  chat: ChatsObj
  contact: UserData
}

export type ChatStoreType = {
  chats: ChatsArrType[] | null
  contacts: ContactType[] | null
  userProfile: ProfileUserType | null
  selectedChat: SelectedChatType
}

export type SendMsgParamsType = {
  chat?: ChatsObj
  message: string
  contact?: UserData
}

export type ChatContentType = {
    hidden: boolean
    mdAbove: boolean
    store: ChatStoreType
    sidebarWidth: number
    statusObj: StatusObjType
    userProfileRightOpen: boolean
    handleLeftSidebarToggle: () => void
    getInitials: (val: string) => string
    sendMsg: () => void
    handleUserProfileRightSidebarToggle: () => void,
}

export type ChatSidebarLeftType = {
    hidden: boolean
    mdAbove: boolean
    store: ChatStoreType
    sidebarWidth: number
    userStatus: StatusType
    leftSidebarOpen: boolean
    statusObj: StatusObjType
    userProfileLeftOpen: boolean
    removeSelectedChat: () => void
    selectChat: (id: number) => void
    handleLeftSidebarToggle: () => void
    getInitials: (val: string) => string
    setUserStatus: (status: StatusType) => void
    handleUserProfileLeftSidebarToggle: () => void
    formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void,
}

export type UserProfileLeftType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  userStatus: StatusType
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
}

export type UserProfileRightType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
}

export type SendMsgComponentType = {
    store: ChatStoreType
    sendMsg: () => void,
    chat: any,
}

export type ChatLogType = {
    hidden: boolean
    messages: any[],
    chat: any,
}

export type MessageType = any;

export type ChatLogChatType = {
    msg: string
    time: string | Date
    feedback: MsgFeedbackType,
    file?: string
}

export type FormattedChatsType = {
  senderId: number
  messages: ChatLogChatType[]
}

export type MessageGroupType = {
  senderId: number
  messages: ChatLogChatType[]
}
