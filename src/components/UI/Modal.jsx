/* eslint-disable react/prop-types */
import { Modal, Divider } from 'antd'
import AddProducts from '../AddProducts'
import AddCategory from '../AddCategory'
import { useMemo } from 'react'
import AddAuthor from '../AddAuthor'
import AddPublisher from '../AddPublisher'

const CategoryModal = ({ onCancel, isOpen, type, data, handleOk }) => {
  // Define titles and components for each type
  const config = {
    AddBook: {
      title: 'Add New Book',
      component: <AddProducts type={type} data={data} handleOk={handleOk} />
    },
    EditBook: {
      title: 'Edit Book Details',
      component: <AddProducts type={type} data={data} handleOk={handleOk} />
    },
    AddCategory: {
      title: 'Add New Category',
      component: <AddCategory type={type} data={data} handleOk={handleOk} />
    },
    EditCategory: {
      title: 'Edit Category Details',
      component: <AddCategory type={type} data={data} handleOk={handleOk} />
    },
    AddAuthor: {
      title: 'Add New Author',
      component: <AddAuthor type={type} data={data} handleOk={handleOk} />
    },
    AddPublisher: {
      title: 'Add New Publisher',
      component: <AddPublisher type={type} data={data} handleOk={handleOk} />
    }
  }

  // Get title and component based on type
  const { title = 'Default Title', component = null } = useMemo(
    () => config[type] || {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, data]
  )

  return (
    <Modal
      title={
        <p className='w-full text-3xl text-center sticky z-10 top-0'>
          {title}
          <Divider />
        </p>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={onCancel}
      width={1000}
      footer={null}
      centered
    >
      {component}
    </Modal>
  )
}

export default CategoryModal
