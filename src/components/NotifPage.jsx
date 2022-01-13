import React from "react";
import "./NotifsPage.scss";
import { useEffect } from "react";
import { ClearCacheProvider, useClearCacheCtx } from "react-clear-cache";
import { getDatabase,ref,onValue } from "firebase/database";
import axios from "axios";
import app from "../firebase";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { getAuth } from "firebase/auth";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Octokit } from "@octokit/rest";

function NotifPage({ setNavHeader,token }) {
  const database = getDatabase( app );
  const [notifications, setNotifications] = useState([]);
  const auth = getAuth(app);

  

  function notifRead(unread) {
    return unread ? "flex" : "none";
  }

  function fetchNotifications(all) {
    setNotifications( [] );

    axios
      .post("http://localhost:8080/get-user-notifications?all=" + all, {
        githubId: token,
      })
      .then((res) => {
        console.log(res.data);
        setNotifications(res.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setNavHeader("Notifications");
    fetchNotifications( false );
    
  }, []);

  return (
    <div>
      <select
        name=""
        id="notif-type"
        onChange={(e) => {
          fetchNotifications( e.target.value == "All" );
        }}
      >
        <option value="Unread">Unread</option>
        <option value="All">All</option>
      </select>
      <h1>Notifications</h1>
      <div>
        {notifications.length != 0 ? (
          notifications.map((notif, i) => {
            return (
              <div className="notif-card">
                <input
                  type="checkbox"
                  style={{ display: notifRead(notif.unread) }}
                  name=""
                  id=""
                />
                <span>
                  <h6>{notif.repository.full_name}</h6>
                  <p>{notif.subject.title}</p>
                </span>
                <p className="reason">{notif.reason}</p>
                <div
                  className="actions"
                  style={{
                    display: notifRead(notif.unread),
                  }}
                >
                  <button
                    onClick={() => {
                      axios
                        .post("http://localhost:8080/mark-read", {
                          githubId: token,
                        })
                        .then((res) => {
                          console.log(res.data);
                          fetchNotifications(false);
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    <DoneIcon />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <FactCheckIcon style={{ height: "300px", width: "300px" }} />
            <h1>You are all caught up</h1>
          </>
        )}
      </div>
    </div>
  );
}

export default NotifPage;
