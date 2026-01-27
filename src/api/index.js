import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use(config => {
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("hexToken="))
    ?.split("=")[1]
  if (token) {
    config.headers.Authorization = token
  } else {
    delete config.headers.Authorization
  }
  return config
})

export const checkSignin = async () => {
  const response = await api.post(`/api/user/check`)
  return response.data
}

export const signin = async formData => {
  const response = await api.post(`/admin/signin`, formData)
  const { token, expired } = response.data
  document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
  return response.data
}

export const signout = async () => {
  const response = await api.post(`/logout`)
  if (response.data.success) {
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }
  return response.data
}

export const getProducts = async page => {
  const response = await api.get(`/api/${API_PATH}/admin/products?page=${page}`)
  return response.data
}

export const addProduct = async productData => {
  const response = await api.post(`/api/${API_PATH}/admin/product`, {
    data: productData,
  })
  return response.data
}

export const deleteProduct = async id => {
  const response = await api.delete(`/api/${API_PATH}/admin/product/${id}`)
  return response.data
}

export const editProduct = async (id, productData) => {
  const response = await api.put(`/api/${API_PATH}/admin/product/${id}`, {
    data: productData,
  })
  return response.data
}
