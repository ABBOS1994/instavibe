// src/components/auth/LoginForm.jsx
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { Turnstile } from '@marsidev/react-turnstile'
import axiosInstance, { setAuthToken } from '../../../config/axiosConfig'
import { Info, Error, Success } from '../../admin/Service'

const LoginForm = () => {
  const { push } = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ login: '', password: '' })
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const isDev = process.env.NODE_ENV === 'development'
  const isButtonDisabled =
    (!isDev && !isVerified) || !formData.login || !formData.password || loading

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.login || !formData.password) {
      Info('Iltimos, barcha maydonlarni to‘ldiring.')
      return
    }

    setLoading(true)
    try {
      const res = await axiosInstance.post('/login', formData)
      const { token, user, message } = res.data

      localStorage.setItem('Token', token)
      localStorage.setItem('User', JSON.stringify(user))
      setAuthToken(token)

      Success(message || 'Tizimga muvaffaqiyatli kirildi')
      push('/cabinet')
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Login vaqtida nomaʼlum xatolik yuz berdi'
      Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Form onSubmit={handleSubmit} autoComplete="on">
      <Form.Group>
        <InputGroup className="loginForm">
          <InputGroup.Text>
            <Image src="/icon/profile.svg" width={24} height={24} alt="login" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="login"
            autoComplete="login"
          />
        </InputGroup>
      </Form.Group>

      <Form.Group>
        <InputGroup className="passwordForm">
          <InputGroup.Text>
            <Image src="/icon/lock.svg" width={24} height={24} alt="Parol" />
          </InputGroup.Text>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Parol"
            autoComplete="current-password"
          />
          <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
            <Image
              src={showPassword ? '/icon/hide.svg' : '/icon/show.svg'}
              width={24}
              height={24}
              alt={showPassword ? 'Yopish' : 'Ko‘rsatish'}
            />
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {!isDev && (
        <Turnstile
          siteKey={process.env.TURNSTILE || '0x4AAAAAAAMeTd8YmJkcE7Qy'}
          onSuccess={() => setIsVerified(true)}
          onError={() => setIsVerified(false)}
          onExpire={() => setIsVerified(false)}
          options={{
            action: 'submit-form',
            theme: 'dark',
            refreshExpired: 'auto',
          }}
          scriptOptions={{ appendTo: 'body' }}
        />
      )}

      <button
        type="submit"
        className={`brandBtn ${isButtonDisabled ? 'disabled' : ''}`}
        disabled={isButtonDisabled}
      >
        {loading ? 'KUTING...' : 'KIRISH'}
      </button>
    </Form>
  )
}

export default LoginForm
