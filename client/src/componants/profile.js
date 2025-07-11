import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Modal } from "@mui/material";
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


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // تحقق من وجود البيانات قبل العرض
  if (!profileData) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <div>
      {/* Profile Image */}
      <img
  width={300}
  src={
    profileData.profileImage
      ? `http://127.0.0.1:5003/${profileData.profileImage.replace(/\\/g, '/')}`
      : "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
  }
  alt="Profile"
/>


      <h1>User Name: {profileData.username}</h1>
      <h2>Email: {profileData.email}</h2>
      <h2>Phone: {profileData.phone}</h2>
      <h2>Address: {profileData.address}</h2>

      {/* Button to open modal */}
      <Button onClick={handleOpen}>Change Password</Button>

      {/* Password Change Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Your Password
          </Typography>
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
                console.log("Password changed successfully:", response.data);
                alert("Password changed successfully");
                handleClose();
              } catch (error) {
                console.error("Error changing password:", error.message);
                if (error.response && error.response.status === 400) {
                  alert("Old password is incorrect");
                } else {
                  alert("An error occurred while changing the password");
                }
              }
            }}
          >
            <input
              type="text"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
