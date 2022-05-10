import { ChangePassword } from "../view";
import { Login, codeLogin } from "../view/Login";
// import {codeLogin}
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../view/ForgotPassword";

export const routes = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/loginAdmin" exact component={codeLogin} />
        <Route path="/forgotpassword" exact component={ForgotPassword} />

        {/* <Route path="/signup" exact>
          <CreateAccount />
        </Route>
        <Route path="/reset-password" exact>
          <ForgetPassword />
        </Route>
        <Route path="/reset-account/:id/:token" exact>
          <RecoverAccountLink />
        </Route>
        <Route path="/logout" exact>
          <Logout />
        </Route>
        <Route>
          <Errorpage />
        </Route> */}
      </Switch>
    </>
  );
};
