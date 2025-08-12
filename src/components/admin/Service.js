// src/components/admins/Service.js
import axiosInstance from '../../config/axiosConfig'
import { toast } from 'react-toastify'

const handleSuccess = (message) => Success(message)
const handleError = (e) => {
  Error(e?.message || e?.data.message || 'Xatolik yuz berdi')
  console.error(e)
  throw e
}

export const fetchContent = async (contentId) => {
  try {
    const { data } = await axiosInstance.get(`content/${contentId}`)
    return data
  } catch (e) {
    if (e.response?.status === 404) {
      const newContent = await axiosInstance.post('content', {
        title: '',
        description: '',
      })
      return newContent.data
    }
    handleError(e)
  }
}
export const fetchData = async (url, setter) => {
  try {
    const { data } = await axiosInstance.get(url)
    if (setter) setter(data)
    return data
  } catch (e) {
    handleError(e)
  }
}

export const saveCategory = async (isEditing, category) => {
  try {
    const method = isEditing ? 'put' : 'post'
    const url = isEditing ? `category/${category._id}` : 'category'

    const res = await axiosInstance[method](url, category)
    handleSuccess(
      isEditing
        ? 'Kategoriya muvaffaqiyatli yangilandi'
        : 'Kategoriya muvaffaqiyatli yaratildi'
    )
    return res?.data
  } catch (e) {
    handleError(e)
  }
}

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`category/${id}`)
    handleSuccess("Kategoriya muvaffaqiyatli o'chirildi")
    return response.data
  } catch (e) {
    handleError(e)
  }
}

export const fetchChildren = async (categoryId) => {
  try {
    const { data } = await axiosInstance.get(`child/${categoryId}`)
    return data
  } catch (e) {
    handleError(e)
  }
}

export const saveChild = async (isEditing, childData, categoryId) => {
  try {
    const method = isEditing ? 'put' : 'post'
    const url = isEditing ? `child/${childData._id}` : `child/${categoryId}`

    const { data } = await axiosInstance[method](url, childData)
    handleSuccess(
      isEditing
        ? 'Child muvaffaqiyatli yangilandi'
        : 'Child muvaffaqiyatli yaratildi'
    )
    return data
  } catch (e) {
    handleError(e)
  }
}

export const deleteChild = async (childId) => {
  try {
    await axiosInstance.delete(`child/${childId}`)
    handleSuccess("Child muvaffaqiyatli o'chirildi")
  } catch (e) {
    handleError(e)
  }
}

export const saveContent = async (isEditing, contentData) => {
  try {
    const method = isEditing ? 'put' : 'post'
    const url = isEditing
      ? `content/${contentData._id}`
      : 'content/' + contentData

    const { data } = await axiosInstance[method](url, contentData)
    handleSuccess(
      isEditing
        ? 'Content muvaffaqiyatli yangilandi'
        : 'Content muvaffaqiyatli yaratildi'
    )
    return data
  } catch (e) {
    handleError(e)
  }
}

export const uploadFile = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axiosInstance.post('content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data.url
  } catch (e) {
    handleError(e)
  }
}

export const Success = (message) => toast.success(message)
export const Warning = (message) => toast.warning(message)
export const Info = (message) => toast.info(message)
export const Error = (e) => toast.error(e)
