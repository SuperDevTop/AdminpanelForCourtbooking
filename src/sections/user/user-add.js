import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Grid, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import { Autocomplete } from "@mui/material";

import { useAdmin } from "src/hooks/use-admin";
import LoadingOverlay from "src/components/loadingOverlay";

export default function UserAdd({ open, setClose }) {
  const admin = useAdmin();
  const [isSaving, setIsSaving] = useState(false);

  const flatOptionProps = {
    options: ["admin", "booker"],
  };

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });

  const [role, setRole] = useState("booker");

  const onSave = async (event) => {
    event.preventDefault();
    if (values.password !== values.confirm) {
      alert("Password doesn't match!");
      return;
    }

    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: role,
    };

    setIsSaving(true);
    await admin.addUser(data);
    setIsSaving(false);

    setClose();
  };

  const handleChange = (event) => {
    setValues((previState) => ({
      ...previState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRole = (event, value) => {
    setRole(value);
  };

  return (
    <Dialog open={open} sx={{ marginTop: 2 }}>
      <DialogTitle sx={{ textAlign: "center" }}>Add User</DialogTitle>
      <DialogContent>
        <form onSubmit={onSave} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the email address"
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                required
                value={values.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the phone"
                label="Phone"
                name="phone"
                type="number"
                onChange={handleChange}
                required
                value={values.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the password"
                label="Password"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={values.password}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please confirm the password"
                label="Confirm the password"
                name="confirm"
                type="password"
                onChange={handleChange}
                required
                value={values.confirm}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Autocomplete
                  {...flatOptionProps}
                  id="role"
                  value={role}
                  // isOptionEqualToValue={(option, value) => {option === value}}
                  onChange={handleRole}
                  name="role"
                  renderInput={(params) => (
                    <TextField {...params} label="Role" variant="standard" />
                  )}
                />
              </Stack>
            </Grid>
            <Grid container display="flex" justifyContent="flex-end" spacing={1}>
              <Grid item>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={() => setClose()}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      {isSaving && <LoadingOverlay text='Saving...' color='success'/>}
    </Dialog>
  );
}
