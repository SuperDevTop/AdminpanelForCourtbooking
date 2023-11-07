import PropTypes from "prop-types";
import LockOpenIcon from "@heroicons/react/24/solid/LockOpenIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "src/components/confirmDialog";
import { useState } from "react";

import { useAdmin } from "src/hooks/use-admin";
import LoadingOverlay from "src/components/loadingOverlay";

export const CourtCard = (props) => {
  const { court, avatarText } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [courtNameToBeChanged, setCourtNameToBeChanged] = useState("Stadium");
  const [courtBlockToBeChanged, setCourtBlockToBeChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const admin = useAdmin();

  const handleSwitch = (name, blocked) => {
    setCourtNameToBeChanged(name);
    setDialogOpen(true);
    setCourtBlockToBeChanged(!blocked);
  };

  const handleConfirmDialog = async () => {
    const data = {
      courtName: courtNameToBeChanged,
      blocked: courtBlockToBeChanged,
    };

    setIsSaving(true);
    await admin.updateCourt(data);
    setIsSaving(false);
    setDialogOpen(false);
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
      {isSaving && <LoadingOverlay text={"Saving..."} color="success" />}

      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: 'column',
          }}
        >
          <Avatar sx={{ bgcolor: deepPurple[500] }}>{avatarText}</Avatar>
          <Typography align="center" gutterBottom variant="h5" paddingTop={3} paddingBottom={2}>
            {court.name}
          </Typography>
          <SvgIcon color="action" fontSize="small">
            <UserGroupIcon />
          </SvgIcon>
        </Box>
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
