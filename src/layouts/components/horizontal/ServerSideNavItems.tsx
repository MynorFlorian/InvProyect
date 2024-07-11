// ** React Imports
import { useEffect, useState } from 'react'

// ** Import All Icons
import * as Icons from 'mdi-material-ui'

// ** Type Import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<HorizontalNavItemsType>([])

  useEffect(() => {
  }, [])

  return menuItems
}

export default ServerSideNavItems
