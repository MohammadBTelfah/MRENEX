import * as React from 'react';
import { useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, Select, MenuItem, InputLabel, Input
} from '@mui/material';
import axios from 'axios';

export default function BasicTable() {
  const [rows, setRows] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [apiCategory, setApiCategory] = React.useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5003/api/products/getallproducts');
      setRows(response.data);

      const categoryRes = await axios.get('http://127.0.0.1:5003/api/categories');
      console.log("Fetched Categories:", categoryRes.data);  // <-- هنا
      setApiCategory(categoryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
}, []);


  return (
    <TableContainer component={Paper}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData();
          data.append('prodName', name);
          data.append('prodDescription', description);
          data.append('prodPrice', price);
          data.append('prodCategory', category);
          data.append('prodImage', image);
          try {
            const response = await axios.post(
              'http://127.0.0.1:5003/api/products/create',
              data,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            const newRow = response.data.product;
            setRows([...rows, newRow]);
          } catch (error) {
            console.error('Error sending data to server:', error);
          }
          setName('');
          setDescription('');
          setPrice('');
          setCategory('');
          setImage(null);
        }}
      >
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
        <InputLabel id="select-category-label">Category</InputLabel>
        <Select
          labelId="select-category-label"
          fullWidth
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
          accept="image/*"
          fullWidth
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>

      <Table sx={{ minWidth: 650 }} aria-label="products table">
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
              <TableCell align="right">
                {row.prodCategory?.name || 'N/A'}
              </TableCell>
              <TableCell align="right">
                <img
                  src={`http://127.0.0.1:5003/${row.prodImage}`}
                  alt={row.prodName}
                  style={{ width: '100px' }}
                />
              </TableCell>
              <TableCell align="right">
                <Button>Update</Button>
                <Button
                  onClick={async () => {
                    if (
                      window.confirm('Are you sure you want to delete this product?')
                    ) {
                      await axios.delete(
                        `http://127.0.0.1:5003/api/products/${row._id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                        }
                      );
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
  );
}
