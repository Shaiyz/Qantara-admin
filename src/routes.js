import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from "./view/Admin/Admin";
import Customer from "./view/Users/Customer";
import { ChangePassword } from "./view";
import Navbar from "./components/Navbar/Navbar";
import PrivateRoute from "./routing/PrivateRoute";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminForm from "./view/Admin/AdminForm";
import SuperAdmin from "./view/SuperAdmin/SuperAdmin";
import { routes } from "./routing/SimpleRoutes";
import SuperAdminForm from "./view/SuperAdmin/SuperAdminForm";
import SubCategories from "./view/SubCategories/AllSubCategories";
import SubCategoryForm from "./view/SubCategories/SubcategoryForm";
import Categories from "./view/Categories/AllCategories";
import CategoryForm from "./view/Categories/CategoryForm";
import { Products } from "./view/Products";
import AddProduct from "./view/Products/AddProduct";
import EditProduct from "./view/Products/EditProduct";

function Routes() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const authenticated = useSelector((state) => state.auth.authenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const protectedRoutes = () => {
    return (
      <>
        <div style={{ display: "flex" }}>
          {authenticated && (
            <Sidebar
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}
          <div style={{ width: "100%" }}>
            {authenticated && (
              <>
                <Navbar handleDrawerToggle={handleDrawerToggle} />
                <div style={{ marginTop: "120px" }}></div>
              </>
            )}
            <Switch>
              <Route exact path="/admins" component={Admin} />
              <Route exact path="/admins/add" component={AdminForm} />
              <Route exact path="/admin/edit/:id" component={AdminForm} />
              <Route exact path="/superadmins" component={SuperAdmin} />
              <Route exact path="/superadmins/add" component={SuperAdminForm} />
              <Route
                exact
                path="/superadmin/edit/:id"
                component={SuperAdminForm}
              />
              <Route exact path="/products" component={Products} />
              <Route exact path="/product/add" component={AddProduct} />
              <Route exact path="/product/edit/:id" component={EditProduct} />

              <Route exact path="/categories" component={Categories} />
              <Route exact path="/category/edit/:id" component={CategoryForm} />
              <Route exact path="/category/add" component={CategoryForm} />
              <Route exact path="/subcategories" component={SubCategories} />
              <Route
                exact
                path="/subcategory/edit/:id"
                component={SubCategoryForm}
              />
              <Route
                exact
                path="/subcategory/add"
                component={SubCategoryForm}
              />
              <Route exact path="/product/add" component={Products} />
              <PrivateRoute
                path="/changepassword"
                exact
                component={ChangePassword}
              />
              <PrivateRoute
                path="/changepassword/:id"
                exact
                component={ChangePassword}
              />
              <Route exact path="/customers" component={Customer} />
            </Switch>
          </div>
        </div>
      </>
    );
  };
  return (
    <Router>
      {authenticated ? protectedRoutes() : routes()}

      {/* <Switch>
        <Route path="/" exact component={Login} />
      </Switch>
      <div style={{ display: "flex" }}>
        {authenticated && (
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
        <div style={{ width: "100%" }}>
          {authenticated && (
            <>
              <Navbar handleDrawerToggle={handleDrawerToggle} />
              <div style={{ marginTop: "120px" }}></div>
            </>
          )}

          <Switch>
            <Route exact path="/admins" component={Admin} />
            <Route exact path="/admins/add" component={AdminForm} />
            <Route exact path="/superadmins" component={SuperAdmin} />
            <Route exact path="/superadmins/add" component={AdminForm} />
            <Route exact path="/customers" component={Customer} />

            <PrivateRoute
              path="/changepassword"
              exact
              component={ChangePassword}
            />
          </Switch>
        </div>
      </div> */}
    </Router>
  );
}
export default Routes;
