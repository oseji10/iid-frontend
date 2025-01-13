'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { CheckCircle, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Extract = {
  companyName: string;
  extractId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatNumber = (value) => {
  if (!value) return '';
  return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const Extraction = () => {
  const [extracts, setExtracts] = useState<Extract[]>([]);
  const [filteredExtracts, setFilteredExtracts] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedExtract, setSelectedExtract] = useState<Extract | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchExtracts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/inspection_extract`);
        setExtracts(response.data);
        setFilteredExtracts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctors data.');
        setLoading(false);
      }
    };

    fetchExtracts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = extracts.filter(
      (extract) =>
        `${extract.companyName}`.toLowerCase().includes(query)
    );
    setFilteredExtracts(filtered);
    setPage(0);
  };

  const handleView = (extract: Extract) => {
    setSelectedExtract(extract);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedExtracts = filteredExtracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <h3>Inspection Extracts</h3>
      {/* <TextField
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
      /> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>File Number</TableCell>
              <TableCell>Nature of Business</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedExtracts.map((extract) => (
              <TableRow key={extract.extractId}>
                
                <TableCell>{extract?.extractId}</TableCell>
                <TableCell>
                  {extract?.companyName}
                </TableCell>
                <TableCell>{extract?.fileNumber}</TableCell>
                <TableCell>{extract?.natureOfBusiness}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(extract)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleView(extract)} color="success">
                    <CheckCircle />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredExtracts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Modal */}
    
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={modalStyle}>
    <Typography variant="h5" gutterBottom>
      Extract Details
    </Typography>
    {selectedExtract && (
      <>
        <Typography variant="body1">
          <strong>Company Name:</strong> {selectedExtract.companyName}
        </Typography>
        <Typography variant="body1">
          <strong>File Number:</strong> {selectedExtract.fileNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Nature of Business:</strong> {selectedExtract.natureOfBusiness}
        </Typography>
        
        {/* Table for Inspection Items */}
        {selectedExtract.inspection_items && selectedExtract.inspection_items.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom mt={2}>
              Inspection Items
            </Typography>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Year</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Country</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Model</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Capacity</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Cost FOB</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Cost CIF</th>
                  {/* <th style={{ border: "1px solid #ddd", padding: "8px" }}>Currency</th> */}
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Exchange Rate</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Naira Value</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {selectedExtract.inspection_items.map((item) => (
                  <tr key={item.extractItemId}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.description || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.year || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.countryOfOrigin || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.type || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.model || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.capacity || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.costFob || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatNumber(item.costCif || "N/A")}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatNumber(item.exchangeRate || "N/A")} {item.currency || "N/A"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>₦{formatNumber(item.nairaValue || "N/A")}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.source || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </>
    )}
  </Box>
</Modal>



    </>
  );
};

export default Extraction;
