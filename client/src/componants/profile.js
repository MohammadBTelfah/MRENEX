import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Modal, TextField } from "@mui/material";
import axios from "axios";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Profile(props) {
  const navigate = useNavigate();
  const profileData = props.data;

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [updatedProfile, setUpdatedProfile] = useState({
    username: profileData.username || "",
    email: profileData.email || "",
    phone: profileData.phone || "",
    address: profileData.address || "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);

  const handlePasswordOpen = () => setOpenPasswordModal(true);
  const handlePasswordClose = () => setOpenPasswordModal(false);

  const handleEditOpen = () => setOpenEditModal(true);
  const handleEditClose = () => setOpenEditModal(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", updatedProfile.username);
    formData.append("email", updatedProfile.email);
    formData.append("phone", updatedProfile.phone);
    formData.append("address", updatedProfile.address);
    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }

    try {
      const res = await axios.put(
        "http://127.0.0.1:5003/api/users/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully");
      handleEditClose();
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err.message);
      alert("Error updating profile");
    }
  };

  if (!profileData) return <Typography>Loading profile...</Typography>;

  return (
    <div>
      {/* Profile Image */}
      <img
        width={300}
        src={
            `http://127.0.0.1:5003/${profileData.profileImage}`
        }
        alt="Profile"
      />

      <h1>User Name: {profileData.username}</h1>
      <h2>Email: {profileData.email}</h2>
      <h2>Phone: {profileData.phone}</h2>
      <h2>Address: {profileData.address}</h2>

      {/* Buttons */}
      <Button onClick={handleEditOpen} variant="contained" sx={{ m: 1 }}>
        Update Profile
      </Button>
      <Button onClick={handlePasswordOpen} variant="contained" color="secondary" sx={{ m: 1 }}>
        Change Password
      </Button>

      {/* Modal: Update Profile */}
      <Modal open={openEditModal} onClose={handleEditClose}>
        <Box sx={style}>
          <Typography variant="h6">Edit Profile</Typography>
          <form onSubmit={handleUpdateProfile} encType="multipart/form-data">
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={updatedProfile.username}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, username: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={updatedProfile.email}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              value={updatedProfile.phone}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, phone: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              value={updatedProfile.address}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, address: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImageFile(e.target.files[0])}
              style={{ marginTop: "16px" }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal: Change Password */}
      <Modal open={openPasswordModal} onClose={handlePasswordClose}>
        <Box sx={style}>
          <Typography variant="h6">Update Your Password</Typography>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await axios.post(
                  "http://127.0.0.1:5003/api/users/change-password",
                  { oldPassword, newPassword },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                alert("Password changed successfully");
                handlePasswordClose();
              } catch (error) {
                if (error.response?.status === 400) {
                  alert("Old password is incorrect");
                } else {
                  alert("An error occurred while changing the password");
                }
              }
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
