import { CounterProvider } from '@/contexts/counter-context'
import { ProductProvider } from '@/contexts/product-context'
import { TProduct } from '@/types/product.type'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from './components/header'
import Sidebar from './components/sidebar'

const RootLayout = () => {
  const data: TProduct[] = [
    { id: '1', name: 'Product 1', price: 100 },
    { id: '2', name: 'Product 2', price: 200 },
    { id: '3', name: 'Product 3', price: 300 }
  ]

  return (
    <Layout className='!h-screen'>
      <Layout.Sider width='250px' className='!bg-white'>
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header className='!bg-white !px-8'>
          <Header />
        </Layout.Header>
        <Layout.Content>
          <CounterProvider>
            <ProductProvider data={data}>
              <Outlet />
            </ProductProvider>
          </CounterProvider>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default RootLayout
