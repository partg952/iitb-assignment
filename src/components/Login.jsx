import React from "react";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import { createAppAuth, createOAuthUserAuth } from '@octokit/auth-oauth-app'
import { CLIENT_SECRET,CLIENT_ID } from "./secrets";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase";
import axios from "axios";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Login({ navHeader, setHeader }) {
  const auth = getAuth(app);
  const database = getDatabase( app );

  const history = useNavigate();
  useEffect(() => {
    setHeader("Login or SignUp");
  }, []);
  return (
    <div>
      <div id="github-login">
        <button
          onClick={() => {
            const provider = new GithubAuthProvider();
            signInWithPopup(auth, provider).then((user) => {
              console.log("user signed in ", user.user);
              if (user._tokenResponse.isNewUser) {
                set(ref(database, user.user.reloadUserInfo.screenName), {
                  username: user.user.reloadUserInfo.screenName,
                  email: user.user.email,
                  userImage: user.user.photoURL,
                }).then((response) => {
                  console.log( "user data saved!!" );
                } );
                window.location.href =
                  "https://github.com/login/oauth/authorize?client_id=Iv1.ee0fec2505c2b050";
                
              }
              else
              {
                history("/home")
              }
              
            });
          }}
        >
          Sign In Using Github{" "}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/GitHub_Mark.png"
            alt=""
            id="github-logo"
          />
        </button>
      </div>
    </div>
  );
}

export default Login;
