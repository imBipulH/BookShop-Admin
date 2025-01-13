/* eslint-disable react/prop-types */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, message, Select, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { getAuthors, getCategories, getPublishers } from '../api'
import axiosInstance from '../utils/axiosinstance'
import CategoryModal from './UI/Modal'

// const BASE_URL = import.meta.env.VITE_BASE_URL
const { TextArea } = Input

const AddProducts = ({ data, type, handleOk }) => {
  const [fileList, setFileList] = useState([])
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [publishers, setPublishers] = useState([])
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: 'Add',
    data: null
  })

  const handleValuesChange = (_, allValues) => {
    const { price, discountPercentage } = allValues
    if (price && discountPercentage) {
      const discountPrice = price - (price * discountPercentage) / 100
      form.setFieldsValue({ discountPrice })
    } else {
      form.setFieldsValue({ discountPrice: null }) // Clear discountPrice if inputs are incomplete
    }
  }

  const handleCancel = () => {
    setOpenAddEditModal({ isOpen: false, type: '', data: null })
  }
  const fetchData = async () => {
    try {
      const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
        getAuthors(),
        getCategories(),
        getPublishers()
      ])
      setAuthors(authorsRes.data)
      setCategories(categoriesRes.data)
      setPublishers(publishersRes.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data && type == 'EditBook') {
      form.setFieldsValue({
        title: data ? data.title : '',
        author: data ? data.author._id : '',
        publisher: data ? data.publisher._id : '',
        category: data
          ? data.category.map(c => {
              return c._id
            })
          : [],
        isbn: data ? data.isbn : '',
        itemId: data ? data.itemId : 0,
        price: data ? data.price : 0,
        discountPercentage: data.discountPercentage || 0,
        discountPrice: data.discountPrice || 0,
        stock: data ? data.stock : 0,
        language: data ? data.language : '',
        country: data ? data.country : '',
        summery: data ? data.summery : '',
        coverImage: data.coverImage || '',
        pdf: data.pdf || ''
      })
      // Update fileList for image preview
      setFileList(
        data.coverImage
          ? [
              {
                uid: '-1', // Unique ID for the file
                name: 'coverImage', // Display name
                status: 'done', // Indicate successful upload
                url: data.coverImage // Image URL
              }
            ]
          : []
      )
    } else {
      form.resetFields()
    }
  }, [data, form, type])

  const handleSubmit = async values => {
    try {
      // Ensure categories are converted to a string (if required)
      const productData = {
        ...values,
        category: values.category, //values.category.join(',')  Convert array to string
        coverImage: values.coverImage //values.coverImage.
      }
      console.log(values)

      // Make API call to your backend
      const response = await axiosInstance.post(`/books/create`, productData)
      if (response.data.success) {
        message.success('Product added successfully!')
        form.resetFields()
        handleOk()
      } else {
        if (response.data.error) {
          message.error(response.data.error)
        } else {
          message.error('An error occurred while adding the product.')
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('An error occurred while adding the product.')
      }
      console.error(error)
    }
  }

  // Handle Edit Book Start
  const handleEditBook = async () => {
    try {
      const bookId = data && data._id
      const response = await axiosInstance.put(`/books/${bookId}`, {
        ...form.getFieldsValue()
      })
      if (response.data.success) {
        message.success('Product added successfully!')
        form.resetFields()
        handleOk()
      } else {
        if (response.data.error) {
          message.error(response.data.error)
        } else {
          message.error('An error occurred while adding the product.')
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('An error occurred while adding the product.')
      }
      console.error(error)
    }
  }

  // Handle Upload Code
  const handleUpload = async (options, type) => {
    const { file, onSuccess, onError } = options

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)
      const response = await axiosInstance.post('/uploads/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response)

      setUploading(false)
      onSuccess(response.data.filUrl)
      if (type == 'pdf') {
        form.setFieldsValue({ pdf: response.data.fileUrl })
      } else {
        form.setFieldsValue({ coverImage: response.data.fileUrl })
      }
      message.success('File uploaded successfully!')
      console.log(response.data.fileUrl)
    } catch (error) {
      setUploading(false)
      onError(error)
      message.error('File upload failed.')
    }
  }

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout='horizontal'
        style={{ maxWidth: 1000 }}
        onValuesChange={handleValuesChange}
        onFinish={type == 'EditBook' ? handleEditBook : handleSubmit}
      >
        <Form.Item label='Title' name='title' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <div className=' relative'>
          <Form.Item
            label='Author'
            name='author'
            className='flex-1'
            rules={[{ required: true }]}
          >
            <Select showSearch placeholder='Select' style={{ width: '70%' }}>
              {authors?.map(author => (
                <Select.Option key={author._id} value={author._id}>
                  {author.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            onClick={() =>
              setOpenAddEditModal({
                isOpen: true,
                type: 'AddAuthor',
                data: null
              })
            }
            type='primary'
            className='w-fit ml-auto absolute top-0 right-0'
          >
            Add New Author
          </Button>
        </div>
        <div className='relative'>
          <Form.Item
            label='Publisher'
            name='publisher'
            rules={[{ required: true }]}
          >
            <Select showSearch placeholder='Select' style={{ width: '70%' }}>
              {publishers?.map(publisher => (
                <Select.Option key={publisher._id} value={publisher._id}>
                  {publisher.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            onClick={() =>
              setOpenAddEditModal({
                isOpen: true,
                type: 'AddPublisher',
                data: null
              })
            }
            type='primary'
            className='absolute top-0 right-0'
          >
            Add New Publisher
          </Button>
        </div>
        <div className='relative'>
          <Form.Item
            label='Category'
            name='category'
            rules={[{ required: true }]}
          >
            <Select
              mode='multiple'
              showSearch
              placeholder='Select'
              style={{ width: '70%' }}
            >
              {categories?.map(category => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            onClick={() =>
              setOpenAddEditModal({
                isOpen: true,
                type: 'AddCategory',
                data: null
              })
            }
            type='primary'
            className='absolute top-0 right-0'
          >
            Add New Category
          </Button>
        </div>

        <Form.Item label='ISBN' name='isbn'>
          <Input />
        </Form.Item>

        <Form.Item label='Price' name='price'>
          <InputNumber />
        </Form.Item>
        <Form.Item label='Discount Percentage' name='discountPercentage'>
          <InputNumber />
        </Form.Item>
        <Form.Item label='Discount Price' name='discountPrice'>
          <InputNumber disabled />
        </Form.Item>

        <Form.Item label='Stock' name='stock'>
          <InputNumber />
        </Form.Item>
        <Form.Item label='Item ID' name='itemId'>
          <Input />
        </Form.Item>

        <Form.Item label='Language' name='language'>
          <Input />
        </Form.Item>

        <Form.Item label='Country' name='country'>
          <Select>
            <Select.Option value='Bangladesh'>Bangladesh</Select.Option>
            <Select.Option value='India'>India</Select.Option>
            <Select.Option value='United States'>United States</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label='Book Summery' name='summery'>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label='Product Image' name='coverImage'>
          <Upload
            customRequest={options => handleUpload(options, 'image')}
            listType='picture-card'
            className='ml-1'
            maxCount={1}
            showUploadList={{
              showRemoveIcon: true, // Allow removing uploaded image
              showPreviewIcon: false
            }}
            fileList={fileList}
            onChange={info => {
              const { status, response } = info.file
              if (status === 'done') {
                const uploadedUrl = response?.filePath // Extract URL
                form.setFieldsValue({ coverImage: uploadedUrl }) // Set form value
                message.success('Image uploaded successfully!')
              } else if (status === 'error') {
                message.error('Image upload failed.')
              }
            }}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Image</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label='PDF' name='pdf'>
          <Upload
            // action='/upload.do'
            customRequest={options => handleUpload(options, 'pdf')}
            listType='text'
            className='ml-1'
            maxCount={1}
            showUploadList={{
              showRemoveIcon: true, // Allow removing uploaded image
              showPreviewIcon: false
            }}
            fileList={
              form.getFieldValue('pdf')
                ? [
                    {
                      uid: '-2', // Unique ID for the file
                      name: 'Existing PDF',
                      status: 'done', // Indicate successful upload
                      url: form.getFieldValue('pdf') // Preloaded URL
                    }
                  ]
                : []
            }
            onChange={info => {
              const { status, response } = info.file
              if (status === 'done') {
                const uploadedUrl = response?.filePath // Extract URL
                form.setFieldsValue({ coverImage: uploadedUrl }) // Set form value
                message.success('PDF uploaded successfully!')
              } else if (status === 'error') {
                message.error('PDF upload failed.')
              }
            }}
            accept='application/pdf'
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload PDF</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item className='flex justify-center'>
          <Button
            htmlType='submit'
            loading={uploading}
            type='primary'
            className='px-6 py-5 text-xl font-semibold'
          >
            Save
          </Button>
        </Form.Item>
      </Form>
      <CategoryModal
        isOpen={openAddEditModal.isOpen}
        type={openAddEditModal.type}
        handleOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  )
}

export default AddProducts
