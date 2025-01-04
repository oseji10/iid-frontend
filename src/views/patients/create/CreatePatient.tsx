'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Swal from 'sweetalert2'

// Type Definitions
type FormData = {
  itemCode: string
  description: string
  assignCategory: string
  brand: string
  type: string
  comment: string
  model: string
  value: string
  source: string
  year: string
}

const initialFormData: FormData = {
  itemCode: '',
  description: '',
  assignCategory: '',
  brand: '',
  type: '',
  comment: '',
  model: '',
  value: '',
  source: '',
  year: '',
}

const CreatePatient = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [categories, setCategories] = useState<{ categoryId: string; categoryName: string }[]>([])
  
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch doctor names from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/categories`)
        const data = await response.json()
        // const allDoctors = data.flatMap(user => user.doctors)
        setCategories(data)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])




  // Handle form changes
  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    // Ensure dateOfBirth is a Date object
    const formattedDateOfBirth = new Date(`${formData.dateOfBirth}T00:00:00Z`);

    // Prepare payload with the Date object for dateOfBirth
    const payload = {
      
        itemCode: formData.itemCode,
        description: formData.description,
        categoryId: formData.assignCategory,
        brand: formData.brand,
        type: formData.type,
        model: formData.model, // Pass as Date object
        comment: formData.comment,
        source: formData.source,
        year: formData.year,
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/items`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )
  
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Item created successfully!',
        timer: 3000,
        showConfirmButton: false
      })
      setFormData(initialFormData) // Reset form after success
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred. Please try again.',
        timer: 3000,
        showConfirmButton: false
      })
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Code"
                value={formData.itemCode}
                onChange={e => handleFormChange('itemCode', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={e => handleFormChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={e => handleFormChange('brand', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                value={formData.year}
                onChange={e => handleFormChange('year', e.target.value)}
              />
            </Grid>
      
           
        
        
         
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="year"
                value={formData.year}
                onChange={e => handleFormChange('year', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={e => handleFormChange('brand', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.brand}
                onChange={e => handleFormChange('model', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.assignCategory}
                  onChange={e => handleFormChange('assignCategory', e.target.value)}
                >
                  {categories.map(category => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

          </Grid>
          {/* Submit and Reset Buttons */}
          <Grid item xs={12} className="mt-4">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Item'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              type="reset"
              className="ml-2"
              onClick={() => setFormData(initialFormData)}
            >
              Reset
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreatePatient
