import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "../../features/alert/alert.action";
import {
  addCategory,
  getCategory,
  updateCategory,
} from "../../features/categories/categories.action";
import {
  CircularProgress,
  Typography,
  Grid,
  FormControl,
  TextField,
  Button,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import Alert from "../../components/Alert/Alert";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const CategoryForm = () => {
  let dispatch = useDispatch();

  const { category, loading } = useSelector((state) => state.categories);
  const location = useLocation();
  const styles = useStyles();
  const classes = useStyles();
  let { id } = useParams();
  const active_url = location.pathname.split("/");
  const [name, setname] = useState("");
  const [errortype, seterrortype] = useState("");
  const [errorMessage, seteerrorMessage] = useState("");
  const [error, seterror] = useState(false);

  function fetchMyAPI() {
    dispatch(getCategory(id));
  }

  useEffect(() => {
    if (id) {
      fetchMyAPI(id);
    }
  }, []);

  useEffect(() => {
    if (id) {
      setname(category[0].category_name);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      category_name: name,
    };
    if (!name) {
      dispatch(setAlertMessage("Please fill properly.", "error"));
      return;
    }
    if (id) {
      dispatch(updateCategory(body, id));
    } else {
      dispatch(addCategory(body));
      setname("");
    }
  };
  const handleChange = (name, value) => {
    if (name == "name") {
      setname(value);
    }
  };

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      padding: 20,
      fontWeight: "bold",
    }),
  };
  return (
    <div className="mainForm">
      <div className={classes.root}>
        {loading ? (
          <CircularProgress className="loader" />
        ) : (
          <>
            <Typography className={styles.heading2}>
              {active_url[2] == "add" ? "Add" : "Edit"} Category
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={styles.formControl}>
                  <TextField
                    id="outlined-uncontrolled"
                    variant="outlined"
                    value={name}
                    name={"name"}
                    label={"Name"}
                    placeholder={"Enter name"}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    // onBlur={() => validation("name", "name", name)}
                  />
                  <FormHelperText id="my-helper-text" className={styles.error}>
                    {errortype == "name" && errorMessage && errorMessage}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid container style={{ marginTop: 20 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ width: 180 }}
                >
                  Submit
                </Button>
              </Grid>
              <div className="alert-container" style={{ marginTop: 20 }}>
                <Alert />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 460,
    width: "max-width",
    backgroundColor: theme.palette.background.paper,
    paddingTop: 20,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 35,
    borderRadius: 20,
  },
  heading2: {
    fontWeight: "bold",
    fontSize: "22px",
    lineHeight: 1.2,
    color: "#2D1967",
    marginBottom: 20,
  },
  primary: {
    margin: "auto",
  },
  error: {
    color: "red",
  },
  formControl: {
    marginTop: theme.spacing(1),
    minWidth: 340,
  },
}));

export default CategoryForm;
