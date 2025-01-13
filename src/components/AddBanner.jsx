import { Button, Form, message, Upload } from 'antd'
import axiosInstance from '../utils/axiosinstance'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'

const AddBanner = () => {
  const [form] = Form.useForm()
  const [bannerUrl, setBannerUrl] = useState('')

  const [uploading, setUploading] = useState(false)

  // Handle Upload Code
  const handleUpload = async (options, type) => {
    const { file, onSuccess, onError } = options

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)
      const response = await axiosInstance.post('/uploads/banners', formData, {
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
      setBannerUrl(response.data.fileUrl)
      console.log(response.data.fileUrl)
    } catch (error) {
      setUploading(false)
      onError(error)
      message.error('File upload failed.')
    }
  }

  // Handle Form Submit Code
  const onFinish = async bannerUrl => {
    console.log(bannerUrl)
    try {
      const response = await axiosInstance.post('banner/upload', {
        url: bannerUrl
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {' '}
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
          //   fileList={fileList}
          onChange={info => {
            const { status, response } = info.file
            if (status === 'done') {
              const uploadedUrl = response?.filePath // Extract URL
              form.setFieldsValue({ url: uploadedUrl }) // Set form value
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
      <Button loading={uploading} onClick={() => onFinish(bannerUrl)}>
        Add Image
      </Button>
    </div>
  )
}

export default AddBanner
