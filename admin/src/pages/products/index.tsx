import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Tabs, notification } from 'antd'
import { getProducts, softDeleteProduct } from '@/apis/product.api'
import { useEffect, useState } from 'react'

import DeleteModal from './components/modal/modal'
import MainProduct from './components/main-product'
import Navbar from '@/components/navbar'
import { TProduct } from '@/types/product.type'
import { TResponse } from '@/types/common.type'
import type { TabsProps } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { useNavigate } from 'react-router-dom'

const ProductPage = () => {
  const queryClient = new QueryClient()

  const { accessToken } = useAuth()

  const [products, setProducts] = useState<TProduct[]>([])
  const [id, setId] = useState<string>('')

  const [openModalDelete, setOpenModalDelete] = useState(false)

  const navigate = useNavigate()

  const [paginate, setPaginate] = useState({
    _page: 1,
    _limit: 10,
    totalPages: 1
  })
  const [query, setQuery] = useState<string>(`?_page=${paginate._page}&_limit=${paginate._limit}`)

  const [queryDelete, setQueryDelete] = useState<{ status: 'active' | 'inactive'; is_deleted: boolean }>({
    status: 'active',
    is_deleted: true
  })

  const deleteMutation = useMutation({
    mutationKey: ['deleteProduct'],
    mutationFn: () =>
      softDeleteProduct(id, `?status=${queryDelete.status}&is_deleted=${queryDelete.is_deleted}`, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', paginate] })
      notification.success({
        message: 'Xoá sản phẩm thành công',
        description: 'Sản phẩm đã được xoá vào thùng rác'
      })
    },
    onError: () => {
      notification.error({
        message: 'Xoá sản phẩm thất bại',
        description: 'Có lỗi xảy ra khi xoá sản phẩm'
      })
    }
  })

  const { data, isError, isLoading, isSuccess } = useQuery<TResponse<TProduct>, Error>({
    queryKey: ['products', query],
    queryFn: () => getProducts(accessToken, query),
    keepPreviousData: true
  })

  useEffect(() => {
    if (isSuccess) {
      setProducts(data.docs)
      setPaginate({
        _page: data.page,
        _limit: data.limit,
        totalPages: data.totalPages
      })
    }
  }, [isSuccess, data])

  const handleDeleteProduct = () => {
    deleteMutation.mutate()
  }

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả sản phẩm',
      children: (
        <MainProduct
          products={products}
          paginate={{
            _page: paginate._page,
            _limit: paginate._limit,
            totalDocs: data.totalDocs,
            onChange: (page) => {
              setPaginate({ ...paginate, _page: page, _limit: paginate._limit })
            }
          }}
          onDelete={(id: string) => {
            setId(id)
            setOpenModalDelete(true)
          }}
        />
      )
    },
    {
      key: '2',
      label: 'Sản phẩm đang hoạt động',
      children: (
        <MainProduct
          products={products}
          paginate={{
            _page: paginate._page,
            _limit: paginate._limit,
            totalDocs: data.totalDocs,
            onChange: (page) => {
              setPaginate({ ...paginate, _page: page, _limit: paginate._limit })
            }
          }}
          onDelete={(id: string) => {
            setId(id)
            setOpenModalDelete(true)
          }}
        />
      )
    },
    {
      key: '3',
      label: 'Sản phẩm không hoạt động',
      children: (
        <MainProduct
          products={products}
          paginate={{
            _page: paginate._page,
            _limit: paginate._limit,
            totalDocs: data.totalDocs,
            onChange: (page) => {
              setPaginate({ ...paginate, _page: page, _limit: paginate._limit })
            }
          }}
          onDelete={(id: string) => {
            setId(id)
            setOpenModalDelete(true)
          }}
        />
      )
    },
    {
      key: '4',
      label: 'Sản phẩm đã xoá',
      children: (
        <MainProduct
          products={products}
          paginate={{
            _page: paginate._page,
            _limit: paginate._limit,
            totalDocs: data.totalDocs,
            onChange: (page) => {
              setPaginate({ ...paginate, _page: page, _limit: paginate._limit })
            }
          }}
          onDelete={(id: string) => {
            setId(id)
            setOpenModalDelete(true)
          }}
        />
      )
    }
  ]

  const handleChangeTab = (key: string) => {
    // set key for url
    switch (key) {
      case '1': {
        navigate(`?_page=${paginate._page}&_limit=${paginate._limit}`)
        setQuery(`?_page=${paginate._page}&_limit=${paginate._limit}`)
        break
      }
      case '2': {
        navigate(`?status=active&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
        setQuery(`?status=active&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
        break
      }
      case '3': {
        navigate(`?status=inactive&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
        setQuery(`?status=inactive&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
        break
      }
      case '4': {
        navigate(`?deleted=true&_page=${paginate._page}&_limit=${paginate._limit}`)
        setQuery(`?deleted=true&_page=${paginate._page}&_limit=${paginate._limit}`)
        break
      }
    }
  }

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        button={{
          title: 'Thêm sản phẩm',
          size: 'large',
          type: 'primary'
        }}
        input={{
          placeholder: 'Search for product'
        }}
      />

      <div>
        <Tabs defaultActiveKey='1' items={items} onChange={handleChangeTab} />
      </div>

      <DeleteModal
        openModalDelete={openModalDelete}
        setOpenModalDelete={setOpenModalDelete}
        onDelete={handleDeleteProduct}
      />
    </div>
  )
}

export default ProductPage
