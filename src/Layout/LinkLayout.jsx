import React from 'react'
import SectionLayout from './SectionLayout'
import LinkContainer from '../components/content/LinkContainer'

const LinkLayout = ({ data }) => {
  return (
    <SectionLayout text="KERAKLI RESURSLAR" description="LINKLAR">
      <LinkContainer data={data} />
    </SectionLayout>
  )
}

export default LinkLayout
