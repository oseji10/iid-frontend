// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
// import Encounters from '@/views/encounters'
import EncountersTable from '@/views/encounters/encounters/AllEncounters'
import SearchPatient from '@/views/appraised-data-bank/create/SearchDataBank'

// const EncountersTab = dynamic(() => import('@/views/encounters/encounters'))
// const CreateTab = dynamic(() => import('@/views/encounters/create'))

// // Vars
// const tabContentList = (): { [key: string]: ReactElement } => ({
//   encounters: <EncountersTab />,
//   // create: <CreateTab />,
// })

const EncountersPage = () => {
  return <SearchPatient />
}

export default EncountersPage
