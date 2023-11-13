import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Grid, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import { Autocomplete } from "@mui/material";

import { useAdmin } from "src/hooks/use-admin";
import LoadingOverlay from "src/components/loadingOverlay";

export default function PlayerAdd({ open, setClose }) {
  const admin = useAdmin();
  const [isSaving, setIsSaving] = useState(false);

  const [values, setValues] = useState({
    name: "",
    natl: "",
    atp_wta: "",
    rank: "",
    status: "",
    tournament_seed: ""
  });

  const onSave = async (event) => {
    event.preventDefault();

    const data = {
      name: values.name,
      natl: values.natl,
      atp_wta: values.atp_wta,
      rank: values.rank,
      status: values.status,
      tournament_seed: values.tournament_seed,
    };

    console.log(values.rank);

    setIsSaving(true);
    await admin.addPlayer(data);
    setIsSaving(false);

    setClose();
  };

  const handleChange = (event) => {
    setValues((previState) => ({
      ...previState,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Dialog open={open} sx={{ marginTop: 2 }}>
      <DialogTitle sx={{ textAlign: "center" }}>Add Player</DialogTitle>
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
                helperText="Please specify the nation"
                label="Nation"
                name="natl"
                onChange={handleChange}
                required
                value={values.natl}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the ATP/WTA"
                label="ATP/WTA"
                name="atp_wta"
                onChange={handleChange}
                required
                value={values.atp_wta}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the rank"
                label="Rank"
                name="rank"
                onChange={handleChange}
                required
                type="number"
                value={values.rank}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please confirm the status"
                label="Status"
                name="status"
                onChange={handleChange}
                required
                value={values.status}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please confirm the status"
                label="Tournament Seed"
                name="tournament_seed"
                type="number"
                onChange={handleChange}
                required
                value={values.tournament_seed}
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
      {isSaving && <LoadingOverlay text='Saving...' color='success'/>}
    </Dialog>
  );
}
