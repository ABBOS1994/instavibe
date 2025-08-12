// pages/cabinet/index.jsx

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

export default function CabinetPage({ banners, links, modules }) {
  return (
    <PrivateRoute>
      <Layout>
        <ContentHeader />
        <ScrollingText />
        <BannerLayout data={banners} />
        <Link data={links} />
        <Module data={modules} />
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
      },
    }
  } catch (err) {
    console.error('[SSR Cabinet Error]', err)
    return {
      props: {
        banners: [],
        links: [],
        modules: [],
      },
    }
  }
}
