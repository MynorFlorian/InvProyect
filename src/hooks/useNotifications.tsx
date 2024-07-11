import { useContext } from 'react'
import { NotificationsContext } from 'src/context/NotificationsContext'

export const useNotifications = () => useContext(NotificationsContext)
