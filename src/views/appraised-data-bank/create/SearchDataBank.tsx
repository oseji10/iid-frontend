'use client'

import { useState } from 'react'
import axios from 'axios'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/navigation';

const SearchDataBank = () => {
  const [query, setGenericParameter] = useState<string>('')
  const [yearUnderReview, setYear] = useState<string>('')
  const [rate, setRate] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [searchResults, setSearchResults] = useState([]);
  // const [loading, setLoading] = useState(false);

  const router = useRouter();
//   const handleSearch = async () => {
//     if (!query.trim() && !yearUnderReview.trim() && !rate.trim()) {
//       setError('Please fill in at least one search parameter.')
//       return
//     }
  
//     setLoading(true)
//     setError('')
  
//     try {
//       // Convert rate to a percentage (e.g., 5 -> 0.05)
//       const rateInDecimal = (parseFloat(rate) / 100).toString()
//   const payload = {
//     query,
//     yearUnderReview,
//     rate
//   }
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_APP_URL}/appraised-data-bank/search`,
//         payload
//       )
  
//       console.log(response.data)
//       if (response.status === 200 && response.data) {
//         const encodedData = encodeURIComponent(JSON.stringify(response.data));
// router.push(`/dashboard/items?data=${encodedData}`);

        
//       } else {
//         setError('No results found.')
//       }
//     } catch (err) {
//       setError('An error occurred while searching. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }
  
const handleSearch = () => {
  const queryParams = new URLSearchParams({ query, yearUnderReview, rate }).toString();
  router.push(`/dashboard/items?${queryParams}`);
};

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
          bgcolor: '#ffffff',
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            Enter Search Parameters
          </Typography>
          <TextField
            placeholder="Item Name"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setGenericParameter(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
          type='number'
            placeholder="Year"
            variant="outlined"
            fullWidth
            value={yearUnderReview}
            onChange={(e) => setYear(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
          type='number'
            placeholder="Rate"
            variant="outlined"
            fullWidth
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" textAlign="center" mt={2}>
              {error}
            </Typography>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            sx={{ fontWeight: 'bold', mt: 2 }}
          >
            Search
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SearchDataBank
