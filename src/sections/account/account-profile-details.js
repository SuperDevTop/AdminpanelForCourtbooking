import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { useAuthContext } from "src/contexts/auth-context";
import { useAuth } from "src/hooks/use-auth";
import LoadingOverlay from "src/components/loadingOverlay";

const roles = [
  {
    value: "booker",
    label: "booker",
  },
  {
    value: "admin",
    label: "admin",
  },
];

export const AccountProfileDetails = () => {
  const { user } = useAuthContext();
  const [values, setValues] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const auth = useAuth();

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const data = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
      };

      try {
        setIsSaving(true);
        await auth.updateUser(data);
        setIsSaving(false);
      } catch (error) {
        console.log(error);
      }
    },
    [values]
  );

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      {isSaving && <LoadingOverlay text={"Saving..."} color="success" />}
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={user ? values.name : ""}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={user ? values.email : ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={user ? values.phone : ""}
                />
              </Grid>
              {/* <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Select Role"
                  name="role"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={user ? values.role : ""}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </TextField>
              </Grid> */}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" sx={{ margin:2 }}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
