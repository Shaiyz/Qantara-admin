import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "../../features/alert/alert.action";
import { getCategorys } from "../../features/categories/categories.action";
import Select from "react-select";
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
import {
  addSubCategory,
  getSubCategory,
  updateSubCategory,
} from "../../features/subcategories/subcategories.action";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Redirect } from "react-router-dom";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    padding: 20,
    fontWeight: "bold",
  }),
};

const SubCategoryForm = () => {
  let dispatch = useDispatch();
  const { saved, subcategorys, subcategory, loading } = useSelector(
    (state) => state.subCategories
  );
  const { categorys } = useSelector((state) => state.categories);
  const location = useLocation();
  const styles = useStyles();
  const classes = useStyles();
  let { id } = useParams();
  const active_url = location.pathname.split("/");
  const [name, setname] = useState("");
  const [category, setcategory] = useState("");
  const [errortype, seterrortype] = useState("");
  const [errorMessage, seteerrorMessage] = useState("");
  const [error, seterror] = useState(false);
  // const [subcategory, setSubCategory] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchMyAPI(id);
    }
  }, []);

  useEffect(() => {
    if (subcategory.length > 0) {
      const category = {
        value: subcategory[0].category_name?._id,
        label: subcategory[0].category_name?.category_name,
      };
      setname(subcategory[0].subcategory_name);
      setcategory(category);
    }
  }, [subcategory]);

  function fetchMyAPI() {
    // setSubCategory(subcategorys.filter((i) => i._id === id));/
    dispatch(getSubCategory(id));
  }
  function fetchCategories() {
    dispatch(getCategorys());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      subcategory_name: name,
      category_name: category.value,
    };
    if (!name || !category) {
      dispatch(setAlertMessage("Please fill properly.", "error"));
      return;
    }
    if (id) {
      dispatch(updateSubCategory(body, id));
    } else {
      dispatch(addSubCategory(body));
      setname("");
      setcategory(category);
    }
  };
  const handleChange = (name, value) => {
    if (name == "name") {
      setname(value);
    } else if (name == "category") {
      setcategory(value);
    }
  };

  const handleChangeBrand = (event) => {
    if (!event) return;
    setcategory(event);
  };

  const optionsBrand = [];
  categorys.forEach((res) => {
    optionsBrand.push({ value: res._id, label: res.category_name });
  });
  const validation = (type, name, value) => {
    if (type == "name") {
      if (!value.match(/^([a-zA-Z0-9 _-]+)$/) || value.length > 200) {
        seteerrorMessage("Only letters allowed.");
        setname("");
        seterror(true);
        seterrortype("name");
      } else {
        seteerrorMessage("");
        seterror(false);
      }
    }
  };
  if (active_url[2] == "edit" && category == "" && subcategory.length > 0) {
    const _category = {
      value: subcategory[0].category_name?._id,
      label: subcategory[0].category_name?.category_name,
    };
    setcategory(_category);
  }

  return (
    <div className="mainForm">
      <div className={classes.root}>
        {loading ? (
          <CircularProgress className="loader" />
        ) : (
          <>
            <Typography className={styles.heading2}>
              {active_url[2] == "add" ? "Add" : "Edit"} Sub Category
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={styles.formControl}>
                  <TextField
                    id="outlined-uncontrolled"
                    variant="outlined"
                    value={name}
                    type='text'
                    name={"name"}
                    label={"Name"}
                    placeholder={"Enter name"}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    onBlur={() => validation("name", "name", name)}
                  />
                  <FormHelperText id="my-helper-text" className={styles.error}>
                    {errortype == "name" && errorMessage && errorMessage}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} className={styles.formControl}>
                <Select
                  onChange={(e) => handleChangeBrand(e)}
                  className="basic-single"
                  classNamePrefix="Select Category"
                  isClearable={true}
                  isSearchable={true}
                  options={optionsBrand}
                  defaultValue={category}
                  placeholder="Select Category"
                  styles={customStyles}
                />
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

export default SubCategoryForm;
