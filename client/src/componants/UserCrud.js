import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, Box, TextField, MenuItem, Select, InputLabel,
  FormControl
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
  boxShadow: 24,
};

export default function UserCrud() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5003/api/users/getallusers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(" Are you sure you want to delete this account ?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://127.0.0.1:5003/api/users/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};


  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditData({
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "",
      profileImage: null,
    });
    setOpenModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEditData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    formData.append("username", editData.username);
    formData.append("fullName", editData.fullName);
    formData.append("email", editData.email);
    formData.append("phone", editData.phone);
    formData.append("address", editData.address);
    formData.append("role", editData.role);
    if (editData.profileImage) {
      formData.append("profileImage", editData.profileImage);
    }

    try {
      await axios.put(
  `http://127.0.0.1:5003/api/users/update-user/${selectedUser._id}`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  }
);

      setOpenModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#fff", textAlign: "center" }}>User List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
<img
src={`http://127.0.0.1:5003/${user.profileImage}`}
  alt="Profile"
  style={{
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "50%",
    backgroundColor: "#fff"
  }}
/>



                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditOpen(user)}>EDIT</Button>{" "}
                  <Button variant="outlined" color="error" onClick={() => handleDelete(user._id)}>DELETE</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <h3>Edit User</h3>
          <TextField fullWidth label="Username" name="username" value={editData.username} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Full Name" name="fullName" value={editData.fullName} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Email" name="email" value={editData.email} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Phone" name="phone" value={editData.phone} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Address" name="address" value={editData.address} onChange={handleEditChange} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={editData.role} onChange={handleEditChange} label="Role">
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            margin="normal"
          />
          <Button variant="contained" onClick={handleEditSave} sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
