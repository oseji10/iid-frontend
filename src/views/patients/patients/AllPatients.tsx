'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import axios from 'axios';

type Item = {
  itemId: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  value: string;
  source: string;
  comment: string;
};

const ItemsTable = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [queryParameter, setQuery] = useState<string>('');
  const [yearUnderReview, setYear] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchItems = async (currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        queryParameter,
        yearUnderReview,
        rate,
        page: currentPage + 1,
        limit: rowsPerPage,
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/appraised-data-bank/search`, payload);

      const { data, total } = response.data;
      setItems(data);
      setTotalItems(total);
    } catch (err) {
      setError('Failed to load items data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page);
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0); // Reset to first page
    fetchItems(0);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    setPage(newPage);
    fetchItems(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchItems(0);
  };

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
    <Box px={2} py={3}>
      {/* Search Form */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={3}
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          label="Search Parameter"
          variant="outlined"
          value={queryParameter}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          label="Year"
          type="number"
          variant="outlined"
          value={yearUnderReview}
          onChange={(e) => setYear(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          label="Rate(%)"
          type="number"
          variant="outlined"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ fontWeight: 'bold', flexShrink: 0 }}
        >
          Search
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>Item ID</TableCell> */}
              <TableCell>Description</TableCell>
              {/* <TableCell>Category</TableCell> */}
              <TableCell>Year</TableCell>
              <TableCell>STC Code</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Adjusted Value</TableCell>
              {/* <TableCell>Value</TableCell> */}
              <TableCell>Source</TableCell>
              {/* <TableCell>Comment</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                {/* <TableCell>{item.itemId}</TableCell> */}
                <TableCell>{item.description}</TableCell>
                {/* <TableCell>{item.category}</TableCell> */}
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.itemCode}</TableCell>
                
                <TableCell>₦{Number(item.value).toLocaleString()}</TableCell>
                <TableCell>₦{Number(item.calculated_value).toLocaleString()}</TableCell>
                <TableCell>{item.source}</TableCell>
                {/* <TableCell>{item.comment}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ItemsTable;
