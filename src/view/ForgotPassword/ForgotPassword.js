import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forgetPassword } from "../../features/auth/auth.action";
import Alert from "../../components/Alert/Alert";
import { makeStyles } from "@material-ui/core";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const forgotPasswordHandler = () => {
    dispatch(forgetPassword(email));
  };

  return (
    <div className="signupcontainer">
      <div className="col1signup">
        <div className="signupform">
          <h2>Forgot Password</h2>
          <div
            className="alert-container"
            style={{ width: 330, marginBottom: 10 }}
          >
            <Alert />
          </div>
          <p className="forgotpassword__subtext">
            Please enter the email address you register your account with. We
            will send you reset password confirmation to this email.
          </p>
          <div className="inputphone">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              style={{ backgroundColor: "white" }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="createaccountbutton"
            style={{ color: "#fff", backgroundColor: "black" }}
            onClick={() => {
              forgotPasswordHandler();
            }}
          >
            Send password
          </button>
          <p className="check" id="check">
            Go back to Login?
            <Link to="/" style={{ color: "#1F1D61" }}>
              Click here
            </Link>
          </p>
        </div>
      </div>
      <div className="col2signup container">
        {/* <img src={cars} alt="" /> */}
        <div class="centered">
          <>
            <img src="assets/images/logo2.png" />
            <p>
              Signin for Deliver it mini as Admin and become
              <br />
              part of the family.
            </p>
          </>
        </div>
      </div>
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  heading2: {
    fontWeight: "bold",
    fontSize: "22px",
    lineHeight: 1.2,
    color: "#2D1967",
    textAlign: "center",
  },
}));
export default ForgotPassword;
