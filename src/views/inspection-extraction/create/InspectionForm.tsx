'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import Select from 'react-select';
const InspectionForm = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    companyName: '',
    fileNumber: '',
    natureOfBusiness: '',
    inspectionItems: [],
  })
  const [newItem, setNewItem] = useState({
    description: '',
    year: '',
    countryOfOrigin: '',
    
    capacity: '',
    type: '',
    costFob: '',
    costCif: '',
    currency: '',
    exchangeRate: '',
    nairaValue: '',
    source: '',
    model: ''
  })
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [loading, setLoading] = useState(false)


  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
    'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Botswana',
    'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)',
    'Congo (Democratic Republic of the Congo)', 'Costa Rica', 'Croatia', 'Cuba',
    'Cyprus', 'Czechia (Czech Republic)', 'Denmark', 'Djibouti', 'Dominica',
    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
    'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
    'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
    'Kenya', 'Kiribati', 'Korea (North)', 'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
    'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
    'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
    'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka',
    'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
    'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
  ];
  

  const formatNumber = (value) => {
    if (!value) return '';
    return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  // const handleNewItemChange = (field: string, value: string) => {
  //   const updatedItem = { ...newItem, [field]: value }

  //   // Automatically calculate Naira value
  //   const handleNewItemChange = (field, value) => {
  //     const updatedItem = { ...newItem, [field]: value };
    
  //     // Automatically calculate Naira value
  //     if (['costFob', 'costCif', 'exchangeRate'].includes(field)) {
  //       const { costFob, costCif, exchangeRate } = updatedItem;
  //       const cost = parseFloat(costFob || costCif || '0') * parseFloat(exchangeRate || '0');
  //       updatedItem.nairaValue = cost ? formatNumber(cost) : '';
  //     }
    
  //     setNewItem(updatedItem);
  //   };
    

  //   setNewItem(updatedItem)
  // }


  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => {
      const updatedItem = { ...prev, [field]: value };
  
      // Calculate Naira Value
      if (field === 'costCif' || field === 'costFob' || field === 'exchangeRate') {
        const cost = parseFloat(updatedItem.costCif || updatedItem.costFob || 0);
        const rate = parseFloat(updatedItem.exchangeRate || 0);
        updatedItem.nairaValue = cost && rate ? (cost * rate).toFixed(2) : '';
      }
  
      return updatedItem;
    });
  };
  

  const addNewItemToTable = () => {
    setFormData({
      ...formData,
      inspectionItems: [...formData.inspectionItems, newItem],
    })
    setNewItem({
      description: '',
      year: '',
      countryOfOrigin: '',
      type: '',
      model: '',
      capacity: '',
      costFob: '',
      costCif: '',
      exchangeRate: '',
      nairaValue: '',
      source: '',
      currency: ''
    })
    setShowNewItemForm(false)
  }

  const deleteItemFromTable = (index: number) => {
    setFormData({
      ...formData,
      inspectionItems: formData.inspectionItems.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/inspection_extract`, formData)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      })
      router.push('/dashboard/inspection-extraction')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting data.',
        timer: 3000,
        showConfirmButton: false,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Inspection Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleFormChange('companyName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="File Number"
                value={formData.fileNumber}
                onChange={(e) => handleFormChange('fileNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nature of Business"
                value={formData.natureOfBusiness}
                onChange={(e) => handleFormChange('natureOfBusiness', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Inspection Items</Typography>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '1rem',
                  border: '1px solid #ddd',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Description</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Year</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Country of Origin</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Type</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Model</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Capacity</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Cost FOB</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Cost CIF</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Exchange Rate</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Naira Value</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Source</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.inspectionItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.description}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.year}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.countryOfOrigin}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.type}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.model}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.capacity}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatNumber(item.costFob)}</td>
      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatNumber(item.costCif)}</td>
      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatNumber(item.exchangeRate)}</td>
      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatNumber(item.nairaValue)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.source}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                        <IconButton
                          onClick={() => deleteItemFromTable(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>

            
  <Grid item xs={12}>
  {showNewItemForm ? (
    <div>
      <Typography variant="h6" style={{ color: 'red' }}>Add New Inspection Item</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={newItem.description}
            onChange={(e) => handleNewItemChange('description', e.target.value)}
            multiline
            rows={3} // Adjust the number of rows as needed
          />
        </Grid>
        {[
          { label: '', field: 'countryOfOrigin' },
          { label: '', field: 'year' },
          { label: 'Type', field: 'type' },
          { label: 'Model', field: 'model' },
          { label: 'Capacity', field: 'capacity' },
          { label: 'Currency', field: 'currency' },
          { label: 'Cost FOB', field: 'costFob', type: 'number' },
          { label: 'Cost CIF', field: 'costCif', type: 'number' },
          { label: 'Exchange Rate', field: 'exchangeRate', type: 'number' },
        ].map(({ label, field, type }) => (
          <Grid item xs={12} sm={6} key={field}>
            {
            
            field === 'currency' ? (
              <div>
                {/* <Typography variant="subtitle1">Currency</Typography> */}
                <TextField
                  fullWidth
                  select
                  // label="Currency"
                  value={newItem.currency}
                  onChange={(e) => handleNewItemChange('currency', e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                 <option >
                      Select Currency
                    </option>
                  {[
                   
                    { code: 'USD', symbol: '$', name: 'US Dollar' },
                    { code: 'EUR', symbol: '€', name: 'Euro' },
                    { code: 'GBP', symbol: '£', name: 'British Pound' },
                    { code: 'NGN', symbol: '₦', name: 'Naira' },
                    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
                    // Add more currencies as needed
                  ].map(({ code, symbol, name }) => (
                    <option key={code} value={code}>
                      {`${symbol} - ${name}`}
                    </option>
                  ))}
                </TextField>
              </div>
            ) : field === 'countryOfOrigin' ? (
            
            // field === 'countryOforigin' ? (
             
              <div>
                <Select
  options={countries.map((country) => ({
    value: country,
    label: country,
  }))}
  onChange={(selectedOption) =>
    handleNewItemChange('countryOfOrigin', selectedOption.value)
  }
  value={{
    value: newItem.countryOfOrigin,
    label: newItem.countryOforigin || 'Country of Origin',
  }}
  placeholder="Search and select a country"
  styles={{
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white', // Set the background to white
      zIndex: 10, // Ensure the input control has a z-index above other elements
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white', // Set the dropdown menu background to white
      zIndex: 100, // Ensure the dropdown menu appears above other content
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'white', // Set the options' background to white
      color: 'black', // Optional: Set text color to black to make it more readable
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black', // Optional: Set the selected value text color to black
    }),
  }}
/>

              </div>
            ) : field === 'year' ? (
              // Year dropdown (displaying years from the current year backwards)
              <div>
                {/* <Typography variant="subtitle1">{label}</Typography> */}
                <TextField
                  fullWidth
                  select
                  // label="Year"
                  value={newItem.year}
                  onChange={(e) => handleNewItemChange('year', e.target.value)}
                  SelectProps={{
                    native: true, // To make it a dropdown
                  }}
                >
                  <option>
                  Select Year
                  </option>
                  {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, index) => {
                    const year = new Date().getFullYear() - index;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </TextField>
              </div>
            ) : (
              <TextField
                fullWidth
                type={type || 'text'} // Default to 'text' if no type is provided
                label={label}
                value={newItem[field]}
                onChange={(e) => handleNewItemChange(field, e.target.value)}
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Naira Value (₦)"
            value={newItem.nairaValue}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Source"
            value={newItem.source}
            onChange={(e) => handleNewItemChange('source', e.target.value)}
            multiline
            rows={2} // Adjust the number of rows as needed
          />
        </Grid>
      </Grid>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={addNewItemToTable}
        style={{ marginRight: '1rem' }}
      >
        Add Item to Table
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setShowNewItemForm(false)}
      >
        Cancel
      </Button>
    </div>
  ) : (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => setShowNewItemForm(true)}
    >
      Add New Item
    </Button>
  )}
</Grid>




            <Grid item xs={12} style={{ marginTop: '2rem' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default InspectionForm
