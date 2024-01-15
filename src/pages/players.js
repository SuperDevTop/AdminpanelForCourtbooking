import { useCallback, useMemo, useState, useRef } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  InputLabel,
  Input,
} from "@mui/material";

import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PlayersTable } from "src/sections/player/players-table";
import { PlayerScheduleTable } from "src/sections/player/playerSchedule-table";
import { PlayersSearch } from "src/sections/player/players-search";
import { applyPagination } from "src/utils/apply-pagination";
import { useAdminContext } from "src/contexts/admin-context";
import { useAdmin } from "src/hooks/use-admin";

import PlayerAdd from "src/sections/player/player-add";

const Page = () => {
  const { players, playerSchedule } = useAdminContext();
  const [openPlayerAddDialog, setOpenPlayerAddDialog] = useState(false);
  const admin = useAdmin();

  const usePlayers = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(players, page, rowsPerPage);
    }, [page, rowsPerPage, players]);
  };

  const usePlayerIds = (players) => {
    return useMemo(() => {
      return players.map((player) => player._id);
    }, [players]);
  };

  const usePlayerSchedule = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(playerSchedule, page, rowsPerPage);
    }, [page, rowsPerPage, playerSchedule]);
  };

  const usePlayerScheduleIds = (items) => {
    return useMemo(() => {
      return items.map((item) => item._id);
    }, [items]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const currenPlayers = usePlayers(page, rowsPerPage);
  const playersIds = usePlayerIds(currenPlayers);
  const playersSelection = useSelection(playersIds);
  
  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(10);
  const playerSchedule1 = usePlayerSchedule(page1, rowsPerPage1);
  const playerScheduleIds = usePlayerScheduleIds(playerSchedule1);
  const playerScheduleSelection = useSelection(playerScheduleIds);

  const fileInputRef = useRef(null);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handlePageChange1 = useCallback((event, value) => {
    setPage1(value);
  }, []);

  const handleRowsPerPageChange1 = useCallback((event) => {
    setRowsPerPage1(event.target.value);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("playerschedule", file);

    await admin.uploadPlayerschedule(formData);
  };

  return (
    <>
      <PlayerAdd open={openPlayerAddDialog} setClose={() => setOpenPlayerAddDialog(false)} />
      <Head>
        <title>Players | Court Booking</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Players</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    setOpenPlayerAddDialog(true);
                  }}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <PlayersSearch />
            <PlayersTable
              count={players.length}
              items={currenPlayers}
              onDeselectAll={playersSelection.handleDeselectAll}
              onDeselectOne={playersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={playersSelection.handleSelectAll}
              onSelectOne={playersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={playersSelection.selected}
            />
            
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Players Schedule</Typography>
              </Stack>
              <InputLabel htmlFor="file-input">
                <Input
                  id="file-input"
                  type="file"
                  sx={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e)}
                  ref={fileInputRef}
                />
              </InputLabel>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  Upload
                </Button>
              </div>
            </Stack>
            <PlayerScheduleTable
              count={playerSchedule.length}
              items={playerSchedule1}
              onDeselectAll={playerScheduleSelection.handleDeselectAll}
              onDeselectOne={playerScheduleSelection.handleDeselectOne}
              onPageChange={handlePageChange1}
              onRowsPerPageChange={handleRowsPerPageChange1}
              onSelectAll={playerScheduleSelection.handleSelectAll}
              onSelectOne={playerScheduleSelection.handleSelectOne}
              page={page1}
              rowsPerPage={rowsPerPage1}
              selected={playerScheduleSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
