import React from 'react'
import './Navbar.scss';
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from 'react';
import { getAuth,signOut } from 'firebase/auth';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';
function Navbar ( {navHeader} )
{
    // const [imageVisibility,setImageVisibility] = useState("hidden")
    const history = useNavigate();
    function returnDisplay ()
    {
        if ( window.location.pathname != '/' )
        {
            return 'flex';
        }
        else
        {
            return 'none';
        }
    }
    const auth = getAuth( app );
    if ( auth.currentUser != null )
    {
        console.log("user-signed in")
    }
    return (
      <div>
        <nav>
          <span>
            <h2 onClick={()=>{history("/home")}}>Udaan</h2>
            <h3>{navHeader}</h3>
          </span>
          <span
            style={{
              display: returnDisplay(),
            }}
          >
            <h3
              id="logout-button"
              onClick={() => {
                signOut(auth).then((user) => {
                  console.log("user signed out sucessfully");
                  history("/");
                });
              }}
            >
              Logout
            </h3>
                    <NotificationsIcon onClick={ () =>
                    {
                        history("/notifications")
                    }} style={ {color:'white',margin:'10px',cursor:'pointer'} }/>
            {auth.currentUser != null && (
              <img src={auth.currentUser.photoURL} alt="" id="user-image" />
            )}
          </span>
        </nav>
      </div>
    );
}

export default Navbar
