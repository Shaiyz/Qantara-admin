import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import { Grid, Tabs, Tab, CircularProgress } from "@material-ui/core";
import Alert from "../Alert/Alert";
import icons from "../SearchTable/icons";
import MaterialTable from "material-table";
import "./Table.css";

const TableProducts = ({
  header,
  loading,
  rows,
  columns,
  getAllProducts,
  getAllInactive,
  getAllActive,
  value,
  setValue,
}) => {
  const styles = useStyles();
  let location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid item xs={12}>
      <div className="table">
        <div className="table__head">
          <Grid container>
            <Grid item xs={8}>
              <h2 className={styles.heading2}>{header}</h2>
            </Grid>
            <Link to={`/product/add`} style={{ textDecoration: "none" }}>
              <Button
                className={styles.btn}
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add New {header}
              </Button>
            </Link>
          </Grid>
        </div>
        <div className="alert-container">
          <Alert />
        </div>

        <div style={{ width: "100%" }}>
          {loading ? (
            <CircularProgress className="loader" />
          ) : (
            <MaterialTable
              title={
                <Tabs
                  className={styles.tabs}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  value={value}
                  onChange={handleChange}
                >
                  <Tab
                    className={styles.tab}
                    value={0}
                    label={`All ${header}`}
                    onClick={() => getAllProducts()}
                  />
                  <Tab
                    className={styles.tab}
                    value={1}
                    label="Active"
                    onClick={() => getAllActive("Active")}
                  />
                  <Tab
                    className={styles.tab}
                    value={2}
                    label="Inactive"
                    onClick={() => getAllInactive()}
                  />
                </Tabs>
              }
              icons={icons}
              data={rows}
              columns={columns}
              options={{
                search: true,
                pageSize: 100,
                pageSizeOptions: [5, 20, 50, 100],
                paginationType: "stepped",
                headerStyle: {
                  fontWeight: "bold",
                },
                rowStyle: {
                  fontSize: 14,
                  color: "#604339",
                  letterSpacing: "0.5px",
                },
              }}
            />
          )}
        </div>
      </div>
    </Grid>
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

export default TableProducts;
