import Layout from '../../../Layout'
import PrivateRoute from '../../../components/PrivateRoute'
import ContentComponent from '../../../components/ContentComponent'
import Content from '../../../models/Content'
import Child from '../../../models/Child'
import dbConnect from '../../../config/db'

export default function ContentPage({ content, sort }) {
  return (
    <PrivateRoute>
      <Layout>
        <ContentComponent data={content} idx={sort} />
      </Layout>
    </PrivateRoute>
  )
}

export async function getServerSideProps(context) {
  try {
    await dbConnect()

    const content = await Content.findOne({ child: context?.params?.id })
      .select('title description video file _id')
      .lean()

    if (content && content._id) {
      content._id = content._id.toString()
    }

    const child = await Child.findOne({ _id: context?.params?.id })
      .select('sort _id')
      .lean()
    console.log(child.sort)
    return {
      props: {
        content: content || {},
        sort: child?.sort || null,
      },
    }
  } catch (error) {
    console.error('[CONTENT PAGE ERROR]', error)
    return {
      props: {
        content: {},
        sort: null,
      },
    }
  }
}
