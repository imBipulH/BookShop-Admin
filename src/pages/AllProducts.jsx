import { useEffect, useRef, useState } from 'react'
import { Table, Input, Select, Space, Button, Modal } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined
} from '@ant-design/icons'
import moment from 'moment'
import CategoryModal from '../components/UI/Modal'
const { confirm } = Modal

const { Search } = Input
const { Option } = Select

const BooksTable = () => {
  const containerRef = useRef(null)
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchField, setSearchField] = useState('name')
  const [searchCategory, setSearchCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: 'AddBook',
    data: null
  })

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/books`, {
        params: { limit: 100000 }
      })
      setBooks(response.data.data)
      setFilteredBooks(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching books:', error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchBooks()
  }, [])

  const handleOk = () => {
    setOpenAddEditModal({ isOpen: false, type: '', data: null })
    fetchBooks()
  }
  const handleCancel = () => {
    setOpenAddEditModal({ isOpen: false, type: '', data: null })
  }

  const handleDeleteBook = bookId => {
    axios
      .delete(`${BASE_URL}/books/${bookId}`)
      .then(() => {
        console.log('Book deleted successfully')
        fetchBooks()
      })
      .catch(error => {
        console.error('Error deleting book:', error)
      })
  }

  const showDeleteConfirm = (bookId, container) => {
    confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleFilled />,
      content: 'This action can not be undone!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        handleDeleteBook(bookId)
      },
      onCancel () {
        console.log('Cancel')
      },
      getContainer: () => container
    })
  }
  const columns = [
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'left',
      render: (_, record) => {
        return (
          <div className='flex'>
            <Button
              type='link'
              onClick={() =>
                setOpenAddEditModal({
                  type: 'EditBook',
                  isOpen: true,
                  data: _
                })
              }
            >
              Edit
            </Button>
            <div ref={containerRef}>
              <Button
                onClick={() =>
                  showDeleteConfirm(record._id, containerRef.current)
                }
                className='text-red-500 hover:bg-red-200 px-2 '
                type='danger'
              >
                <DeleteOutlined />
              </Button>
            </div>
          </div>
        )
      }
    },
    { title: 'Item ID', dataIndex: 'itemId', key: 'itemId' },
    {
      title: 'Title',
      dataIndex: 'title',

      key: 'title',
      filterMode: 'tree',
      filterSearch: true,
      sorter: (a, b) => a.age - b.age,
      onFilter: (value, record) => record.address.startsWith(value),
      render: title => (title ? title : 'No name available')
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: author => (author ? author.name : 'Noe author available')
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: category => {
        if (!category || category.length === 0) {
          return 'No Category Available'
        }

        return category.map((cat, index) => (
          <span key={cat._id}>
            {index > 0 && ', '} {cat.name}
          </span>
        ))
      }
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      render: publisher =>
        publisher ? publisher.name : 'No Publisher Available'
    },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: stock => stock || 'Not set'
    },
    {
      title: 'Selling Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `BDT ${price.toFixed(2)}`
    },
    {
      title: 'Last Modified',
      dataIndex: 'updatedAt',
      key: 'lastModified',
      render: lastModified => moment(lastModified).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Cover Image',
      dataIndex: 'coverImage',
      key: 'coverImage',
      render: coverImage => {
        if (!coverImage) return 'No Image Available'
        return (
          <img
            style={{ maxHeight: '80px' }}
            src={coverImage}
            alt='Cover Image'
          />
        )
      }
    }
  ]

  // Handle global search
  const onSearch = value => {
    const filtered = books.filter(book => {
      if (searchCategory !== 'All' && book.category !== searchCategory) {
        return false
      }
      return book[searchField]?.toLowerCase().includes(value.toLowerCase())
    })
    setFilteredBooks(filtered)
  }

  // Handle category filter
  const onCategoryChange = value => {
    setSearchCategory(value)
    const filtered = books.filter(book => {
      if (value === 'All') return true
      return book.category === value
    })
    setFilteredBooks(filtered)
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder={`Search by ${searchField}`}
          onSearch={onSearch}
          enterButton
          style={{ width: 300 }}
        />
        <Select
          defaultValue='All'
          style={{ width: 200 }}
          onChange={onCategoryChange}
        >
          <Option value='All'>All</Option>
          {/* Add dynamic categories if needed */}
          <Option value='Accessories'>Accessories</Option>
          <Option value='Books'>Books</Option>
          <Option value='Tools'>Tools</Option>
        </Select>
        <Select
          defaultValue='name'
          style={{ width: 200 }}
          onChange={value => setSearchField(value)}
        >
          <Option value='name'>Name</Option>
          <Option value='author'>Author</Option>
          <Option value='category'>Category</Option>
          <Option value='publisher'>Publisher</Option>
          <Option value='isbn'>ISBN</Option>
        </Select>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() =>
            setOpenAddEditModal({ isOpen: true, type: 'AddBook', data: null })
          }
        >
          New Item
        </Button>
      </Space>
      <div className='border-primary rounded-[4px] flex w-fit gap-2 mb-2 border'>
        <p className='bg-primary py-1 px-2 text-white'>Total Books</p>
        <p className='pr-4 pl-2 text-center py-1 w-14'>{books.length}</p>
      </div>
      <Table
        columns={columns}
        dataSource={filteredBooks}
        rowKey={record => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <CategoryModal
        handleOk={handleOk}
        onCancel={handleCancel}
        isOpen={openAddEditModal.isOpen}
        type={openAddEditModal.type}
        data={openAddEditModal.data}
      />
    </div>
  )
}

export default BooksTable
