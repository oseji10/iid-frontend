// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import CreateEncounter from './SearchDataBank'
import SearchPatient from './SearchDataBank'

const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SearchPatient />
      </Grid>
    </Grid>
  )
}

export default Create
