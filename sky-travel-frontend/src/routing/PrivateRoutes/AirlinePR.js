import React from "react";
import { Navigate } from "react-router";
import { AIRLINE_USER } from "../../helpers/variables";

const AirlinePR = ({ children }) => {
  const user = JSON.parse(localStorage.getItem(AIRLINE_USER));
  if (user?.userType === "airline") {
    return children;
  }
  return <Navigate to='/auth/airline/signin' />;
};

export default AirlinePR;
