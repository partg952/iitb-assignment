import React from "react";
import "./CreateProject.scss";
import { useRef } from "react";
import app from "../firebase";
import { getDatabase, ref, set, onValue,push } from "firebase/database";
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth } from "firebase/auth";
function CreateProject({ navHeader, setHeader,token }) {
  const projectName = useRef();
  const fileRef = useRef();
  const auth = getAuth(app);
  const fileUploadFile = useRef();
  const database = getDatabase(app);
  const [file, setFile] = useState();
  const history = useNavigate();
  console.log(file);
  const octo = new Octokit({
    auth: "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",
  });

  useEffect(() => {
    setHeader("Create Your Project");
  }, []);

  return (
    <div>
      <form
        action="post"
        onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("loading").style.visibility = "visible";
          const formattedTitle = projectName.current.value.replaceAll(" ", "-");
          octo.rest.repos
            .createForAuthenticatedUser({
              name: formattedTitle,
              private: true,
            })
            .then((res) => {
              if (
                auth.currentUser.reloadUserInfo.screenName != "CodePolice23"
              ) {
                octo.rest.repos
                  .addCollaborator({
                    owner: "CodePolice23",
                    repo: formattedTitle,
                    username: auth.currentUser.reloadUserInfo.screenName,
                  })
                  .then((user) => {
                    console.log("other user request sent!!");
                  });
              }
              const reader = new FileReader();
              console.log("repo created");
              reader.onloadend = () => {
                console.log(reader.result);

                octo.repos
                  .createOrUpdateFileContents({
                    owner: "CodePolice23",
                    repo: formattedTitle,
                    path: file.name,
                    content: Buffer.from(reader.result, "utf8").toString(
                      "base64"
                    ),
                    message: "update test.txt",
                  })
                  .then((res) => {
                    let arr = [];
                    console.log( "file contents written" );
                                    history("/home");

                    document.getElementById("loading").style.visibility =
                      "hidden";
                    alert("THE FILE HAS BEEN UPLOADED");
                  })
                  .catch((err) => console.log(err));
              };

              reader.readAsArrayBuffer( file );
             

              push(
                ref(
                  database,
                  auth.currentUser.reloadUserInfo.screenName + "/project"
                ),
                {
                  createdBy: auth.currentUser.reloadUserInfo.screenName,
                  repoURL: "https://github.com/CodePolice23/" + formattedTitle,
                  ownerPhoto: auth.currentUser.photoURL,
                  projectTitle: projectName.current.value,
                }
              ).then( response =>
              {  
                console.log("project info written in the database")
              })
              
            });
        }}
      >
        <input
          type=""
          id="project-name"
          placeholder="Enter your project name..."
          ref={projectName}
        />
        <input
          type="file"
          id="file-picker"
          ref={fileRef}
          onChange={(e) => {
            console.log(e.target.files[0]);
            setFile(e.target.files[0]);
          }}
        />
        <div
          id="pick-pdf"
          onClick={() => {
            fileRef.current.click();
          }}
        >
          <span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/97/Document_icon_%28the_Noun_Project_27904%29.svg"
              alt=""
            />
            <p>Pick Your file</p>
          </span>
        </div>
        <p id="loading">UPLOADING...</p>
        <button id="file-upload-button" ref={fileUploadFile} type="submit">
          Create Project
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
