import React from 'react'
import SectionLayout from './SectionLayout'
import ModuleContainer from '../components/content/ModuleContainer'

const ModuleLayout = ({ data, userGroup, isPrivileged = false }) => {
  return (
    <SectionLayout text="KURS" description="MODULLAR">
      <ModuleContainer
        data={data?.filter((item) => !item.isDeleted)}
        userGroup={userGroup}
        isPrivileged={isPrivileged}
      />
    </SectionLayout>
  )
}

export default ModuleLayout
