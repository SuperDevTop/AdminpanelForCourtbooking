import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Input,
  InputLabel,
} from "@mui/material";
import { useRef } from "react";

import { useAuthContext } from "src/contexts/auth-context";
import { useAuth } from "src/hooks/use-auth";

export const AccountProfile = () => {
  const { user } = useAuthContext();
  const auth = useAuth();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", user.email);

    await auth.uploadAvatar(formData);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={user ? user.avatar : "/assets/avatars/avatar-anika-visser.png"}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {user ? user.email : ""}
          </Typography>
          <InputLabel htmlFor="file-input">
            <Input
              id="file-input"
              type="file"
              sx={{ display: "none" }}
              onChange={(e) => handleFileUpload(e)}
              ref={fileInputRef}
            />
          </InputLabel>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" onClick={handleClick}>
          Change the avatar
        </Button>
      </CardActions>
    </Card>
  );
};
