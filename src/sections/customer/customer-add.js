import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";

export default function CustomAdd({ open, setClose }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });

  const onSave = () => {
    setClose();
  };

  const handleChange = (event) => {
    setValues((previState) => ({
      ...previsate,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid sx={12} md={6} spacing={5}>
            <TextField
              fullWidth
              helperText="Please specify the name"
              label="Name"
              name="name"
              onChange={handleChange}
              required
              value={values.name}
            />
          </Grid>
          <Grid sx={12} md={6}>
            <TextField
              fullWidth
              helperText="Please specify the email address"
              label="Email"
              name="email"
              onChange={handleChange}
              required
              value={values.email}
            />
          </Grid>
          <Grid sx={12} md={6}>
            <TextField
              fullWidth
              helperText="Please specify the phone"
              label="Phone"
              name="phone"
              onChange={handleChange}
              required
              value={values.phone}
            />
          </Grid>
          <Grid sx={12} md={6}>
            <TextField
              fullWidth
              helperText="Please specify the password"
              label="Password"
              name="password"
              onChange={handleChange}
              required
              value={values.password}
            />
          </Grid>
          <Grid sx={12} md={6}>
            <TextField
              fullWidth
              helperText="Please confirm the password"
              label="Confirm the password"
              name="confirm"
              onChange={handleChange}
              required
              value={values.confirm}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
