import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Modal,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Stack,
  Grid,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { format } from "date-fns";
import { FaEye } from "react-icons/fa";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "80%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflow: "auto",
  padding: theme.spacing(4),
}));

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5003/api/orders/get-all-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      filterStatus === "all" ? true : order.status === filterStatus
    )
    .filter((order) => {
      const date = new Date(order.createdAt);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    })
    .map((order) => ({
      id: order._id,
      orderNumber: `ORD-${order._id.slice(-5).toUpperCase()}`,
      date: new Date(order.createdAt),
      total: order.total,
      status: order.status,
      items: order.items,
    }));

  const columns = [
    { field: "orderNumber", headerName: "Order Number", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => format(params.row.date, "MMM dd, yyyy"),
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => `$${params.row.total.toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          color={getStatusColor(params.row.status)}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => setSelectedOrder(params.row)}
            >
              <FaEye />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order History
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                fullWidth
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                fullWidth
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </Grid>
          </Grid>

          <DataGrid
            rows={filteredOrders}
            columns={columns}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{ minHeight: 400 }}
          />
        </Paper>

        <StyledModal open={Boolean(selectedOrder)} onClose={handleCloseModal}>
          <ModalContent>
            {selectedOrder && (
              <>
                <Typography variant="h6" gutterBottom>
                  Order Details - {selectedOrder.orderNumber}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Items
                    </Typography>
                    {selectedOrder.items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          borderBottom: "1px solid #eee",
                          pb: 1,
                        }}
                      >
                        <Box
                          component="img"
                          src={`http://127.0.0.1:5003/${item.product?.prodImage?.replace(/\\/g, "/")}`}
                          alt={item.product?.prodName}
                          sx={{
                            width: 64,
                            height: 64,
                            objectFit: "cover",
                            borderRadius: 1,
                            mr: 2,
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {item.product?.prodName || "Unknown Product"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} × ${item.product?.prodPrice?.toFixed(2) || "0.00"}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Status
                    </Typography>
                    <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} />
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Total: ${selectedOrder.total?.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Box>
              </>
            )}
          </ModalContent>
        </StyledModal>
      </Box>
    </Container>
  );
};

export default OrderHistory;
