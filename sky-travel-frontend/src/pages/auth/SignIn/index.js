import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import CFWButton from "../../../components/form/CFWButton";
import CInputWithIcon from "../../../components/form/CInputWithIcon";
import Logo from "../../../components/general/Logo";
import { AIRLINE_USER } from "../../../helpers/variables";
import useAuth from "../../../hooks/useAuth";

const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { loginAirline, loginUser } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const isAirline = location.pathname.includes("airline");

  const submitHandler = async event => {
    event.preventDefault();

    try {
      const response = await (isAirline
        ? loginAirline({ ...user })
        : loginUser({ ...user }));

      if (response) {
        localStorage.setItem(AIRLINE_USER, JSON.stringify(response));
        isAirline
          ? navigate("/airline/dashboard")
          : navigate("/flightschedules");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const changeHandler = event => {
    const { value, name } = event.target;
    setUser(pS => ({
      ...pS,
      [name]: value,
    }));
  };

  const navigateToOtherUserPage = () =>
    navigate(
      location.pathname.includes("airline")
        ? "/auth/signin"
        : "/auth/airline/signin"
    );

  const navigateToRegister = () =>
    navigate(
      location.pathname.includes("airline")
        ? "/auth/airline/signup"
        : "/auth/signup"
    );

  return (
    <div className='signIn'>
      <img
        src={require("../../../assets/flyingPlane.png")}
        alt=''
        className='signIn--bg'
      />

      <div className='signIn__content'>
        <div className='signIn__box'>
          <Logo />
          <form onSubmit={submitHandler} className='signIn__box__form'>
            <CInputWithIcon
              icon='fa-solid fa-envelope'
              placeholder='Email'
              name='email'
              id='email'
              required={true}
              type='email'
              onChange={changeHandler}
            />
            <CInputWithIcon
              icon='fa-solid fa-lock'
              placeholder='Password'
              name='password'
              id='password'
              required={true}
              type='password'
              onChange={changeHandler}
            />
            <CFWButton
              title='Sign In'
              type='submit'
              style={{ marginTop: "0.5rem" }}
            />

            <div className='centered signIn__box__form__text'>
              Don't have an account?{" "}
              <span onClick={navigateToRegister}> Sign Up Now</span>
            </div>
          </form>
        </div>
        <div className='signIn__content__right'>
          <div>
            <h1>SKY TRAVEL</h1>
            <h2>is what every airline needs</h2>
          </div>
          <div className='signIn__content__righted'>
            <span>
              If you are{" "}
              {location.pathname.includes("airline") ? "user" : "airline"},{" "}
              <span onClick={navigateToOtherUserPage}>Click here</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
