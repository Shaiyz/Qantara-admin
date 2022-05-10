import React, { useEffect, useState } from "react";
import Table from "../../components/TableUsers/Table";
import { Grid, Tooltip, Chip, Switch } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import "./User.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import {
  getProducts,
  getProductsByStatus,
  updateProduct,
} from "../../features/products/product.action";

const AllProducts = () => {
  let dispatch = useDispatch();
  let location = useLocation();
  let history = useHistory();
  const styles = useStyles();
  const { products, loading } = useSelector((state) => state.products);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (location?.hash == "#active") {
      dispatch(getProductsByStatus(true));
      setValue(1);
    } else if (location?.hash == "#inactive") {
      dispatch(getProductsByStatus(false));
      setValue(2);
    } else if (location?.hash == "#all" || location?.hash == "") {
      dispatch(getProducts());
      setValue(0);
    }
  }, []);

  const getAll = () => {
    dispatch(getProducts());
    history.push(`/products#all`);
  };

  const getAllActiveProducts = () => {
    dispatch(getProductsByStatus(true));
    history.push(`/products#active`);
  };

  const getAllInactiveProducts = () => {
    dispatch(getProductsByStatus(false));
    history.push(`/products#inactive`);
  };

  const renderStatus = (params) => {
    return (
      <Chip
        variant="contained"
        className={
          params.status == "Active"
            ? styles.statusActive
            : styles.statusInActive
        }
        size="small"
        label={params.status}
      />
    );
  };
  const renderStatusButton = (params) => {
    return (
      <Switch
        checked={params.active.isActive}
        onChange={(e) => handleChange(e, params.active._id)}
        inputProps={{ "aria-label": "controlled" }}
      />
    );
  };

  const renderActionButton = (params) => {
    return (
      <Grid item xs={12}>
        <Tooltip title="View Details">
          <IconButton style={{ padding: 2 }}>
            <Link to={`/product/edit/${params.edit}`}>
              <EditIcon
                size={25}
                style={{
                  padding: 2,
                  border: "1px solid #1F1D61",
                  borderRadius: 8,
                  backgroundColor: "white",
                  color: "#1F1D61",
                }}
              />
            </Link>
          </IconButton>
        </Tooltip>
      </Grid>
    );
  };
  const handleChange = (e, id) => {
    dispatch(updateProduct({ isActive: e.target.checked }, id));
  };
  const columns = [
    { field: "id", title: "S#" },
    {
      field: "fullName",
      title: "Product name",
    },
    {
      field: "status",
      title: "Status",
      render: renderStatus,
    },
    {
      field: "createdAt",
      title: "Date Created",
    },
    {
      field: "updatedAt",
      title: "Date Updated",
    },
    {
      field: "active",
      title: "Change Status",
      sortable: false,
      render: renderStatusButton,
      width: 200,
    },
    {
      field: "edit",
      title: "Edit Info",
      sortable: false,
      render: renderActionButton,
      width: 200,
    },
  ];

  let rows = [];
  if (products && products.length > 0) {
    let s = 1;
    products.forEach((product) => {
      rows.push({
        id: s++,
        fullName: product.product_name,
        status: product.isActive ? "Active" : "Inactive",
        createdAt: product.createdAt
          ? new Date(product.createdAt).toLocaleDateString()
          : "-",
        updatedAt: product.updatedAt
          ? new Date(product.updatedAt).toLocaleDateString()
          : "-",
        edit: product._id,
        active: product,
      });
    });
  }
  return (
    <div className="users">
      <Table
        header={"Products"}
        path="product"
        loading={loading}
        columns={columns}
        rows={rows}
        value={value}
        setValue={setValue}
        getAllProducts={getAll}
        getAllInactive={getAllInactiveProducts}
        getAllActive={getAllActiveProducts}
      />
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  statusActive: {
    backgroundColor: "white",
    border: "1px solid #2eb85c",
    color: "#2eb85c",
    fontWeight: "bold",
  },
  statusInActive: {
    backgroundColor: "white",
    border: "1px solid #e55353",
    color: "#e55353",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#1F1D61",
    color: "white",
    border: "1px solid white",
    textTransform: "initial",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#1F1D61",
    },
  },
  tabs: {
    marginBottom: "2px",
  },
  tab: {
    fontSize: "12px",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
export default AllProducts;
