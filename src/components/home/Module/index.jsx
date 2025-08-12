import React from 'react'
import SectionLayout from '../../../Layout/SectionLayout'
import ModuleContainer from './ModuleContainer'

export default function Index() {
  return (
    <SectionLayout
      className="module"
      text="KURS DASTURI"
      description="MODULLAR TARKIBI"
    >
      <ModuleContainer />
    </SectionLayout>
  )
}
