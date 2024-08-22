import { createContext, useContext, useEffect, useState } from 'react'

import { TProduct } from '@/types/product.type'

type TProductContext = {
  products: TProduct[]
  // handleCreateProduct: () => void
  handleDeleteProduct: (id: string) => void
  // handleUpdateProduct: (product: TProduct) => void
}

type TProductProvider = {
  children: React.ReactNode
  data: TProduct[]
}

const ProductContext = createContext<TProductContext>({
  products: [],
  // handleCreateProduct: () => {},
  handleDeleteProduct: (id: string) => {}
  // handleUpdateProduct: (product: TProduct) => {}
})

export const ProductProvider = ({ children, data }: TProductProvider) => {
  const [products, setProducts] = useState<TProduct[]>([])

  // handleDeleteProduct
  const handleDeleteProduct = (id: string) => {
    const newProducts = products.filter((product) => product.id !== id)
    setProducts(newProducts)
  }

  useEffect(() => {
    setProducts(data)
  }, [data])

  return <ProductContext.Provider value={{ products, handleDeleteProduct }}>{children}</ProductContext.Provider>
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}
