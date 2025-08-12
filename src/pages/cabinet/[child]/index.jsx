// pages/cabinet/[child]/index.js

import Layout from '../../../Layout'
import PrivateRoute from '../../../components/PrivateRoute'
import ChildContainer from '../../../components/child/ChildContainer'
import dbConnect from '../../../config/db'
import Category from '../../../models/Category'
import Child from '../../../models/Child'

export default function ChildPage({ data, header }) {
  return (
    <PrivateRoute>
      <Layout>
        <ChildContainer data={data} header={header} />
      </Layout>
    </PrivateRoute>
  )
}

export async function getServerSideProps(context) {
  try {
    await dbConnect()
    const category = await Category.findById(context.params.child)
      .select('title description sort')
      .lean()
    const child = await Child.find({ category: await context.query.child })
      .select('title sort')
      .sort({ sort: 1 })
      .lean()
    const data = JSON.parse(JSON.stringify(child))
    const header = JSON.parse(JSON.stringify(category))
    return {
      props: {
        data,
        header,
      },
    }
  } catch (err) {
    console.error('[SSR ChildPage Error]', err)
    return {
      props: {
        data: [],
        header: {},
      },
    }
  }
}
