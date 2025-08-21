// src/components/admin/Service.js
import axiosInstance from '../../config/axiosConfig'
import { toast } from 'react-toastify'

export const Success = (message) => toast.success(message)
export const Warning = (message) => toast.warning(message)
export const Info = (message) => toast.info(message)
export const Error = (e) => toast.error(e)

const handleSuccess = (message) => Success(message)
const handleError = (e) => {
  const msg =
    e?.response?.data?.message ||
    e?.message ||
    e?.toString() ||
    'Xatolik yuz berdi'
  Error(msg)
  console.error(e)
  throw e
}

function normalizeVisibility(input) {
  if (Array.isArray(input)) {
    return input
      .map((x) => (x === 0 ? 0 : parseInt(x, 10)))
      .filter((n) => Number.isInteger(n) && n >= 0)
  }
  if (typeof input === 'string') {
    return input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((x) => (x === '0' ? 0 : parseInt(x, 10)))
      .filter((n) => Number.isInteger(n) && n >= 0)
  }
  return []
}
export const fetchContent = async (contentId) => {
  try {
    if (!contentId) {
      return {
        title: '',
        description: '',
        video: '',
        file: '',
        child: null,
      }
    }
    const { data } = await axiosInstance.get(`content/${contentId}`)
    return data
  } catch (e) {
    handleError(e)
  }
}

export const fetchContentForChild = async (childId) => {
  try {
    if (!childId) throw new Error('childId majburiy')
    try {
      const { data } = await axiosInstance.get(`content/${childId}`)
      return data // mavjud kontent
    } catch (err1) {
      if (err1?.response?.status !== 404) throw err1
      try {
        const { data } = await axiosInstance.get(`content`, {
          params: { child: childId },
        })
        return data
      } catch (err2) {
        if (err2?.response?.status !== 404) throw err2
        return {
          title: '',
          description: '',
          video: '',
          file: '',
          child: childId,
        }
      }
    }
  } catch (e) {
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
    const payload = {
      ...category,
      visibility: normalizeVisibility(category.visibility),
    }
    const res = await axiosInstance[method](url, payload)
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
    const payload = {
      ...childData,
      visibility: normalizeVisibility(childData.visibility),
    }
    const { data } = await axiosInstance[method](url, payload)
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
    const url = isEditing ? `content/${contentData._id}` : 'content'
    const payload = {
      ...contentData,
      visibility: normalizeVisibility(contentData.visibility),
      child: contentData.child,
    }
    const { data } = await axiosInstance[method](url, payload)
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
