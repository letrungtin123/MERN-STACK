import React from 'react'
import { Modal, Button } from 'antd'

interface DeleteModalProps {
  openModalDelete: boolean
  setOpenModalDelete: (open: boolean) => void
  onDelete: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({ openModalDelete, setOpenModalDelete, onDelete }) => {
  return (
    <Modal
      open={openModalDelete}
      title={<p className='w-full text-2xl font-semibold text-center'>Xoá sản phẩm</p>}
      onOk={() => {
        setOpenModalDelete(false)
      }}
      closable={false}
      onCancel={() => setOpenModalDelete(false)}
      footer={
        <div className='flex items-center justify-center gap-10 mt-10'>
          <Button danger size='large' className='w-full max-w-[140px]' onClick={() => setOpenModalDelete(false)}>
            Huỷ
          </Button>
          <Button
            type='primary'
            size='large'
            className='w-full max-w-[140px]'
            onClick={() => {
              onDelete()
              setOpenModalDelete(false)
            }}
          >
            Xoá sản phẩm
          </Button>
        </div>
      }
    >
      <p className='text-center text-gray-500'>
        Bạn có chắc chắn muốn xoá sản phẩm này không? Hành động này không thể hoàn tác?
      </p>
    </Modal>
  )
}

export default DeleteModal
