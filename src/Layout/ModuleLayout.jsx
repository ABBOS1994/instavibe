// src/Layout/ModuleLayout.jsx
import React from 'react'
import SectionLayout from './SectionLayout'
import ModuleContainer from '../components/content/ModuleContainer'

const ModuleLayout = ({ data, userGroups = [], isPrivileged = false }) => {
  return (
    <SectionLayout text="KURS" description="MODULLAR">
      <ModuleContainer
        data={data?.filter((item) => !item.isDeleted)}
        userGroups={userGroups}
        isPrivileged={isPrivileged}
      />
    </SectionLayout>
  )
}

export default ModuleLayout
