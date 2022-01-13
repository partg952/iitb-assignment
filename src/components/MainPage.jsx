import React from "react";
import { useEffect } from "react";
import "./MainPage.scss";
import { useRef } from "react";
import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Octokit } from "@octokit/rest";
import { CLIENT_SECRET,CLIENT_ID } from "./secrets";
import useLocation from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { confirmPasswordReset, getAuth } from "firebase/auth";
import { getDatabase, onValue, ref,set } from "firebase/database";
import app from "../firebase";
import axios from "axios";
function MainPage({ navHeader, setHeader,setToken,token }) {
  const database = getDatabase(app);
  const history = useNavigate();
  const auth = getAuth( app );
  const [ code, setCode ] = useState( 0 )
  console.log(code)
  const [ repoName, setRepoName ] = useState('');
  const addCollabRef = useRef();
  const [projects, addProjects] = useState([]);
  
  console.log( projects );

  const octokit = new Octokit({
    auth: "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",
  } );
  
  function checkCollab ( repo, username )
  {
    let code = 0;
    
       octokit.rest.repos.checkCollaborator({
        owner: "CodePolice23",
        repo: repo,
        username: username,
       } ).then( res =>
       {
         return 204;
       } ).catch( err =>
       {
         return 404;
       })
  }

  useEffect(() => {
    setHeader( "Projects" );
    console.log( window.location.href.replace( "http://localhost:3000/home?code=", "" ) )
    const code = window.location.href.replace(
      "http://localhost:3000/home?code=",
      ""
    );
   
    setTimeout( () =>
    {
      

      onValue( ref( database, auth.currentUser.reloadUserInfo.screenName + '/githubToken' ), snapshot =>
      {
        if ( snapshot.val() == null )
        {
           axios
             .post(`http://localhost:8080/get-user-token`, {
               clientId: CLIENT_ID,
               clientSecret: CLIENT_SECRET,
               code: code,
             })
             .then((res) => {
               console.log(
                 res.data
               );
               const token = res.data
                 .replace("access_token=", "")
                 .replace("&scope=&token_type=bearer", "");
               set( ref( database, auth.currentUser.reloadUserInfo.screenName + '/githubToken' ), token ).then( () =>
               {
                 console.log( "token saved!!" )
                 setToken(token)
               })
             });
        }
        else
        {
          setToken(snapshot.val())
        }
      })

      onValue(
        ref(database, auth.currentUser.reloadUserInfo.screenName + "/project"),
        (snapshot) => {
        addProjects([]);
        console.log(snapshot.val());
        snapshot.forEach( ( item ) =>
        {
          console.log(item.val())
          addProjects((prev) => [
            ...prev,
            {
              owner: item.val().createdBy,
              repoLink: item.val().repoURL,
              ownerPhoto: item.val().ownerPhoto,
              projectTitle: item.val().projectTitle,
            },
          ]);
        });
      }
    );
  },1000)
  }, []);
  return (
    <div>
    <button
        id="add-project"
        onClick={() => {
          history("/create-project");
        }}
        >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/03/Plus_sign_font_awesome.svg"
          alt=""
        />
      </button>

      <div id="projects">
        {
          projects.map( items =>
          {
            
            return (
            <ProjectCard
            img={ items.ownerPhoto }
            title={ items.projectTitle }  
            collabRef={ addCollabRef }
                owner={ items.owner }
                setRepoName={setRepoName}
          />
            )
          })
        }
      </div>
      <div id="add-cab" ref={addCollabRef}>
        <h2>Add A Collaborator</h2>
        <hr />
        <form action="" onSubmit={ (e) =>
        {
          e.preventDefault()
          axios( "https://api.github.com/users/" + e.target[ 0 ].value ).then( res =>
          {
            octokit.rest.repos.addCollaborator( {
              owner: 'CodePolice23',
              repo: repoName,
              username: e.target[ 0 ].value,
            } ).then( res =>
            {
              console.log( "request sent" )
              document.getElementById( "request-sent" ).style.visibility = 'visible';
              setTimeout( () =>
              {
                addCollabRef.current.style.transform = 'translateY(-600px)';
              },5000)
            } ).catch( err => console.log( err ) );
          }).catch(err=>alert("The username you entered is not valied .Please Enter a valid username."))
        } }>
          <p>{ repoName }</p>
          <input
            type="text"
            id="username"
            placeholder="Enter the username..."
            required={true}
          />
          <br />
          <p id='request-sent' style={{visibility:'hidden',textAlign:'center'}}>Request Sent!</p>
          <button type="submit">Verify and Add</button>
        </form>
        <button
          id="close"
          onClick={() => {
            addCollabRef.current.style.transform = "translateY(-600px)";
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/dc/Cancel_icon.svg"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}

export default MainPage;
