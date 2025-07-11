import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Stack
} from '@mui/material';

export function Category() {
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5003/api/categories');
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const newRow = { name };
    try {
        await axios.post('http://127.0.0.1:5003/api/categories/create', newRow, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        await fetchCategories();  // ✅ هنا نعيد التحميل من السيرفر بدل إضافة العنصر يدويًا
        setName('');
    } catch (error) {
        console.error('Error sending data to server:', error);
    }
};


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this Category?")) {
            try {
                await axios.delete(`http://127.0.0.1:5003/api/categories/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setRows(rows.filter(r => r._id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleUpdate = (id, currentName) => {
        setEditingId(id);
        setEditName(currentName);
    };

    const handleSave = async (id) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5003/api/categories/${id}`, { name: editName }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setRows(rows.map(r => (r._id === id ? response.data : r)));
            setEditingId(null);
            setEditName('');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Add New Category
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <TextField
                            label="Category Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell>
                                        {editingId === row._id ? (
                                            <TextField
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                size="small"
                                            />
                                        ) : (
                                            row.name
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack spacing={1} direction="row" justifyContent="flex-end">
                                            {editingId === row._id ? (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleSave(row._id)}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="inherit"
                                                        size="small"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleUpdate(row._id, row.name)}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(row._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
