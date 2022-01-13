import React from 'react'
import { useEffect } from 'react'
import socketIOClient from 'socket.io-client';

function Socket ( { socket,messages,addMessages } )
{
    useEffect( () =>
    {
        socket.on( "connection", ( data ) =>
        {
           console.log("connected!!",data.id)
        } ) 
        
        socket.on( "message", ( data ) =>
        {   
            if (data.asset.length != 0) {
              let messageObj = {
                text: data.text,
                written: "friend",
                writer: data.writer,
                asset: data.asset,
            };
            addMessages((prev) => [...prev, messageObj]);
            } else
            {
                let messageObj = {
                  text: data.text,
                  written: "friend",
                  writer: data.writer,
                  asset:''
                };
                addMessages((prev) => [...prev, messageObj]);
            }
            console.log(data);
        })
    },[])
    return (
        <div>
            
        </div>
    )
}

export default Socket
