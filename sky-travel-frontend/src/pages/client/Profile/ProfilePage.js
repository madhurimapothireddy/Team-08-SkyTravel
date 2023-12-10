// ProfilePage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Avatar,
  Typography,
} from "@mui/material";

const ProfilePage = () => {
    const userId = localStorage.getItem("userEmail");
    console.log(userId)
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    phone: "",
    image: "",
    password: "", // Include password field
  });

  const [readOnlyFields, setReadOnlyFields] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/details/${userId}`);
        setUser(response.data.user);
        console.log(user)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFieldChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const updateFields = {};

      // Update only the fields that are not empty
      for (const key in user) {
        if (user[key] !== "" && key !== "confirmPassword") {
          updateFields[key] = user[key];
        }
      }

      // Add a check for password and confirmPassword matching if the password is being updated
      if (user.password && user.password !== user.confirmPassword) {
        alert("Password and Confirm Password do not match!");
        return;
      }

      await axios.put(`http://localhost:5000/api/user/${userId}`, updateFields);
      setReadOnlyFields(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleImageClick = () => {
    // Implement image update logic here (open file input or use an image upload component)
    console.log("Image clicked");
  };

  return (
    <Container>
      <Avatar
        alt="User Image"
        src={user.image}
        sx={{ width: 100, height: 100, cursor: "pointer" }}
        onClick={handleImageClick}
      />
      <Typography variant="h6">Username: {user.username}</Typography>
      <TextField
        label="Email"
        value={user.email}
        onChange={(e) => handleFieldChange("email", e.target.value)}
        fullWidth
        disabled={readOnlyFields}
      />
      <TextField
        label="Name"
        value={user.name}
        onChange={(e) => handleFieldChange("name", e.target.value)}
        fullWidth
        disabled
      />
      <TextField
        label="Phone"
        value={user.phone}
        onChange={(e) => handleFieldChange("phone", e.target.value)}
        fullWidth
        disabled={readOnlyFields}
      />
      {/* <TextField
        label="Password"
        type="password"
        value={user.password}
        onChange={(e) => handleFieldChange("password", e.target.value)}
        fullWidth
        disabled={readOnlyFields}
      />
      {/* New field for confirming the password */}
      {/* <TextField
        label="Confirm Password"
        type="password"
        value={user.confirmPassword}
        onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
        fullWidth
        disabled={readOnlyFields}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateProfile}
        disabled={readOnlyFields}
      >
        Update Profile
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setReadOnlyFields((prev) => !prev)}
      >
        {readOnlyFields ? "Enable Edit" : "Disable Edit"}
      </Button> */} 
    </Container>
  );
};

export default ProfilePage;
