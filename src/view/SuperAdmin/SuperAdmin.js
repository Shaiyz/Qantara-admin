import React, { useEffect } from "react";
import SearchTable from "../../components/SearchTable/SearchTable";
import {
  getAllSuperAdminUsers,
  deleteAdminUser,
} from "../../features/admin/admin.action";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { ChangeHistory } from "@material-ui/icons";

import { Tooltip } from "@material-ui/core";
import "./Admin.css";
import { Link } from "react-router-dom";

const SuperAdmin = () => {
  let dispatch = useDispatch();
  const { superadmins, loading } = useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(getAllSuperAdminUsers());
  }, []);

  const deleteUser = (id) => {
    dispatch(deleteAdminUser(id));
  };
  const renderEditButton = (params) => {
    return (
      <Tooltip title="Edit Super Admin">
        <Link to={`/admin/edit/${params.edit}`}>
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
  const renderChangeButton = (params) => {
    return (
      <Tooltip title="Change Password">
        <Link to={`/changepassword/${params.change}`}>
          <ChangeHistory
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
        <Button onClick={() => deleteUser(params.action)}>
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

  const columns = [
    { field: "id", title: "S#", width: 200, sortable: false },
    {
      field: "email",
      title: "Email",
      sortable: false,
      width: 630,
    },
    {
      field: "createdAt",
      title: "Date Created",
      sortable: false,
      width: 630,
    },
    {
      field: "qantaraCode",
      title: "Q Code",
      sortable: false,
      width: 630,
    },
    {
      field: "updatedAt",
      title: "Date Updated",
      sortable: false,
      width: 630,
    },

    {
      field: "action",
      title: "Action",
      sortable: false,
      render: renderActionButton,
      width: 200,
    },
    {
      field: "edit",
      title: "Edit Info",
      sortable: false,
      render: renderEditButton,
      width: 200,
    },
    {
      field: "change",
      title: "Change Password",
      sortable: false,
      render: renderChangeButton,
      width: 200,
    },
  ];

  let rows = [];
  if (superadmins) {
    let s = 1;
    superadmins.forEach((user) => {
      rows.push({
        id: s++,
        email: user.email,
        qantaraCode: user.qantara_code,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "-",
        updatedAt: user.updatedAt
          ? new Date(user.updatedAt).toLocaleDateString()
          : "-",
        action: user._id,
        edit: user._id,
        change: user._id,
      });
    });
  }
  return (
    <div className="feature">
      <SearchTable
        rows={rows}
        columns={columns}
        header={"Super Admins"}
        path={"superadmins"}
        loading={loading}
      />
    </div>
  );
};

export default SuperAdmin;
