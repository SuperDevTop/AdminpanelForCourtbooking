import PropTypes from "prop-types";
import LockOpenIcon from "@heroicons/react/24/solid/LockOpenIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import Switch from "@mui/material/Switch";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  TextField,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useState } from "react";
import { useAdmin } from "src/hooks/use-admin";

import ConfirmationDialog from "src/components/confirmDialog";
import LoadingOverlay from "src/components/loadingOverlay";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import CustomAlert from "src/components/customAlert";

export const CourtCard = (props) => {
  const { court, avatarText } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [courtNameToBeChanged, setCourtNameToBeChanged] = useState("Stadium");
  const [courtBlockToBeChanged, setCourtBlockToBeChanged] = useState(false);
  const [adminOnlyCourt, setAdminOnlyCourt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameToBeDeleted, setNameToBeDeleted] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openFromToAlert, setOpenFromToAlert] = useState(false);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const admin = useAdmin();

  const handleSwitch = (name, blocked, adminOnly) => {
    if ((from === null && to !== null) || (from !== null && to === null)) {
      // if only one of two dates are selected
      setOpenFromToAlert(true);

      setTimeout(() => {
        setOpenFromToAlert(false);
      }, 2000);
      return;
    }

    setCourtNameToBeChanged(name);
    setDialogOpen(true);
    setCourtBlockToBeChanged(blocked);
    setAdminOnlyCourt(adminOnly);
  };

  const handleConfirmDialog = async () => {
    const data = {
      courtName: courtNameToBeChanged,
      blocked: courtBlockToBeChanged,
      forAdmin: adminOnlyCourt,
      blockingStartTime: from,
      blockingEndTime: to,
    };

    setIsSaving(true);
    await admin.updateCourt(data);
    setIsSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (name) => {
    setNameToBeDeleted(name);
    setOpenDeleteConfirm(true);
  };

  const handleDeleteConfirmDialog = async () => {
    const data = {
      name: nameToBeDeleted,
    };

    setIsDeleting(true);
    await admin.deleteCourt(data);
    setIsDeleting(false);
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
        text="Are you sure you want to change the status?"
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onConfirm={handleConfirmDialog}
      />
      <ConfirmationDialog
        text="Are you sure you want to delete the court?"
        open={openDeleteConfirm}
        onClose={() => {
          setOpenDeleteConfirm(false);
        }}
        onConfirm={handleDeleteConfirmDialog}
      />
      {isSaving && <LoadingOverlay text="Saving..." color="success" />}
      {isDeleting && <LoadingOverlay text="Deleting..." color="warning" />}

      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
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
        direction="column"
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
          <Switch
            checked={!court.blocked}
            onChange={() => {
              handleSwitch(court.name, !court.blocked, court.forAdmin);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Stack>
        <Stack alignItems="center" direction="column" spacing={1}>
          {!court.blocked && (
            <>
              <DateTimePicker
                label="from"
                value={from}
                onChange={(newValue) => {
                  setFrom(newValue);
                }}
                renderInput={(props) => {
                  return <TextField {...props} />;
                }}
              />
              <DateTimePicker
                label="to"
                value={to}
                onChange={(newValue) => {
                  setTo(newValue);
                }}
                renderInput={(props) => {
                  return <TextField {...props} />;
                }}
              />{" "}
            </>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Typography color="text.secondary" display="inline" variant="body2">
            Only Admin
          </Typography>
          <Switch
            checked={court.forAdmin}
            onChange={() => {
              handleSwitch(court.name, court.blocked, !court.forAdmin);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
          <SvgIcon
            color="action"
            fontSize="small"
            onClick={() => {
              handleDelete(court.name);
            }}
          >
            <TrashIcon />
          </SvgIcon>
        </Stack>
      </Stack>
      <CustomAlert
        openState={openFromToAlert}
        severity="warning"
        text="Please select two times correctly!"
      />
    </Card>
  );
};

CourtCard.propTypes = {
  court: PropTypes.object.isRequired,
};
