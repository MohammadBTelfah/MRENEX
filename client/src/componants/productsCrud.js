import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import axios from 'axios';

export default function ProductsCrud() {
  const [rows, setRows] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [apiCategory, setApiCategory] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://127.0.0.1:5003/api/products/getallproducts');
        setRows(productsRes.data);

const categoryRes = await axios.get('http://127.0.0.1:5003/api/categories');
setApiCategory(categoryRes.data);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

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
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRows([...rows, response.data]); // Assuming response contains full product
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage(null);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://127.0.0.1:5003/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setRows(rows.filter(r => r._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          fullWidth
          labelId="category-label"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {apiCategory.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        <Input
          type="file"
          fullWidth
          onChange={(e) => setImage(e.target.files[0])}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>

      <Table sx={{ mt: 4, minWidth: 650 }} aria-label="products table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.prodName}</TableCell>
              <TableCell align="right">{row.prodDescription}</TableCell>
              <TableCell align="right">{row.prodPrice}</TableCell>
              <TableCell align="right">{row.prodCategory?.name || 'N/A'}</TableCell>
              <TableCell align="right">
                <img
                  src={`http://127.0.0.1:5003/uploads/${row.prodImage}`}
                  alt={row.prodName}
                  style={{ width: 100 }}
                />
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined" color="error" onClick={() => handleDelete(row._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
