import React from 'react'
import SectionLayout from './SectionLayout'
import ModuleContainer from '../components/content/ModuleContainer'

const ModuleLayout = ({ data, userGroup }) => {
  return (
    <SectionLayout text="KURS" description="MODULLAR">
      <ModuleContainer
        data={data?.filter((item) => !item.isDeleted)}
        userGroup={userGroup}
      />
    </SectionLayout>
  )
}

export default ModuleLayout
