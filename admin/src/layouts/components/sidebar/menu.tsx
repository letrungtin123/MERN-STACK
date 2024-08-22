import { DashboardIcon } from '@/components/icons'
import { AppstoreOutlined } from '@ant-design/icons'

export const menus = [
  {
    id: 1,
    title: 'Dashboard',
    icon: <DashboardIcon className='fill-inherit' />,
    link: '/'
  },
  {
    id: 2,
    title: 'Các đơn hàng',
    icon: <AppstoreOutlined />,
    link: '/orders'
  },
  {
    id: 3,
    title: 'Sản phẩm',
    icon: <AppstoreOutlined />,
    link: '/products'
  }
]
