import React, { useEffect, useState } from "react";
import Form from "../../components/Form/Form";
import {
  addSuperAdminUser,
  editSuperAdminUser,
} from "../../features/admin/admin.action";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { setAlertMessage } from "../../features/alert/alert.action";
import { useParams } from "react-router-dom";
const SuperAdminForm = () => {
  let dispatch = useDispatch();
  const { id } = useParams();
  const { superadmins, saved, loading } = useSelector((state) => state.admin);
  // const userRole = "superadmin";
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  let regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    if (id) {
      const adminToEdit = superadmins.filter((admin) => admin._id === id);
      setInputValue({
        ...inputValue,
        email: adminToEdit[0].email,
        first_name: adminToEdit[0].first_name,
        last_name: adminToEdit[0].last_name,
      });
    }
  }, []);

  const handleChange = (_name, value) => {
    setInputValue((prev) => ({
      ...prev,
      [_name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.email || !inputValue.first_name || !inputValue.last_name) {
      dispatch(setAlertMessage("Please fill properly.", "error"));
      return;
    }
    if (inputValue.email && !regEmail.test(inputValue.email)) {
      dispatch(setAlertMessage("Invalid Email", "error"));
      return;
    }

    if (id) {
      dispatch(
        editSuperAdminUser(
          {
            email: inputValue.email,
            first_name: inputValue.first_name,
            last_name: inputValue.last_name,
          },
          id
        )
      );
    } else {
      dispatch(
        addSuperAdminUser({
          email: inputValue.email,
          password: inputValue.password,
          first_name: inputValue.first_name,
          last_name: inputValue.last_name,
        })
      );
    }
  };

  if (saved == true) {
    return <Redirect to="/superadmins" />;
  }

  const inputFields = [
    {
      label: "First Name",
      type: "text",
      value: inputValue.first_name,
      name: "first_name",
      placeholder: "Enter First Name",
    },
    {
      label: "Last Name",
      type: "text",
      value: inputValue.last_name,
      name: "last_name",
      placeholder: "Enter Last Name",
    },
    {
      label: "Email",
      type: "email",
      value: inputValue.email,
      name: "email",
      placeholder: "Enter email here",
    },
  ];
  return (
    <>
      <div className="mainForm">
        <Form
          forminputs={inputFields}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          header="Super Admin User"
        />
      </div>
    </>
  );
};

export default SuperAdminForm;
