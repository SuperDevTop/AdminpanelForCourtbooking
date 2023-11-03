import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { useAuthContext } from "src/contexts/auth-context";

export const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirm: "",
  });
  const [checkMatchPwd, setCheckMatchPwd] = useState("");
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const auth = useAuth();
  const { user } = useAuthContext();

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  useEffect(() => {
    if (values.password !== values.confirm && values.confirm !== "") {
      setCheckMatchPwd("The password doesn't match! ");
      setUpdateDisabled(true);
    } else {
      setCheckMatchPwd("");
      if (values.confirm !== "") {
        setUpdateDisabled(false);
      }
    }
  }, [values]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const updatePassword = () => {
    console.log(values.password);
    auth.updatePassword(values.password, user.email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="Password (Confirm)"
              name="confirm"
              onChange={handleChange}
              type="password"
              value={values.confirm}
            />
            <FormHelperText error>{checkMatchPwd}</FormHelperText>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={updatePassword} disabled={updateDisabled}>
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
