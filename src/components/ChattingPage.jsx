import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import './ChattingPage.scss';
import { getStorage, ref , uploadBytes,getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { useRef } from 'react';
function ChattingPage ( { socket, messages, addMessages,setNavHeader } )
{
  const auth = getAuth( app );
  const [ file, setFile ] = useState('');
  console.log( file );
  const filePicker = useRef();
  const storage = getStorage( app );
    const {group_name} = useParams()

  
  function convertArrayBufferToImageReadableFormat ( arrayBuffer )
  {
     var arrayBufferView = new Uint8Array(arrayBuffer);
     var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
     var urlCreator = window.URL || window.webkitURL;
     var imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
  }
    useEffect( () =>
    {
      setNavHeader("Chatting")
      socket.emit( "join_room", group_name ) 
      addMessages( [] );
    },[])
    return (
      <div>
        
        <div id="texts-div">
          {messages.map((message) => {
            let messageStyle = {
              textAlign: message.written == "user" ? "right" : "left",
              padding: "5px",
            };
            return (
              <div style={messageStyle}>
                <p
                  className="message"
                  style={
                    message.written == "user"
                      ? { marginLeft: "auto", borderBottomRightRadius: "0" }
                      : { marginRight: "auto", borderBottomLeftRadius: "0" }
                  }
                >
                  {message.text}
                  <br />
                  { message.asset != '' && <img style={{maxHeight:'200px',maxWidth:'200px'}} src={convertArrayBufferToImageReadableFormat(message.asset)}/>}
                  <h6
                    style={{
                      margin: "0",
                    }}
                  >
                    {message.writer}
                  </h6>
                </p>
              </div>
            );
          })}
        </div>
        <form action="" id='form' onSubmit={ ( e ) =>
        {
          e.preventDefault();
          const fileReader = new FileReader();
          if ( file != '' ) 
          {
            fileReader.onloadend = () =>
            {
              console.log(fileReader.result)
              const messageObj = {
                text: e.target[0].value,
                written: "user",
                room: group_name, 
                userName: auth.currentUser.reloadUserInfo.screenName,
                asset:fileReader.result,
              };
              addMessages((prev) => [...prev, messageObj]);
              socket.emit("message", messageObj);
              e.target[ 0 ].value = ''
              setFile( '' );
              
            }
            fileReader.readAsArrayBuffer(file)
          }  
          else
          {
            const messageObj = {
              text: e.target[0].value,
              written: "user",
              room: group_name,
              userName: auth.currentUser.reloadUserInfo.screenName,
              asset: '',
            };
            addMessages((prev) => [...prev, messageObj]);
            socket.emit("message", messageObj);
            e.target[0].value = "";
          }
        }}>
          <input type="text" required={ true } />
          <input type="file" name="" id="" ref={ filePicker } style={ { display: 'none' } } onChange={ (e) =>
          {
            console.log( e.target.files[ 0 ] );
            setFile( e.target.files[ 0 ] );
          }}/>
          <button type='submit'>Send</button>
          <button type='button' id='attach-file' onClick={ () =>
          {
            filePicker.current.click()
          }}>Attach a file</button>
        </form>
      </div>
    );
}

export default ChattingPage
