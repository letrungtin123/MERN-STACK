import { TImage } from './common.type'

export type TProduct = {
  _id: string
  nameProduct: string
  price: number
  desc: string
  brand: TBrandRefProduct
  category: TCategroyRefProduct
  status: 'inactive' | 'active'
  sizes: TSize[]
  images: TImage[]
  is_deleted: boolean
  updatedAt: string
  sale: number
}

export type TBrandRefProduct = {
  _id: string
  nameBrand: string
  image: string
  desc: string
}
export type TCategroyRefProduct = {
  nameCategory: string
  _id: string
  nameBrand: string
  image: string
  desc: string
}

export type TSize = {
  size: string
  quantity: number
  color: string
  _id: string
}
