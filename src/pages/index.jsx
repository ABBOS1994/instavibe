// pages/index.js

import Layout from '../Layout'
import ScrollingText from '../components/home/ScrollingText'
import Header from '../components/home/Header'
import Module from '../components/home/Module'
import Tariff from '../components/home/Tariff'
import Client from '../components/home/Client'
import Student from '../components/home/Result'

import dbConnect from '../config/db'
import TariffModel from '../models/Tariff'
import ClientModel from '../models/Client'
import StudentModel from '../models/Result'

export default function Home({ tariffs, clients, students }) {
  return (
    <Layout>
      <Header />
      <ScrollingText />
      <Module />
      <Tariff data={tariffs} />
      <Client data={clients} />
      <Student data={students} />
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    await dbConnect()

    const [tariffs, clients, students] = await Promise.all([
      TariffModel.find().lean(),
      ClientModel.find().lean(),
      StudentModel.find().lean(),
    ])

    return {
      props: {
        tariffs: JSON.parse(JSON.stringify(tariffs)),
        clients: JSON.parse(JSON.stringify(clients)),
        students: JSON.parse(JSON.stringify(students)),
      },
    }
  } catch (err) {
    console.error('[SSR Home Error]', err)
    return {
      props: {
        tariffs: [],
        clients: [],
        students: [],
      },
    }
  }
}
