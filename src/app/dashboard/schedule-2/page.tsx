'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Modal,
  Box,
  Button,
  TablePagination,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Visibility, Edit, Add, Delete, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';

// Updated Company type to match the full API response
type Company = {
  companyId: number;
  companyName: string;
  natureOfBusiness: string;
  companyAddress: string;
  companyCity: string;
  state: string;
  lga: string;
  companyPhone: string;
  companyWebsite: string;
  tin: string;
  onStockExchange: string;
  dateListedOnSe: string;
  dateOfIncorporation: string;
  status: string;
  socialMedia: { socialMediaName: string; url: string }[];
  factoryLocations: { locationName: string }[];
  contactPersons: { staffName: string; designation: string; phoneNumber: string; email: string }[];
  productionDetails: {
    dateProductionStarted: string;
    prductsAndServices: string;
    designedInstalledCapacity: string;
    operatingCapacity: string;
    percentageForExport: string;
  } | null;
  products: { productName: string }[];
  services: { serviceName: string }[];
  staffing: {
    staffStrength: string;
    directorExpatriate: number;
    directorNigerian: number;
    managementExpatriate: number;
    managementNigerian: number;
    otherStaffSkilled: number;
    otherStaffUnskilled: number;
  } | null;
  financialDetails: {
    shareholders: string;
    foreignEquity: string;
    nigerianEquity: string;
    financialPeriod: string;
    turnOverPreviousYear: string;
    operatingProfitBeforeTax: string;
    operatingProfitAfterTax: string;
    VAT: string;
    companyTax: string;
    exciseDuty: string;
    initialInvestment: string;
    totalFAIFinancialStatement: string;
    totalFAIAcceptanceCertificate: string;
  } | null;
  rawMaterials: {
    foreignItem: string;
    foreignItemQuantity: string;
    localItem: string;
    localItemQuantity: string;
  }[];
  machineryAndEquipment: {
    equipmentName: string;
    sourceOfMachinery: string;
  }[];
  energyRequirements: {
    averageEnergyConsumptionPerDay: string;
    percentageContributionByDisco: string;
    percentageContributionByGenerator: string;
    percentageContributionByOthers: string;
    quantityOfDieselUtilized: string;
    quantityOfGasUtilized: string;
  } | null;
  environmentalImpactAssessment: {
    typeOfAssessment: string;
    degreeOfAbatementOrRemediation: string;
  }[];
  investment: {
    FDI: string;
    foreign: string;
  } | null;
  foreignCurrencyUsage: {
    importedItemName: string;
    FX: string;
    currencyType: string;
  }[];
};

// Modal style (unchanged)
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800, // Slightly wider for more data
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

// Utility functions (unchanged)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatNumber = (value: string | number) => {
  if (!value) return 'N/A';
  return parseFloat(value.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Nigerian states and LGAs (unchanged)
const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
];

const lgaData = {
  'Abia': [
    'Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North',
    'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo',
    'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi',
  ],
  'Adamawa': [
    'Demsa', 'Fufure', 'Ganye', 'Gayuk', 'Gombi', 'Grie', 'Hong', 'Jada', 'Lamurde',
    'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan',
    'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South',
  ],
  'Lagos': [
    'Agege', 'Ajeromi Ifelodun', 'Alimosho', 'Amuwo Odofin', 'Apapa',
    'Badagry', 'Epe', 'Eti Osa', 'Ibeju Lekki', 'Ifako Ijaiye', 'Ikeja', 'Ikorodu',
    'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi Isolo',
    'Somolu', 'Surulere',
  ],
};

// Stepper steps (unchanged)
const steps = [
  'Basic Information',
  'Location Details',
  'Financial Information',
  'Social Media',
  'Factory Locations',
  'Contact Persons',
  'Production Details',
  'Products',
  'Services',
  'Staffing',
];

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openNewCompanyModal, setOpenNewCompanyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStep, setActiveStep] = useState(0);
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: '',
    natureOfBusiness: '',
    companyAddress: '',
    companyCity: '',
    state: '',
    lga: '',
    companyPhone: '',
    companyWebsite: '',
    tin: '',
    onStockExchange: '',
    dateListedOnSe: '',
    dateOfIncorporation: '',
    socialMedia: [{ socialMediaName: '', url: '' }],
    factoryLocations: [{ locationName: '' }],
    contactPersons: [{ staffName: '', designation: '', phoneNumber: '', email: '' }],
    productionDetails: {
      dateProductionStarted: '',
      prductsAndServices: '',
      designedInstalledCapacity: '',
      operatingCapacity: '',
      percentageForExport: '',
    },
    products: [{ productName: '' }],
    services: [{ serviceName: '' }],
    staffing: {
      staffStrength: '',
      directorExpatriate: 0,
      directorNigerian: 0,
      managementExpatriate: 0,
      managementNigerian: 0,
      otherStaffSkilled: 0,
      otherStaffUnskilled: 0,
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/companies`);
        setCompanies(response.data);
        setFilteredCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load companies data.');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = companies.filter(
      (company) => `${company.companyName}`.toLowerCase().includes(query)
    );
    setFilteredCompanies(filtered);
    setPage(0);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setOpenViewModal(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      companyName: company.companyName || '',
      natureOfBusiness: company.natureOfBusiness || '',
      companyAddress: company.companyAddress || '',
      companyCity: company.companyCity || '',
      state: company.state || '',
      lga: company.lga || '',
      companyPhone: company.companyPhone || '',
      companyWebsite: company.companyWebsite || '',
      tin: company.tin || '',
      onStockExchange: company.onStockExchange || '',
      dateListedOnSe: company.dateListedOnSe || '',
      dateOfIncorporation: company.dateOfIncorporation || '',
      socialMedia: company.socialMedia.length > 0 ? company.socialMedia : [{ socialMediaName: '', url: '' }],
      factoryLocations: company.factoryLocations.length > 0 ? company.factoryLocations : [{ locationName: '' }],
      contactPersons: company.contactPersons.length > 0 ? company.contactPersons : [{ staffName: '', designation: '', phoneNumber: '', email: '' }],
      productionDetails: company.productionDetails || {
        dateProductionStarted: '',
        prductsAndServices: '',
        designedInstalledCapacity: '',
        operatingCapacity: '',
        percentageForExport: '',
      },
      products: company.products.length > 0 ? company.products : [{ productName: '' }],
      services: company.services.length > 0 ? company.services : [{ serviceName: '' }],
      staffing: company.staffing || {
        staffStrength: '',
        directorExpatriate: 0,
        directorNigerian: 0,
        managementExpatriate: 0,
        managementNigerian: 0,
        otherStaffSkilled: 0,
        otherStaffUnskilled: 0,
      },
    });
    setAvailableLGAs(lgaData[company.state] || []);
    setOpenEditModal(true);
    setActiveStep(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number,
    field?: string,
    arrayField?: 'socialMedia' | 'factoryLocations' | 'contactPersons' | 'products' | 'services',
    nestedField?: string
  ) => {
    const { name, value } = e.target;

    if (arrayField && index !== undefined && field) {
      setFormData((prev) => ({
        ...prev,
        [arrayField]: prev[arrayField].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else if (nestedField && name) {
      setFormData((prev) => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === 'state') {
        setAvailableLGAs(lgaData[value] || []);
        setFormData((prev) => ({ ...prev, lga: '' }));
      }
    }
  };

  const handleAddItem = (field: 'socialMedia' | 'factoryLocations' | 'contactPersons' | 'products' | 'services') => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'socialMedia'
          ? [...prev.socialMedia, { socialMediaName: '', url: '' }]
          : field === 'factoryLocations'
          ? [...prev.factoryLocations, { locationName: '' }]
          : field === 'contactPersons'
          ? [...prev.contactPersons, { staffName: '', designation: '', phoneNumber: '', email: '' }]
          : field === 'products'
          ? [...prev.products, { productName: '' }]
          : [...prev.services, { serviceName: '' }],
    }));
  };

  const handleRemoveItem = (
    index: number,
    field: 'socialMedia' | 'factoryLocations' | 'contactPersons' | 'products' | 'services'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveStep((prev) => prev - 1);
  };

  const handleFormSubmit = async (e: React.FormEvent, isEdit = false) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (isEdit && selectedCompany) {
        await axios.put(`${process.env.NEXT_PUBLIC_APP_URL}/companies/${selectedCompany.companyId}`, formData);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/companies`, formData);
      }
      setOpenNewCompanyModal(false);
      setOpenEditModal(false);
      setActiveStep(0);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/companies`);
      setCompanies(response.data);
      setFilteredCompanies(response.data);
      setFormData({
        companyName: '',
        natureOfBusiness: '',
        companyAddress: '',
        companyCity: '',
        state: '',
        lga: '',
        companyPhone: '',
        companyWebsite: '',
        tin: '',
        onStockExchange: '',
        dateListedOnSe: '',
        dateOfIncorporation: '',
        socialMedia: [{ socialMediaName: '', url: '' }],
        factoryLocations: [{ locationName: '' }],
        contactPersons: [{ staffName: '', designation: '', phoneNumber: '', email: '' }],
        productionDetails: {
          dateProductionStarted: '',
          prductsAndServices: '',
          designedInstalledCapacity: '',
          operatingCapacity: '',
          percentageForExport: '',
        },
        products: [{ productName: '' }],
        services: [{ serviceName: '' }],
        staffing: {
          staffStrength: '',
          directorExpatriate: 0,
          directorNigerian: 0,
          managementExpatriate: 0,
          managementNigerian: 0,
          otherStaffSkilled: 0,
          otherStaffUnskilled: 0,
        },
      });
      setAvailableLGAs([]);
    } catch (err) {
      setError('Failed to save company.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const displayedCompanies = filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nature of Business"
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Phone"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Website"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        );
      case 1: // Location Details
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Address"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company City"
                name="companyCity"
                value={formData.companyCity}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleFormChange}
                  label="State"
                >
                  <MenuItem value="">Select State</MenuItem>
                  {nigerianStates.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>LGA</InputLabel>
                <Select
                  name="lga"
                  value={formData.lga}
                  onChange={handleFormChange}
                  label="LGA"
                  disabled={!formData.state}
                >
                  <MenuItem value="">Select LGA</MenuItem>
                  {availableLGAs.map((lga) => (
                    <MenuItem key={lga} value={lga}>{lga}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2: // Financial Information
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TIN"
                name="tin"
                value={formData.tin}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>On Stock Exchange</InputLabel>
                <Select
                  name="onStockExchange"
                  value={formData.onStockExchange}
                  onChange={handleFormChange}
                  label="On Stock Exchange"
                >
                  <MenuItem value="">Select Option</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date Listed on SE"
                name="dateListedOnSe"
                type="date"
                value={formData.dateListedOnSe}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Incorporation"
                name="dateOfIncorporation"
                type="date"
                value={formData.dateOfIncorporation}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
      case 3: // Social Media
        return (
          <Grid container spacing={2}>
            {formData.socialMedia.map((social, index) => (
              <React.Fragment key={index}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Social Media Name"
                    value={social.socialMediaName}
                    onChange={(e) => handleFormChange(e, index, 'socialMediaName', 'socialMedia')}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="URL"
                    value={social.url}
                    onChange={(e) => handleFormChange(e, index, 'url', 'socialMedia')}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'socialMedia')}
                    disabled={formData.socialMedia.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                onClick={() => handleAddItem('socialMedia')}
              >
                Add Social Media
              </Button>
            </Grid>
          </Grid>
        );
      case 4: // Factory Locations
        return (
          <Grid container spacing={2}>
            {formData.factoryLocations.map((location, index) => (
              <React.Fragment key={index}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label="Location Name"
                    value={location.locationName}
                    onChange={(e) => handleFormChange(e, index, 'locationName', 'factoryLocations')}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'factoryLocations')}
                    disabled={formData.factoryLocations.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                onClick={() => handleAddItem('factoryLocations')}
              >
                Add Factory Location
              </Button>
            </Grid>
          </Grid>
        );
      case 5: // Contact Persons
        return (
          <Grid container spacing={2}>
            {formData.contactPersons.map((contact, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Staff Name"
                    value={contact.staffName}
                    onChange={(e) => handleFormChange(e, index, 'staffName', 'contactPersons')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    value={contact.designation}
                    onChange={(e) => handleFormChange(e, index, 'designation', 'contactPersons')}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={contact.phoneNumber}
                    onChange={(e) => handleFormChange(e, index, 'phoneNumber', 'contactPersons')}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={contact.email}
                    onChange={(e) => handleFormChange(e, index, 'email', 'contactPersons')}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'contactPersons')}
                    disabled={formData.contactPersons.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                onClick={() => handleAddItem('contactPersons')}
              >
                Add Contact Person
              </Button>
            </Grid>
          </Grid>
        );
      case 6: // Production Details
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date Production Started"
                name="dateProductionStarted"
                type="date"
                value={formData.productionDetails.dateProductionStarted}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Products and Services"
                name="prductsAndServices"
                value={formData.productionDetails.prductsAndServices}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Designed Installed Capacity"
                name="designedInstalledCapacity"
                value={formData.productionDetails.designedInstalledCapacity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Operating Capacity"
                name="operatingCapacity"
                value={formData.productionDetails.operatingCapacity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Percentage for Export"
                name="percentageForExport"
                value={formData.productionDetails.percentageForExport}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
              />
            </Grid>
          </Grid>
        );
      case 7: // Products
        return (
          <Grid container spacing={2}>
            {formData.products.map((product, index) => (
              <React.Fragment key={index}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={product.productName}
                    onChange={(e) => handleFormChange(e, index, 'productName', 'products')}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'products')}
                    disabled={formData.products.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                onClick={() => handleAddItem('products')}
              >
                Add Product
              </Button>
            </Grid>
          </Grid>
        );
      case 8: // Services
        return (
          <Grid container spacing={2}>
            {formData.services.map((service, index) => (
              <React.Fragment key={index}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label="Service Name"
                    value={service.serviceName}
                    onChange={(e) => handleFormChange(e, index, 'serviceName', 'services')}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'services')}
                    disabled={formData.services.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                onClick={() => handleAddItem('services')}
              >
                Add Service
              </Button>
            </Grid>
          </Grid>
        );
      case 9: // Staffing
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Staff Strength"
                name="staffStrength"
                value={formData.staffing.staffStrength}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Director Expatriate"
                name="directorExpatriate"
                type="number"
                value={formData.staffing.directorExpatriate}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Director Nigerian"
                name="directorNigerian"
                type="number"
                value={formData.staffing.directorNigerian}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Management Expatriate"
                name="managementExpatriate"
                type="number"
                value={formData.staffing.managementExpatriate}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Management Nigerian"
                name="managementNigerian"
                type="number"
                value={formData.staffing.managementNigerian}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Other Staff Skilled"
                name="otherStaffSkilled"
                type="number"
                value={formData.staffing.otherStaffSkilled}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Other Staff Unskilled"
                name="otherStaffUnskilled"
                type="number"
                value={formData.staffing.otherStaffUnskilled}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h3>Schedules</h3>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Button
          onClick={() => router.push('/dashboard/schedule-2/new-schedule')}
        >
          New Schedule
        </Button>
        <TextField
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
          fullWidth
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Nature of Business</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCompanies.map((company) => (
              <TableRow key={company.companyId}>
                <TableCell>{company.companyId}</TableCell>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.natureOfBusiness}</TableCell>
                <TableCell>{company.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(company)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(company)} color="secondary">
                    <Edit />
                  </IconButton>

                  <IconButton
          component="a"
          href={`${process.env.NEXT_PUBLIC_APP_URL}/company/${company.companyId}/status-report`}
          target="_blank"
          color="primary"
          title="Download Status Report"
        >
          <PictureAsPdf />
        </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredCompanies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* New Company Modal */}
      <Modal open={openNewCompanyModal} onClose={() => setOpenNewCompanyModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            New Company
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              flexWrap: 'wrap',
              '& .MuiStep-root': {
                flexBasis: 'auto',
                minWidth: '120px',
                padding: '8px',
              },
              '& .MuiStepLabel-root': {
                flexDirection: 'column',
                textAlign: 'center',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={(e) => handleFormSubmit(e, false)}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || formSubmitting}
                onClick={handleBack}
                type="button"
              >
                Back
              </Button>
              <Box>
                <Button
                  onClick={() => setOpenNewCompanyModal(false)}
                  sx={{ mr: 2 }}
                  disabled={formSubmitting}
                  type="button"
                >
                  Cancel
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formSubmitting}
                    startIcon={formSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {formSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    type="button"
                    disabled={formSubmitting}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Edit Company Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Edit Company
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              flexWrap: 'wrap',
              '& .MuiStep-root': {
                flexBasis: 'auto',
                minWidth: '120px',
                padding: '8px',
              },
              '& .MuiStepLabel-root': {
                flexDirection: 'column',
                textAlign: 'center',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={(e) => handleFormSubmit(e, true)}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || formSubmitting}
                onClick={handleBack}
                type="button"
              >
                Back
              </Button>
              <Box>
                <Button
                  onClick={() => setOpenEditModal(false)}
                  sx={{ mr: 2 }}
                  disabled={formSubmitting}
                  type="button"
                >
                  Cancel
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formSubmitting}
                    startIcon={formSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {formSubmitting ? 'Updating...' : 'Update'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    type="button"
                    disabled={formSubmitting}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* View Modal */}
<Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={modalStyle}>
    <Typography variant="h5" gutterBottom>
      Company Details
    </Typography>
    {selectedCompany && (
      <Grid container spacing={2}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6">Basic Information</Typography>
          <Typography variant="body1">
            <strong>Company Name:</strong> {selectedCompany.companyName || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Nature of Business:</strong> {selectedCompany.natureOfBusiness || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {selectedCompany.companyPhone || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Website:</strong> {selectedCompany.companyWebsite || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {selectedCompany.status || 'N/A'}
          </Typography>
        </Grid>

        {/* Location Details */}
        <Grid item xs={12}>
          <Typography variant="h6">Location Details</Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {selectedCompany.companyAddress || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>City:</strong> {selectedCompany.companyCity || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>State:</strong> {selectedCompany.state || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>LGA:</strong> {selectedCompany.lga || 'N/A'}
          </Typography>
        </Grid>

        {/* Financial Information */}
        <Grid item xs={12}>
          <Typography variant="h6">Financial Information</Typography>
          <Typography variant="body1">
            <strong>TIN:</strong> {selectedCompany.tin || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>On Stock Exchange:</strong> {selectedCompany.onStockExchange || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Date Listed on SE:</strong> {formatDate(selectedCompany.dateListedOnSe)}
          </Typography>
          <Typography variant="body1">
            <strong>Date of Incorporation:</strong> {formatDate(selectedCompany.dateOfIncorporation)}
          </Typography>
          {selectedCompany.financialDetails && (
            <>
              <Typography variant="body1">
                <strong>Shareholders:</strong> {selectedCompany.financialDetails.shareholders || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Foreign Equity:</strong> {selectedCompany.financialDetails.foreignEquity || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Nigerian Equity:</strong> {selectedCompany.financialDetails.nigerianEquity || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Financial Period:</strong> {selectedCompany.financialDetails.financialPeriod || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Turnover Previous Year:</strong> {selectedCompany.financialDetails.turnOverPreviousYear || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Operating Profit Before Tax:</strong> {selectedCompany.financialDetails.operatingProfitBeforeTax || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Operating Profit After Tax:</strong> {selectedCompany.financialDetails.operatingProfitAfterTax || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>VAT:</strong> {selectedCompany.financialDetails.VAT || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Company Tax:</strong> {selectedCompany.financialDetails.companyTax || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Excise Duty:</strong> {selectedCompany.financialDetails.exciseDuty || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Initial Investment:</strong> {selectedCompany.financialDetails.initialInvestment || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Total FAI (Financial Statement):</strong> {selectedCompany.financialDetails.totalFAIFinancialStatement || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Total FAI (Acceptance Certificate):</strong> {selectedCompany.financialDetails.totalFAIAcceptanceCertificate || 'N/A'}
              </Typography>
            </>
          )}
        </Grid>

        {/* Social Media */}
        <Grid item xs={12}>
          <Typography variant="h6">Social Media</Typography>
          {selectedCompany.socialMedia && selectedCompany.socialMedia.length > 0 ? (
            <ul>
              {selectedCompany.socialMedia.map((sm, index) => (
                <li key={index}>
                  {sm.socialMediaName}: <a href={sm.url} target="_blank" rel="noopener noreferrer">{sm.url}</a>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Factory Locations */}
        <Grid item xs={12}>
          <Typography variant="h6">Factory Locations</Typography>
          {selectedCompany.factoryLocations && selectedCompany.factoryLocations.length > 0 ? (
            <ul>
              {selectedCompany.factoryLocations.map((loc, index) => (
                <li key={index}>{loc.locationName}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Contact Persons */}
        <Grid item xs={12}>
          <Typography variant="h6">Contact Persons</Typography>
          {selectedCompany.contactPersons && selectedCompany.contactPersons.length > 0 ? (
            <ul>
              {selectedCompany.contactPersons.map((cp, index) => (
                <li key={index}>
                  {cp.staffName} ({cp.designation}): {cp.phoneNumber}, {cp.email}
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Production Details */}
        <Grid item xs={12}>
          <Typography variant="h6">Production Details</Typography>
          {selectedCompany.productionDetails ? (
            <ul>
              <li>Date Production Started: {formatDate(selectedCompany.productionDetails.dateProductionStarted)}</li>
              <li>Products and Services: {selectedCompany.productionDetails.prductsAndServices || 'N/A'}</li>
              <li>Designed Installed Capacity: {selectedCompany.productionDetails.designedInstalledCapacity || 'N/A'}</li>
              <li>Operating Capacity: {selectedCompany.productionDetails.operatingCapacity || 'N/A'}</li>
              <li>Percentage for Export: {selectedCompany.productionDetails.percentageForExport || 'N/A'}</li>
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Products */}
        <Grid item xs={12}>
          <Typography variant="h6">Products</Typography>
          {selectedCompany.products && selectedCompany.products.length > 0 ? (
            <ul>
              {selectedCompany.products.map((prod, index) => (
                <li key={index}>{prod.productName}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Services */}
        <Grid item xs={12}>
          <Typography variant="h6">Services</Typography>
          {selectedCompany.services && selectedCompany.services.length > 0 ? (
            <ul>
              {selectedCompany.services.map((serv, index) => (
                <li key={index}>{serv.serviceName}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Staffing */}
        <Grid item xs={12}>
          <Typography variant="h6">Staffing</Typography>
          {selectedCompany.staffing ? (
            <ul>
              <li>Staff Strength: {selectedCompany.staffing.staffStrength || 'N/A'}</li>
              <li>Director Expatriate: {selectedCompany.staffing.directorExpatriate || 0}</li>
              <li>Director Nigerian: {selectedCompany.staffing.directorNigerian || 0}</li>
              <li>Management Expatriate: {selectedCompany.staffing.managementExpatriate || 0}</li>
              <li>Management Nigerian: {selectedCompany.staffing.managementNigerian || 0}</li>
              <li>Other Staff Skilled: {selectedCompany.staffing.otherStaffSkilled || 0}</li>
              <li>Other Staff Unskilled: {selectedCompany.staffing.otherStaffUnskilled || 0}</li>
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Raw Materials */}
        <Grid item xs={12}>
          <Typography variant="h6">Raw Materials</Typography>
          {selectedCompany.rawMaterials && selectedCompany.rawMaterials.length > 0 ? (
            <ul>
              {selectedCompany.rawMaterials.map((material, index) => (
                <li key={index}>
                  Foreign: {material.foreignItem || 'N/A'} ({material.foreignItemQuantity || 'N/A'}), 
                  Local: {material.localItem || 'N/A'} ({material.localItemQuantity || 'N/A'})
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Machinery and Equipment */}
        <Grid item xs={12}>
          <Typography variant="h6">Machinery and Equipment</Typography>
          {selectedCompany.machineryAndEquipment && selectedCompany.machineryAndEquipment.length > 0 ? (
            <ul>
              {selectedCompany.machineryAndEquipment.map((equipment, index) => (
                <li key={index}>
                  {equipment.equipmentName || 'N/A'} (Source: {equipment.sourceOfMachinery || 'N/A'})
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Energy Requirements */}
        <Grid item xs={12}>
          <Typography variant="h6">Energy Requirements</Typography>
          {selectedCompany.energyRequirements ? (
            <ul>
              <li>Average Energy Consumption: {selectedCompany.energyRequirements.averageEnergyConsumptionPerDay || 'N/A'}</li>
              <li>Disco Contribution: {selectedCompany.energyRequirements.percentageContributionByDisco || 'N/A'}</li>
              <li>Generator Contribution: {selectedCompany.energyRequirements.percentageContributionByGenerator || 'N/A'}</li>
              <li>Other Contribution: {selectedCompany.energyRequirements.percentageContributionByOthers || 'N/A'}</li>
              <li>Diesel Utilized: {selectedCompany.energyRequirements.quantityOfDieselUtilized || 'N/A'}</li>
              <li>Gas Utilized: {selectedCompany.energyRequirements.quantityOfGasUtilized || 'N/A'}</li>
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Environmental Impact Assessment */}
        <Grid item xs={12}>
          <Typography variant="h6">Environmental Impact Assessment</Typography>
          {selectedCompany.environmentalImpactAssessment && selectedCompany.environmentalImpactAssessment.length > 0 ? (
            <ul>
              {selectedCompany.environmentalImpactAssessment.map((assessment, index) => (
                <li key={index}>
                  Type: {assessment.typeOfAssessment || 'N/A'}, 
                  Degree of Abatement: {assessment.degreeOfAbatementOrRemediation || 'N/A'}
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Investment */}
        <Grid item xs={12}>
          <Typography variant="h6">Investment</Typography>
          {selectedCompany.investment ? (
            <ul>
              <li>FDI: {selectedCompany.investment.FDI || 'N/A'}</li>
              <li>Foreign: {selectedCompany.investment.foreign || 'N/A'}</li>
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>

        {/* Foreign Currency Usage */}
        <Grid item xs={12}>
          <Typography variant="h6">Foreign Currency Usage</Typography>
          {selectedCompany.foreignCurrencyUsage && selectedCompany.foreignCurrencyUsage.length > 0 ? (
            <ul>
              {selectedCompany.foreignCurrencyUsage.map((usage, index) => (
                <li key={index}>
                  Item: {usage.importedItemName || 'N/A'}, 
                  FX: {usage.FX || 'N/A'}, 
                  Currency: {usage.currencyType || 'N/A'}
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>
      </Grid>
    )}
    <Box sx={{ mt: 2, textAlign: 'right' }}>
      <Button
        onClick={() => setOpenViewModal(false)}
        variant="contained"
        color="primary"
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>
    </>
  );
};

export default Companies;