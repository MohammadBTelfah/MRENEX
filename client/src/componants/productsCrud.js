import * as React from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, Select, MenuItem, InputLabel, Input, Modal, Typography
} from '@mui/material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#121212',
  color: '#fff',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ProductManager() {
  const [rows, setRows] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [apiCategory, setApiCategory] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState(null);

  const fetchData = async () => {
    try {
      const resProducts = await axios.get('http://127.0.0.1:5003/api/products/getallproducts');
      setRows(resProducts.data);
      const resCategories = await axios.get('http://127.0.0.1:5003/api/categories');
      setApiCategory(resCategories.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('prodName', name);
    data.append('prodDescription', description);
    data.append('prodPrice', price);
    data.append('prodCategory', category);
    data.append('prodImage', image);
    try {
      const response = await axios.post('http://127.0.0.1:5003/api/products/create', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRows([...rows, response.data.product]);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleOpen = (row) => {
    setEditId(row._id);
    setName(row.prodName);
    setDescription(row.prodDescription);
    setPrice(row.prodPrice);
    setCategory(row.prodCategory?._id || '');
    setImage(null);
    setOpen(true);
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append('prodName', name);
    data.append('prodDescription', description);
    data.append('prodPrice', price);
    data.append('prodCategory', category);
    if (image) data.append('prodImage', image);

    try {
      await axios.put(`http://127.0.0.1:5003/api/products/${editId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
    setEditId(null);
  };

  const inputStyle = {
    bgcolor: '#1e1e1e',
    borderRadius: 1,
    input: { color: 'white' },
    label: { color: '#ccc' },
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#101010', minHeight: '100vh', color: 'white' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Add New Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={inputStyle}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={inputStyle}
        />
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={inputStyle}
        />
        <InputLabel sx={{ mt: 2, mb: 1 }}>Category</InputLabel>
        <Select
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ ...inputStyle, mb: 2 }}
        >
          {apiCategory.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        <Input
          type="file"
          accept="image/*"
          fullWidth
          onChange={(e) => setImage(e.target.files[0])}
          sx={{
            my: 2,
            bgcolor: '#1e1e1e',
            color: 'white',
            borderRadius: 1,
            p: 1,
          }}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{
            bgcolor: '#4CAF50',
            color: '#fff',
            '&:hover': { bgcolor: '#43a047' },
          }}
        >
          Add Product
        </Button>
      </form>

      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Products Table
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: '#1e1e1e' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">Description</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">Price</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">Category</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">Image</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ color: 'white' }}>{row.prodName}</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">{row.prodDescription}</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">{row.prodPrice}</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">{row.prodCategory?.name || 'N/A'}</TableCell>
                <TableCell align="right">
                  <img
                   src={`http://127.0.0.1:5003/uploads/${row.prodImage}`}
                           alt={row.prodName}
                        style={{ width: '100px' }}
                            />

                </TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="info" onClick={() => handleOpen(row)} sx={{ mr: 1 }}>
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        await axios.delete(`http://127.0.0.1:5003/api/products/${row._id}`, {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                        });
                        setRows(rows.filter((r) => r._id !== row._id));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Update */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Edit Product</Typography>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={inputStyle}
          />
          <InputLabel sx={{ mt: 2, mb: 1 }}>Category</InputLabel>
          <Select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ ...inputStyle, mb: 2 }}
          >
            {apiCategory.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          <Input
            type="file"
            accept="image/*"
            fullWidth
            sx={{
              my: 2,
              bgcolor: '#1e1e1e',
              color: 'white',
              borderRadius: 1,
              p: 1,
            }}
            onChange={(e) => setImage(e.target.files[0])}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
