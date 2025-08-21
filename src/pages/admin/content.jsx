import React, { useEffect, useState } from 'react'
import {
  fetchData,
  saveCategory,
  deleteCategory,
  fetchChildren,
  saveChild,
  deleteChild,
  fetchContentForChild,
  saveContent,
  Success,
  Error,
} from '../../components/admin/Service'
import CategoryTable from '../../components/admin/CategoryTable'
import CategoryModal from '../../components/admin/CategoryModal'
import ChildModal from '../../components/admin/ChildModal'
import ContentModal from '../../components/admin/ContentModal'
import AdminLayout from '../../Layout/AdminLayout'

export default function Content() {
  const [categories, setCategories] = useState([])
  const [groupCodes, setGroupCodes] = useState([]) // Group CRUD -> codes

  const [currentCategory, setCurrentCategory] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [categoryChildren, setCategoryChildren] = useState({})
  const [expandedCategory, setExpandedCategory] = useState(null)

  const [currentChild, setCurrentChild] = useState(null)
  const [isEditingChild, setIsEditingChild] = useState(false)
  const [showChildModal, setShowChildModal] = useState(false)

  const [showContentModal, setShowContentModal] = useState(false)
  const [currentContent, setCurrentContent] = useState(null)
  const [isEditingContent, setIsEditingContent] = useState(false)

  useEffect(() => {
    fetchData('category', setCategories)
    fetchData('group', (list) => {
      const codes = Array.isArray(list)
        ? list
            .map((g) => Number(g?.code))
            .filter((n) => Number.isInteger(n) && n >= 0)
            .sort((a, b) => a - b)
        : []
      setGroupCodes(codes)
    })
  }, [])

  const handleShow = (category) => {
    setIsEditing(!!category)
    setCurrentCategory(category || {})
    setShowModal(true)
  }
  const handleClose = () => setShowModal(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setCurrentCategory((prevCategory) => ({
      ...prevCategory,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = () => {
    saveCategory(isEditing, currentCategory).then((savedCategory) => {
      setCategories((prevCategories) =>
        isEditing
          ? prevCategories.map((category) =>
              category._id === savedCategory._id ? savedCategory : category
            )
          : [...prevCategories, savedCategory]
      )
      setShowModal(false)
    })
  }

  const handleDelete = (categoryId) => {
    deleteCategory(categoryId).then(() =>
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      )
    )
  }

  const handleShowChildren = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
      return
    }
    if (!categoryChildren[categoryId]) {
      fetchChildren(categoryId).then((data) =>
        setCategoryChildren((prev) => ({ ...prev, [categoryId]: data }))
      )
    }
    setExpandedCategory(categoryId)
  }

  const handleShowContent = async (childId) => {
    try {
      const res = await fetchContentForChild(childId)
      const prepared = res && res._id ? res : { ...(res || {}), child: childId }

      setIsEditingContent(!!prepared._id)
      setCurrentContent(prepared)
      setShowContentModal(true)
    } catch (e) {
      Error('Contentni yuklashda xato')
    }
  }

  const handleShowChildModal = (child) => {
    setIsEditingChild(!!child)
    setIsEditingContent(!!child)
    setCurrentChild(child || {})
    setShowChildModal(true)
  }

  const handleChildDelete = (childId) => {
    deleteChild(childId).then(() => {
      setCategoryChildren((prevCategoryChildren) => {
        const updatedChildren = prevCategoryChildren[expandedCategory].filter(
          (child) => child._id !== childId
        )
        return { ...prevCategoryChildren, [expandedCategory]: updatedChildren }
      })
    })
  }

  const handleChildClose = () => setShowChildModal(false)
  const handleContentClose = () => setShowContentModal(false)

  const handleChildChange = (e) => {
    const { name, value, type, checked } = e.target
    setCurrentChild((prevChild) => ({
      ...prevChild,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleContentChange = (e) => {
    const { name, value, type, checked } = e.target
    setCurrentContent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleChildSave = () => {
    saveChild(isEditingChild, currentChild, expandedCategory).then(
      (savedChild) => {
        setCategoryChildren((prevCategoryChildren) => {
          const updatedChildren = isEditingChild
            ? prevCategoryChildren[expandedCategory].map((child) =>
                child._id === savedChild._id ? savedChild : child
              )
            : [...prevCategoryChildren[expandedCategory], savedChild]
          return {
            ...prevCategoryChildren,
            [expandedCategory]: updatedChildren,
          }
        })
        setShowChildModal(false)
      }
    )
  }

  const handleContentSave = () => {
    if (!currentContent) return
    // POST uchun child borligini kafolatlaymiz
    if (!isEditingContent && !currentContent.child) {
      Error('Child aniqlanmagan')
      return
    }
    saveContent(isEditingContent, currentContent)
      .then((savedContent) => {
        setShowContentModal(false)
        setCurrentContent(savedContent)
        Success(
          isEditingContent
            ? 'Content muvaffaqiyatli yangilandi'
            : 'Content muvaffaqiyatli yaratildi'
        )
      })
      .catch((e) => {
        Error('Content saqlashda xato yuz berdi: ' + e.message)
      })
  }

  return (
    <AdminLayout>
      <CategoryTable
        categories={categories}
        expandedCategory={expandedCategory}
        handleShowChildren={handleShowChildren}
        handleShow={handleShow}
        handleDelete={handleDelete}
        categoryChildren={categoryChildren}
        handleShowChildModal={handleShowChildModal}
        handleChildDelete={handleChildDelete}
        handleShowContent={handleShowContent}
      />

      <CategoryModal
        showModal={showModal}
        handleClose={handleClose}
        currentCategory={currentCategory}
        handleChange={handleChange}
        handleSave={handleSave}
        isEditing={isEditing}
        groupCodes={groupCodes}
      />

      <ChildModal
        showChildModal={showChildModal}
        handleChildClose={handleChildClose}
        currentChild={currentChild}
        handleChildChange={handleChildChange}
        handleChildSave={handleChildSave}
        isEditingChild={isEditingChild}
      />

      <ContentModal
        showContentModal={showContentModal}
        handleContentClose={handleContentClose}
        currentContent={currentContent}
        handleContentChange={handleContentChange}
        handleContentSave={handleContentSave}
        isEditingContent={isEditingContent}
      />
    </AdminLayout>
  )
}
