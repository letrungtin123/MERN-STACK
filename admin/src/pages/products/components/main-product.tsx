import ColumnsTable from './table/columns-table'
import DeleteModal from './modal/modal'
import { DeleteOutlined } from '@ant-design/icons'
import { TProduct } from '@/types/product.type'
import { Table } from 'antd'
import { useState } from 'react'

interface MainProductProps {
  products: TProduct[]
  paginate: {
    _page: number
    _limit: number
    totalDocs: number
    onChange: (page: number) => void
  }
  onDelete: (selectedProducts: string) => void
}

const MainProduct = ({ products, paginate, onDelete }: MainProductProps) => {
  const { _limit, _page, totalDocs, onChange } = paginate

  const columns = ColumnsTable()

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [rowSelections, setRowSelections] = useState<string[] | string>([])

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: TProduct[]) => {
      setRowSelections(selectedRows.map((row) => row._id))
    }
  }

  return (
    <div className=''>
      <Table
        rowKey={(record) => record._id}
        dataSource={products}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={columns}
        pagination={{
          current: _page,
          pageSize: _limit,
          total: totalDocs,
          onChange: (page) => onChange(page),
          showTotal(total, range) {
            return (
              <div className='flex items-center justify-between w-full mr-auto text-black-second'>
                Showing {range[0]}-{range[1]} of {total}
              </div>
            )
          }
        }}
      />

      {rowSelections.length > 0 && (
        <div className='flex items-center justify-between'>
          <button className='flex items-center gap-2' onClick={() => setOpenModalDelete(true)}>
            <DeleteOutlined />
            Delete
          </button>

          <span className=''>{rowSelections.length} Selected</span>
        </div>
      )}

      <DeleteModal
        openModalDelete={openModalDelete}
        setOpenModalDelete={setOpenModalDelete}
        onDelete={() => {
          onDelete(rowSelections)
        }}
      />
    </div>
  )
}

export default MainProduct
