import PropTypes from "prop-types";
import LockOpenIcon from "@heroicons/react/24/solid/LockOpenIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "src/components/confirmDialog";
import { useState } from "react";

import { useAdmin } from "src/hooks/use-admin";

export const CourtCard = (props) => {
  const { court, avatarText } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [courtNameToBeChanged, setCourtNameToBeChanged] = useState("Stadium");
  const [courtBlockToBeChanged, setCourtBlockToBeChanged] = useState(false);
  const admin = useAdmin();

  const handleSwitch = (name, blocked) => {
    setCourtNameToBeChanged(name);
    setDialogOpen(true);
    setCourtBlockToBeChanged(!blocked)
  };

  const handleConfirmDialog = async () => {
    const data = {
      courtName: courtNameToBeChanged,
      blocked: courtBlockToBeChanged,
    };

    await admin.updateCourt(data);
    setDialogOpen(false)
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onConfirm={handleConfirmDialog}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        >
          <Avatar sx={{ bgcolor: deepPurple[500] }}>{avatarText}</Avatar>
        </Box>
        <Typography align="center" gutterBottom variant="h5">
          {court.name}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          {court.blocked ? (
            <>
              <SvgIcon color="action" fontSize="small">
                <LockClosedIcon />
              </SvgIcon>
              <Typography color="text.secondary" display="inline" variant="body2">
                Blocked
              </Typography>
            </>
          ) : (
            <>
              <SvgIcon color="action" fontSize="small">
                <LockOpenIcon />
              </SvgIcon>
              <Typography color="text.secondary" display="inline" variant="body2">
                Active
              </Typography>
            </>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Switch
            checked={!court.blocked}
            onChange={() => {
              handleSwitch(court.name, court.blocked);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

CourtCard.propTypes = {
  court: PropTypes.object.isRequired,
};
