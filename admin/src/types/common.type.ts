// generic type
export type TResponse<T> = {
  message: string
  success: boolean
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: number | boolean
  hasNextPage: number | boolean
  prevPage: number | null
  nextPage: number | null
}

export type TImage = {
  url: string
  public_id: string
  _id: string
}

export type TBaseResponseDelete = {
  message: string
  success: boolean
}
