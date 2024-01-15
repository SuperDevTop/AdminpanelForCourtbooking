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
import PlayerEdit from "./player-edit";

export const PlayersTable = (props) => {
  const {
    count = 0,
    items = [],
    // onDeselectAll,
    // onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    // onSelectAll,
    // onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false); // dialog of deleting confirm
  const [nameToBeDeleted, setNameToBeDeleted] = useState("false");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({}); // The player to be edited
  const [dialogOpen1, setDialogOpen1] = useState(false); // player edit dialog

  // const selectedSome = selected.length > 0 && selected.length < items.length;
  // const selectedAll = items.length > 0 && selected.length === items.length;
  const admin = useAdmin();

  const onDelete = (name) => {
    setNameToBeDeleted(name);
    setDialogOpen(true);
  };

  const onEdit = async (player) => {
    player.password = "";
    player.confirm = "";
    setDialogOpen1(true);
    await setCurrentPlayer(player);
  };

  const handleConfirmDialog = async () => {
    const data = {
      name: nameToBeDeleted,
    };

    setIsDeleting(true); // show deleting progress
    await admin.deletePlayer(data);
    setIsDeleting(false); // close deleting progress
    setDialogOpen(false);
  };

  return (
    <Card>
      <ConfirmationDialog
        text="Are you sure you want to delete the user?"
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onConfirm={handleConfirmDialog}
      />
      <PlayerEdit
        open={dialogOpen1}
        setClose={() => {
          setDialogOpen1(false);
        }}
        player={currentPlayer}
      />
      {isDeleting && <LoadingOverlay text="Deleting..." color="warning" />}
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
                <TableCell padding="checkbox">No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Photo</TableCell>
                <TableCell>Nation</TableCell>
                <TableCell>ATP/WTA</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tournament Seed</TableCell>
                <TableCell>Right Handed</TableCell>
                <TableCell>Singles In</TableCell>
                <TableCell>Doubles In</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((player, index) => {
                const isSelected = selected.includes(player._id);
                const lastname = player.name.split(" ");
                player.image = "/images/players/" + lastname[lastname.length - 1] + ".jpg";

                return (
                  <TableRow
                    hover
                    key={player._id}
                    selected={isSelected}
                    sx={{
                      "& .MuiTableCell-root": {
                        textAlign: "center",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={player.image}>{getInitials(player.name)}</Avatar>
                      </Stack>
                    </TableCell>
                    <TableCell>{player.natl}</TableCell>
                    <TableCell>{player.atp_wta}</TableCell>
                    <TableCell>{player.rank}</TableCell>
                    <TableCell>{player.status}</TableCell>
                    <TableCell>{player.tournament_seed}</TableCell>
                    <TableCell>{player.right_handed ? "Yes" : "No"}</TableCell>
                    <TableCell>{player.singles_in ? "Yes" : "No"}</TableCell>
                    <TableCell>{player.doubles_in ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <>
                        <SvgIcon
                          fontSize="small"
                          color="action"
                          onClick={() => {
                            onDelete(player.name);
                          }}
                        >
                          <TrashIcon />
                        </SvgIcon>
                        <SvgIcon
                          fontSize="small"
                          color="action"
                          sx={{ marginLeft: 1 }}
                          onClick={() => {
                            onEdit(player);
                          }}
                        >
                          <PencilIcon />
                        </SvgIcon>
                      </>
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

PlayersTable.propTypes = {
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
