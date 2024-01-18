import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";
import { useAdmin } from "src/hooks/use-admin";

export const PlayerScheduleTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const admin = useAdmin();

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
                <TableCell padding="checkbox">No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Player</TableCell>
                <TableCell>Court</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Round</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                return (
                  <TableRow
                    hover
                    key={item._id}
                    sx={{
                      "& .MuiTableCell-root": {
                        textAlign: "center",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">{index + 1}</TableCell>
                    <TableCell>
                      {new Date(item.date).getMonth() + 1} / {new Date(item.date).getDate()}
                    </TableCell>
                    <TableCell>{item.player}</TableCell>
                    <TableCell>{item.court}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.round}</TableCell>
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

PlayerScheduleTable.propTypes = {
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
};
