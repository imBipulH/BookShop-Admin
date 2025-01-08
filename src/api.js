import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/books`)
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
// Fetch all products
export const getAuthors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/author`)
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
// Fetch all products
export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`)
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
// Fetch all products
export const getPublishers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/publisher`)
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Create a new product
export const createProduct = async productData => {
  try {
    const response = await axios.post(`${BASE_URL}/books`, productData)
    return response.data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}
