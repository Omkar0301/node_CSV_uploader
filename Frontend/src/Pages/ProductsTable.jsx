import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { fetchProducts } from "../redux/productSlice";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";
import { fetchProductImage, resetImage } from "../redux/productImageSlice";

const ProductTable = () => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading, error } = useSelector((state) => state.products);
  const {
    image,
    loading: imageLoading,
    error: imageError,
  } = useSelector((state) => state.productImage);

  const fetchProductDetails = (product) => {
    setSelectedProduct(product.row);
    dispatch(fetchProductImage(product.id));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    dispatch(resetImage());
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      sortable: false,
      filterable: false,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      sortable: false,
      filterable: false,
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      sortable: false,
      filterable: false,
    },
    {
      field: "isAvailable",
      headerName: "Available",
      width: 150,
      type: "boolean",
      renderCell: (params) => {
        return params.value ? (
          <CheckCircle style={{ color: "green" }} />
        ) : (
          <Cancel style={{ color: "red" }} />
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "preview",
      headerName: "Preview",
      width: 150,
      renderCell: (params) => {
        return (
          <Visibility
            style={{
              cursor: "pointer",
              color: "#4a90e2",
              transition: "color 0.3s ease",
            }}
            onClick={() => fetchProductDetails(params)}
          />
        );
      },
      sortable: false,
      filterable: false,
    },
  ];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const rows = products?.map((product) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    isAvailable: product.isAvailable,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <div>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnSelector
          disableColumnFilter
          disableRowSelectionOnClick
          disableColumnMenu
          sx={{
            backgroundColor: "#1e1e2f",
            border: "1px solid #2c2c3c",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#3a3a4c",
              color: "#020202",
              borderBottom: "1px solid #3c3c4c",
            },
            "& .MuiDataGrid-cell": {
              color: "#e0e0e0",
              borderBottom: "1px solid #2c2c3c",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#2c2c3c",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#1e1e2f",
              color: "#ffffff",
            },
            "& .MuiPaginationItem-root, & .MuiTablePagination-root": {
              color: "#ffffff",
            },
          }}
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ textAlign: "center", color: "black" }}>
          Product Preview
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {imageLoading ? (
            <div>Loading image...</div>
          ) : imageError ? (
            <div>Error fetching image.</div>
          ) : image ? (
            <>
              <img
                src={image}
                alt="Product Preview"
                style={{ width: "100%", height: "200px", marginBottom: "16px" }}
              />
              {selectedProduct && (
                <Box>
                  <Typography variant="h6">
                    Name:- {selectedProduct.name}
                  </Typography>
                  <Typography variant="body1">
                    Description:- {selectedProduct.description}
                  </Typography>
                  <Typography variant="h6">
                    {" "}
                    Price:- ${selectedProduct.price}
                  </Typography>
                  <Typography variant="body2">
                    Category:- {selectedProduct.category}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <div>No image available</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
