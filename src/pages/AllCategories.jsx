import {
  DeleteOutlined,
  ExclamationCircleFilled,
  SearchOutlined
} from '@ant-design/icons'
import { Button, Divider, Input, Modal, Space, Table } from 'antd'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { getCategories } from '../api'
import AddCategory from '../components/AddCategory'
import axiosInstance from '../utils/axiosinstance'
const { confirm } = Modal

const AllCategories = () => {
  const [searchText, setSearchText] = useState('')
  const [categories, setCategories] = useState([])
  const [searchedColumn, setSearchedColumn] = useState('')
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: 'Add',
    data: null
  })

  const handleOk = () => {
    setOpenAddEditModal({ isOpen: false, type: 'Edit', data: null })
    fetchCategories()
  }
  const handleCancel = () => {
    setOpenAddEditModal({ isOpen: false, type: 'Edit', data: null })
  }

  const fetchCategories = async () => {
    try {
      const categoriesRes = await getCategories()
      setCategories(categoriesRes.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDeleteCategory = async category => {
    await axiosInstance
      .delete(`/categories/${category}`)
      .then(() => {
        console.log('Book deleted successfully')
        fetchCategories()
      })
      .catch(error => {
        console.error('Error deleting book:', error)
      })
  }

  const showDeleteConfirm = (categoryId, container) => {
    confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleFilled />,
      content: 'This action can not be undone!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        handleDeleteCategory(categoryId)
      },
      onCancel () {
        console.log('Cancel')
      },
      getContainer: () => container
    })
  }

  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = clearFilters => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={e => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({
                closeDropdown: false
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange (open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  // Column headers start
  const columns = [
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <div className='flex'>
            <Button
              type='link'
              onClick={() =>
                setOpenAddEditModal({
                  type: 'Edit',
                  isOpen: true,
                  data: _
                })
              }
            >
              Edit
            </Button>
            <Button
              onClick={() => showDeleteConfirm(record._id)}
              className='text-red-500 hover:bg-red-200 px-2 '
              type='danger'
            >
              <DeleteOutlined />
            </Button>
          </div>
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Parent Category',
      dataIndex: ['parent', 'name'],
      key: 'parent._id',
      width: '20%',
      render: (text, record) => {
        return record.parent?.name || ''
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',

      key: 'description'
    }
  ]
  return (
    <>
      <div className='w-full flex items-center justify-between text-right mb-2'>
        <div className='flex min-w-44 border border-primary rounded-md'>
          <p className='bg-primary text-white px-2 py-1'>Total Categories:</p>
          <p className='px-5  py-1'>{categories?.length}</p>
        </div>
        <Button
          onClick={() =>
            setOpenAddEditModal({ type: 'Add', isOpen: true, data: null })
          }
          type='primary'
          className=''
        >
          Add New Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey={record => record._id}
        pagination={{ pageSize: 15 }}
        expandable={{
          expandIcon: () => null // Removes the expand icon
        }}
      />
      <Modal
        title={
          <p className='w-full text-3xl text-center sticky z-10 top-0'>
            {openAddEditModal.type === 'Add'
              ? 'Add New Category'
              : 'Edit Category Details'}
            <Divider />
          </p>
        }
        open={openAddEditModal.isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={null}
        centered
      >
        <AddCategory
          data={openAddEditModal.data}
          type={openAddEditModal.type}
          handleOk={handleOk}
        />
      </Modal>
    </>
  )
}

export default AllCategories
