import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CourtCard } from "src/sections/courts/court-card";
import { CompaniesSearch } from "src/sections/courts/courts-search";
import { useAdminContext } from "src/contexts/admin-context";
import CourtAdd from "src/sections/courts/court-add";
import { useEffect, useState } from "react";

const Page = () => {
  const { courts } = useAdminContext();
  const [displayedCourts, setDisplayedCourts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationCount, setPaginationCount] = useState(3);

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    setPaginationCount(Math.ceil(courts.length/9))
    setDisplayedCourts(courts.slice((page - 1) * 9, (page - 1) * 9 + 9))
  }, [page, courts])

  return (
    <>
      <Head>
        <title>Courts | Court Booking</title>
      </Head>
      <CourtAdd
        open={openAddDialog}
        setClose={() => {
          setOpenAddDialog(false);
        }}
      />
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
                <Typography variant="h4">Courts</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
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
                    setOpenAddDialog(true);
                  }}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CompaniesSearch />
            <Grid container spacing={3}>
              {displayedCourts.map((court, index) => (
                <Grid xs={12} md={6} lg={4} key={court._id}>
                  <CourtCard court={court} avatarText={index + 1 + (page - 1) * 9} />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={paginationCount}
                size="small"
                page={page}
                onChange={handlePagination}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
