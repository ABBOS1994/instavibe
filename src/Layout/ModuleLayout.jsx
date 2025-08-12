import React from 'react'
import SectionLayout from './SectionLayout'
import ModuleContainer from '../components/content/ModuleContainer'

const ModuleLayout = ({ data }) => {
  return (
    <SectionLayout text="KURS" description="MODULLAR">
      <ModuleContainer data={data?.filter((item) => !item.isDeleted)} />
    </SectionLayout>
  )
}

export default ModuleLayout
