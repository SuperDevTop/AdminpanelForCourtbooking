import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { secondsToHours, subDays, subHours } from "date-fns";
// import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
// import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";

import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "src/sections/user/users-table";
import { UsersSearch } from "src/sections/user/users-search";
import { applyPagination } from "src/utils/apply-pagination";
import { useAdminContext } from "src/contexts/admin-context";
import UserAdd from "src/sections/user/user-add";
import { useAuthContext } from "src/contexts/auth-context";

const Page = () => {
  const { user } = useAuthContext();
  const { users } = useAdminContext();

  const [customDialogOpen, setCutomDialogOpen] = useState(false);

  const useCustomers = (page, rowsPerPage) => {
    const updatedUsers = users && user && users.filter((one) => one.email !== user.email);

    return useMemo(() => {
      return applyPagination(updatedUsers, page, rowsPerPage);
    }, [page, rowsPerPage, users]);
  };

  const useCustomerIds = (customers) => {
    return useMemo(() => {
      return customers.map((customer) => customer.id);
    }, [customers]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <UserAdd open={customDialogOpen} setClose={() => setCutomDialogOpen(false)} />
      <Head>
        <title>Users | Court Booking</title>
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
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    setCutomDialogOpen(true);
                  }}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <UsersSearch />
            <UsersTable
              count={customers.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
