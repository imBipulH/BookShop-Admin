/* eslint-disable react/prop-types */
import { Button, Form, Input, message } from 'antd'

import TextArea from 'antd/es/input/TextArea'
import axiosInstance from '../utils/axiosinstance'

const AddPublisher = ({ type, handleOk }) => {
  const [form] = Form.useForm()
  //const [uploading, setUploading] = useState(false)

  const handleAddPublisher = async values => {
    try {
      const response = await axiosInstance.post('/publisher', values)
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
      onFinish={type == 'Edit' ? '' : handleAddPublisher}
    >
      <Form.Item label={`Publisher's Name`} name='name'>
        <Input />
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

export default AddPublisher
