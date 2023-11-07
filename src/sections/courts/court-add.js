import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Grid, TextField } from "@mui/material";

import { useAdmin } from "src/hooks/use-admin";
import LoadingOverlay from "src/components/loadingOverlay";

export default function CourtAdd({ open, setClose }) {
  const admin = useAdmin();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async (event) => {
    event.preventDefault();

    const data = {
      name: name,
    };

    setIsSaving(true);
    await admin.addCourt(data);

    setIsSaving(false);
    setClose();
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Dialog open={open} sx={{ marginTop: 2 }}>
      {isSaving && <LoadingOverlay text={"Saving..."} color="success" />}
      <DialogTitle sx={{ textAlign: "center" }}>Add Court</DialogTitle>
      <DialogContent>
        <form onSubmit={onSave} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the name"
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={name}
              />
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
    </Dialog>
  );
}
