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
  deleteSubCategory,
  getSubCategorys,
  updateSubCategory,
} from "../../features/subcategories/subcategories.action";

const SubCategories = () => {
  let dispatch = useDispatch();
  const { subcategorys, loading } = useSelector((state) => state.subCategories);
  useEffect(() => {
    dispatch(getSubCategorys());
  }, []);

  const deleteCategory = (id) => {
    dispatch(deleteSubCategory(id));
  };

  const renderEditButton = (params) => {
    return (
      <Tooltip title="Edit Admin">
        <Link to={`/subcategory/edit/${params.edit}`}>
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

  const renderStatusButton = (params) => {
    return (
      <Switch
        checked={params.active.isActive}
        onChange={(e) => handleChange(e, params.active._id)}
        inputProps={{ "aria-label": "controlled" }}
      />
    );
  };
  const handleChange = (e, id) => {
    dispatch(updateSubCategory({ isActive: e.target.checked }, id));
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
  if (subcategorys) {
    let s = 1;
    subcategorys.forEach((subcategory) => {
      rows.push({
        id: s++,
        name: subcategory.subcategory_name,
        status: subcategory.isActive ? "Active" : "In active",
        createdAt: subcategory.createdAt
          ? new Date(subcategory.createdAt).toLocaleDateString()
          : "-",
        updatedAt: subcategory.updatedAt
          ? new Date(subcategory.updatedAt).toLocaleDateString()
          : "-",
        active: subcategory,
        action: subcategory._id,
        edit: subcategory._id,
      });
    });
  }

  return (
    <div className="feature">
      <SearchTable
        rows={rows}
        columns={columns}
        header={"Sub categories"}
        path={"subcategory"}
        loading={loading}
      />
    </div>
  );
};

export default SubCategories;
