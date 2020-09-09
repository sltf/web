import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { login, logout } from "../redux";
import { Button } from "@material-ui/core";
import Config from "../../Config";

const GoogleAuth = ({ dispatch, isSignedIn, userId }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const params = {
      clientId:
        Config.CLIENT_ID,
      scope: "openid",
    };

    window.gapi.load("client:auth2", () => {
      window.gapi.client.init(params).then(() => {
        setAuth(window.gapi.auth2.getAuthInstance());
        onAuthChange(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(onAuthChange);
      });
    });
  }, []);

  const onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      dispatch(
        login(
          window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getBasicProfile()
            .getEmail(),
          window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse().id_token
        )
      );
    } else {
      dispatch(logout());
    }
  };

  const onSignInClick = () => {
    auth.signIn();
  };

  const onSignOutClick = () => {
    auth.signOut();
  };

  const renderAuthButton = () => {
    if (isSignedIn === null) {
      return null;
    } else if (isSignedIn) {
      return (
        <div>
          <span>Logged in as : {userId} </span>
          <Button
            color="secondary"
            variant="contained"
            onClick={onSignOutClick}
          >
            Logout
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            You should be logged in to request data changes or vote changes
            requested by others. Your email or any other detail won't be shown
            publicly nor shared with anyone.
          </p>
          <Button color="primary" onClick={onSignInClick}>
            Sign In with Google
          </Button>
        </div>
      )
    }
  };

  return <div>{renderAuthButton()}</div>;
};

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isLoggedIn, userId: state.auth.userId };
};

export default connect(mapStateToProps)(GoogleAuth);
