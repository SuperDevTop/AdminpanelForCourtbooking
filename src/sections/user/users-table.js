import PropTypes from "prop-types";
import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon,
} from "@mui/material";

import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";

import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import ConfirmationDialog from "src/components/confirmDialog";
import { useAdmin } from "src/hooks/use-admin";
import LoadingOverlay from "src/components/loadingOverlay";
import UserEdit from "./user-edit";

export const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false); // delete confirm dialog
  const [emailToBeDeleted, setEmailToBeDeleted] = useState("false");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState({}); // The user to be edited
  const [dialogOpen1, setDialogOpen1] = useState(false); // user edit dialog

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const admin = useAdmin();

  const onDelete = (email) => {
    setEmailToBeDeleted(email);
    setDialogOpen(true);
  };

  const onEdit = async (user) => {
    user.password = "";
    user.confirm = "";
    setDialogOpen1(true);
    await setCurrentUser(user);
  };

  const handleConfirmDialog = async () => {
    const data = {
      email: emailToBeDeleted,
    };

    setIsDeleting(true); // show deleting progress
    await admin.deleteUser(data);
    setIsDeleting(false); // close deleting progress
    setDialogOpen(false);
  };

  return (
    <Card>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onConfirm={handleConfirmDialog}
        text='Are you sure you want to delete the player?'
      />
      <UserEdit
        open={dialogOpen1}
        setClose={() => {
          setDialogOpen1(false);
        }}
        user={currentUser}
      />
      {isDeleting && <LoadingOverlay text={"Deleting..."} color="warning" />}
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const isSelected = selected.includes(user._id);

                return (
                  <TableRow hover key={user._id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(user._id);
                          } else {
                            onDeselectOne?.(user._id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={user.avatar}>{getInitials(user.name)}</Avatar>
                        <Typography variant="subtitle2">{user.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.phone && user.phone}</TableCell>
                    <TableCell>
                      {user.role !== "superadmin" && (
                        <>
                          <SvgIcon
                            fontSize="small"
                            color="action"
                            onClick={() => {
                              onDelete(user.email);
                            }}
                          >
                            <TrashIcon />
                          </SvgIcon>
                          <SvgIcon
                            fontSize="small"
                            color="action"
                            sx={{ marginLeft: 1 }}
                            onClick={() => {
                              onEdit(user);
                            }}
                          >
                            <PencilIcon />
                          </SvgIcon>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
