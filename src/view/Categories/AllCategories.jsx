import React, { useEffect } from "react";
import SearchTable from "../../components/SearchTable/SearchTable";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Switch, Tooltip } from "@material-ui/core";
import "./Admin.css";
import { Link } from "react-router-dom";
import {
  getCategorys,
  updateCategory,
} from "../../features/categories/categories.action";

const Categories = () => {
  let dispatch = useDispatch();

  const { categorys, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategorys());
  }, []);

  const deleteCategory = (id) => {
    dispatch(deleteCategory(id));
  };

  const renderEditButton = (params) => {
    return (
      <Tooltip title="Edit Admin">
        <Link to={`/category/edit/${params.edit}`}>
          <EditIcon
            className="action-buttons"
            color="secondary"
            fontSize="medium"
            style={{
              padding: 2,
              border: "1px solid #F50057",
              borderRadius: 8,
              backgroundColor: "white",
              color: "#F50057",
            }}
          />
        </Link>
      </Tooltip>
    );
  };

  const renderActionButton = (params) => {
    return (
      <Tooltip title="Delete">
        <Button
          onClick={() => {
            deleteCategory(params.action);
          }}
        >
          <DeleteIcon
            className="action-buttons"
            color="secondary"
            fontSize="medium"
            style={{
              padding: 2,
              border: "1px solid #F50057",
              borderRadius: 8,
              backgroundColor: "white",
              color: "#F50057",
            }}
          />
        </Button>
      </Tooltip>
    );
  };

  const handleChange = (e, id) => {
    dispatch(updateCategory({ isActive: e.target.checked }, id));
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
  const columns = [
    { field: "id", title: "S#", width: 200, sortable: false },
    {
      field: "name",
      title: "Category Name",
      sortable: false,
      width: 630,
    },
    {
      field: "status",
      title: "Status",
      sortable: false,
      width: 630,
    },
    {
      field: "action",
      title: "Delete",
      sortable: false,
      render: renderActionButton,
      width: 200,
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
      render: renderEditButton,
      width: 200,
    },
  ];

  let rows = [];
  if (categorys) {
    let s = 1;
    categorys.forEach((category) => {
      rows.push({
        id: s++,
        name: category.category_name,
        status: category.isActive ? "Active" : "In active",
        createdAt: category.createdAt
          ? new Date(category.createdAt).toLocaleDateString()
          : "-",
        updatedAt: category.updatedAt
          ? new Date(category.updatedAt).toLocaleDateString()
          : "-",
        active: category,
        action: category._id,
        edit: category._id,
      });
    });
  }

  return (
    <div className="feature">
      <SearchTable
        rows={rows}
        columns={columns}
        header={"Categories"}
        path={"category"}
        loading={loading}
      />
    </div>
  );
};

export default Categories;
