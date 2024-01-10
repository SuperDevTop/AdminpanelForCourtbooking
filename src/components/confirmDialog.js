import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, SvgIcon } from "@mui/material";
import InformationCircleIcon from "@heroicons/react/24/solid/LockClosedIcon";

function ConfirmationDialog({ text, open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Dialog</DialogTitle>
      <DialogContent sx={{ display: "flex", alignItems: "center" }}>
        <SvgIcon color="action" fontSize="small" sx={{ marginRight: 2 }}>
          <InformationCircleIcon />
        </SvgIcon>
        {text}
      </DialogContent>
      <DialogActions sx={{ marginRight: 2, marginBottom: 1.5 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
