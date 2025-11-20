// src/pages/cabinet/index.js
import React, { useEffect, useState } from 'react'
import Layout from '../../Layout'
import PrivateRoute from '../../components/PrivateRoute'
import BannerLayout from '../../Layout/BannerLayout'
import Link from '../../Layout/LinkLayout'
import Module from '../../Layout/ModuleLayout'
import ScrollingText from '../../components/home/ScrollingText'
import ContentHeader from '../../components/ContentHeader'

import dbConnect from '../../config/db'
import BannerModel from '../../models/Banner'
import LinkModel from '../../models/Link'
import CategoryModel from '../../models/Category'
import axiosInstance from '../../config/axiosConfig'
import { ROLES } from '../../constants/roles'

function normalizeGroups(rawSingle, rawMulti) {
  const result = []

  const pushVal = (val) => {
    if (val === null || val === undefined || val === '') return
    if (Array.isArray(val)) {
      val.forEach(pushVal)
      return
    }
    const n = Number(val)
    if (Number.isInteger(n) && n >= 0 && !result.includes(n)) {
      result.push(n)
    }
  }

  pushVal(rawMulti)
  if (!result.length) pushVal(rawSingle)

  return result.sort((a, b) => a - b)
}

export default function CabinetPage({
  banners,
  links,
  modules,
  initialUserGroup,
}) {
  const [userGroups, setUserGroups] = useState([])
  const [isPrivileged, setIsPrivileged] = useState(false)

  useEffect(() => {
    axiosInstance
      .get('auth/me')
      .then((res) => {
        const single = res?.data?.group
        const multi = res?.data?.groups
        const groupsArr = normalizeGroups(single, multi)

        setUserGroups(groupsArr)

        const rawRole =
          res?.data?.role?.name || res?.data?.role?._id || res?.data?.role
        const role = rawRole ? String(rawRole).toLowerCase() : null
        setIsPrivileged(role === ROLES.ADMIN || role === ROLES.CURATOR)
      })
      .catch(() => {})
  }, [])

  return (
    <PrivateRoute>
      <Layout>
        <ContentHeader />
        <ScrollingText />
        <BannerLayout data={banners} />
        <Link data={links} />
        <Module
          data={modules}
          userGroups={userGroups}
          isPrivileged={isPrivileged}
        />
      </Layout>
    </PrivateRoute>
  )
}

export async function getServerSideProps() {
  try {
    await dbConnect()

    const [bannersRaw, linksRaw, modulesRaw] = await Promise.all([
      BannerModel.find({ isActive: true })
        .sort({ sort: 1, title: 1, _id: 1 })
        .lean(),
      LinkModel.find({ isActive: true })
        .sort({ sort: 1, title: 1, _id: 1 })
        .lean(),
      CategoryModel.find().sort({ sort: 1, title: 1, _id: 1 }).lean(),
    ])

    return {
      props: {
        banners: JSON.parse(JSON.stringify(bannersRaw)),
        links: JSON.parse(JSON.stringify(linksRaw)),
        modules: JSON.parse(JSON.stringify(modulesRaw)),
        initialUserGroup: null,
      },
    }
  } catch (err) {
    console.error('[SSR Cabinet Error]', err)
    return {
      props: {
        banners: [],
        links: [],
        modules: [],
        initialUserGroup: null,
      },
    }
  }
}
