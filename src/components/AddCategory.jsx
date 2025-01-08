/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Select } from 'antd'

import { useEffect, useState } from 'react'
import { getCategories } from '../api'

import TextArea from 'antd/es/input/TextArea'
import axiosInstance from '../utils/axiosinstance'

const AddCategory = ({ data, type, handleOk }) => {
  const [categories, setCategories] = useState([])
 

  const [form] = Form.useForm()
  //const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (data && type == 'Edit') {
      form.setFieldsValue({
        name: data?.name || '',
        parent: data?.parent?._id || '',
        description: data?.description || ''
      })
    } else {
      form.resetFields()
    }
  }, [data, form, type])

  const fetchData = async () => {
    try {
      const categoriesRes = await getCategories()
      setCategories(categoriesRes.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleEditCategories = async () => {
    try {
      const categoryId = data && data._id
      const response = await axiosInstance.put(`/categories/${categoryId}`, {
        ...form.getFieldsValue()
      })
      if (response.data.error) {
        message.error(response.data.error)
      } else {
        message.success('Category updated successfully.')
        form.resetFields()
      }
      handleOk()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('An error occurred while updating the category.')
      }
      console.error(error)
    }
  }

  const handleAddCategory = async values => {
    try {
      const response = await axiosInstance.post('/categories', values)
      if (response.data.error) {
        message.error(response.data.error)
      } else {
        message.success('Category added successfully.')
        form.resetFields()
      }
      handleOk()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('An error occurred while adding the category.')
      }
      console.error(error)
    }
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      layout='horizontal'
      style={{ maxWidth: 1000 }}
      //onFinish={handleAddCategory}
      onFinish={type == 'Edit' ? handleEditCategories : handleAddCategory}
    >
      <Form.Item label='Category Name' name='name'>
        <Input />
      </Form.Item>

      <Form.Item label='Parent Category' name='parent'>
        <Select
          //   mode='multiple'
          showSearch
          placeholder='Select'
          style={{ width: '80%' }}
        >
          {categories?.map(category => (
            <Select.Option key={category._id} value={category._id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label='Description' name='description'>
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item className='flex justify-center'>
        <Button
          htmlType='submit'
          //   loading={uploading}
          type='primary'
          className='px-6 py-5 text-xl font-semibold'
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddCategory
