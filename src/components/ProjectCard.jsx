import React from "react";
import "./ProjectCard.scss";
import { Octokit } from "@octokit/rest";
import { useNavigate } from "react-router-dom";
function ProjectCard ( { title, img, owner,collabRef,setRepoName } )
{
    const history = useNavigate();
    return (
      <>
        <div id="card">
          <div id="image-section">
            <img id="cover-image" src={img} alt="" />
          </div>
          <div id="card-text">
            <h2>{title}</h2>
            <h4>Created By:{owner}</h4>
            <span id="button-span">
                        <button id="chatting-button" onClick={ () =>
                        {
                            history( `/chatting/${ title }` );
              }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Chat_icon.png"
                  alt=""
                />
              </button>
                        <button onClick={ () =>
                        {
                            collabRef.current.style.transform = 'translateY(0px)';
                            setRepoName(title)
                        } }>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/32/Creative-Tail-People-add-user.svg"
                  alt=""
                />
              </button>
            </span>
          </div>
        </div>
           
      </>
    );
}

export default ProjectCard;
