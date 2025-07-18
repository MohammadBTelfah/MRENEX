import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Modal,
  TextField,
  Button
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  borderRadius: "12px"
}));

const FieldWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px"
  }
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(3)
}));

const UploadIconButton = styled("label")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: "calc(50% - 60px)",
  backgroundColor: "#ffffffcc",
  borderRadius: "50%",
  padding: 6,
  cursor: "pointer",
  zIndex: 1
}));

const HiddenInput = styled("input")({
  display: "none"
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:5003/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditField("");
    setEditValue("");
  };

  const handleFieldUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append(editField, editValue);

      const res = await axios.put("http://127.0.0.1:5003/api/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setUserData(res.data);
      handleCloseModal();
      alert("Field updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Field update failed");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.put("http://127.0.0.1:5003/api/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setUserData(res.data);
      alert("Profile image updated");
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    }
  };

  const handlePasswordChange = async () => {
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token); // 👈 هنا قبل الطلب

  try {
    const res = await axios.post(
      "http://127.0.0.1:5003/api/users/change-password",
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 👈 أضف هذا مهم لبعض الخوادم
        }
      }
    );

    alert("Password changed successfully");
    setOpenPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
  } catch (err) {
    console.error("Password change failed", err.response?.data || err.message);
    alert("Password change failed");
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography mt={2}>Loading profile...</Typography>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
        <Typography color="error">Failed to load profile.</Typography>
      </Container>
    );
  }

  const imageUrl = userData.profileImage
    ? `http://127.0.0.1:5003/${userData.profileImage.replace(/\\/g, "/")}`
    : null;

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Typography variant="h4">User Profile</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>

      <StyledPaper elevation={3}>
        <AvatarWrapper>
          <Avatar
            src={imageUrl || undefined}
            sx={{
              width: 120,
              height: 120,
              fontSize: "3rem",
              backgroundColor: "primary.main"
            }}
          >
            {!imageUrl &&
              (userData.fullName
                ? userData.fullName.split(" ").map((n) => n[0]).join("")
                : userData.username[0].toUpperCase())}
          </Avatar>
          <UploadIconButton>
            <PhotoCamera fontSize="small" />
            <HiddenInput type="file" accept="image/*" onChange={handleImageChange} />
          </UploadIconButton>
        </AvatarWrapper>

        {Object.entries(userData)
          .filter(([field]) =>
            !["_id", "role", "createdAt", "updatedAt", "__v", "profileImage", "password"].includes(field)
          )
          .map(([field, value]) => (
            <FieldWrapper key={field}>
              <Box>
                <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </Box>
              <IconButton onClick={() => handleOpenModal(field, value)} color="primary" size="small">
                <EditIcon />
              </IconButton>
            </FieldWrapper>
          ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
          <Typography variant="subtitle1" color="textSecondary">Password</Typography>
          <Button variant="outlined" onClick={() => setOpenPasswordModal(true)}>
            Change Password
          </Button>
        </Box>
      </StyledPaper>

      {/* Modal to Edit Field */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Edit {editField}</Typography>
          <TextField
            fullWidth
            label={`New ${editField}`}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" onClick={handleFieldUpdate}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal to Change Password */}
      <Modal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>

          <TextField
            fullWidth
            label="Old Password"
            type={showPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handlePasswordChange}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserProfile;
