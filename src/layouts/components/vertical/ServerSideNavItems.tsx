// ** React Imports
import { useEffect, useState } from 'react'

// ** Import All Icons
import * as Icons from 'mdi-material-ui'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
  }, [])

  return menuItems
}

export default ServerSideNavItems
