import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authenticated = useSelector((state) => state.auth.authenticated);
  console.log(authenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        !authenticated ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
// export const protectedRoutes = () => {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const authenticated = useSelector((state) => state.auth.authenticated);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };
//   return (
//     <>
//       <div style={{ display: "flex" }}>
//         {authenticated && (
//           <Sidebar
//             mobileOpen={mobileOpen}
//             handleDrawerToggle={handleDrawerToggle}
//           />
//         )}
//         <div style={{ width: "100%" }}>
//           {authenticated && (
//             <>
//               <Navbar handleDrawerToggle={handleDrawerToggle} />
//               <div style={{ marginTop: "120px" }}></div>
//             </>
//           )}
//           <Switch>
//             <Route exact path="/admins" component={Admin} />
//             <Route exact path="/admins/add" component={AdminForm} />
//             <Route exact path="/superadmins" component={SuperAdmin} />
//             <Route exact path="/superadmins/add" component={AdminForm} />
//             <Route exact path="/customers" component={Customer} />
//           </Switch>
//         </div>
//       </div>
//     </>
//   );
// };
