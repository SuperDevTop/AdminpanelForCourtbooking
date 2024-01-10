import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Grid, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import { Autocomplete } from "@mui/material";

import LoadingOverlay from "src/components/loadingOverlay";
import { useAdmin } from "src/hooks/use-admin";

export default function PlayerEdit({ open, setClose, player }) {
  const admin = useAdmin();

  const [values, setValues] = useState({});

  useEffect(() => {
    setValues(player);
  }, [player]);

  const [isSaving, setIsSaving] = useState(false);

  const onSave = async (event) => {
    event.preventDefault();

    const data = {
      name: values.name,
      natl: values.natl,
      rank: values.rank,
      status: values.status,
      atp_wta: values.atp_wta,
      tournament_seed: values.tournament_seed,
      right_handed: values.right_handed,
      singles_in: values.singles_in,
      doubles_in: values.doubles_in
    };

    setIsSaving(true)
    await admin.updatePlayer(data);
    setIsSaving(false)

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
      <DialogTitle sx={{ textAlign: "center" }}>Edit Player</DialogTitle>
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
                InputProps={{ 
                  readOnly: true
                 }}
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
                helperText="Please specify the rank"
                label="Rank"
                name="rank"
                type="number"
                onChange={handleChange}
                required
                value={values.rank}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the status"
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
                helperText="Please specify the tournament seed"
                label="Tournament Seed"
                name="tournament_seed"
                onChange={handleChange}
                required
                value={values.tournament_seed}
 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the right handed"
                label="Right Handed"
                name="right_handed"
                onChange={handleChange}
                required
                value={values.right_handed}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the singles in"
                label="Singles In"
                name="singles_in"
                onChange={handleChange}
                required
                value={values.singles_in}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                helperText="Please specify the doubles in"
                label="Doubles In"
                name="doubles_in"
                onChange={handleChange}
                required
                value={values.doubles_in}
              />
            </Grid>
            
            {/* <Grid item xs={12} md={6}>
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
            </Grid> */}
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

      {isSaving && <LoadingOverlay text='Updating...' color='success'/>}
    </Dialog>
  );
}
