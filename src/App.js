import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import Navbar from './components/Navbar'
import app from './firebase';
import Login from './components/Login';
import NotifPage from './components/NotifPage';
import MainPage from './components/MainPage';
import Socket from './components/Socket';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import ChattingPage from './components/ChattingPage';
import CreateProject from './components/CreateProject';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
const socket = socketIOClient("http://localhost:8080/");
function App ()
{
  const [ navHeader, setHeader ] = useState( "" );
  const [ message, addMessages ] = useState( [] );
  const [ token, setToken ] = useState( "" )
  console.log(token)
  console.log(message)
  
  return (
    <div className="App">
    <Socket socket={socket} messages={message} addMessages={addMessages} />
      <Router>
        <Navbar navHeader={navHeader} />
        <Routes>
          <Route
            path="/"
            exact
            element={<Login navHeader={navHeader} setHeader={setHeader} />}
          />
          <Route
            path="/home"
            element={<MainPage navHeader={navHeader} setHeader={setHeader} setToken={setToken} token={token} />}
          />
          <Route
            path="/create-project"
            element={
              <CreateProject navHeader={navHeader} setHeader={setHeader} />
            }
          />
          <Route
            path='/chatting/:group_name'
            element={<ChattingPage setNavHeader={setHeader} socket={socket} messages={message} addMessages={addMessages}/>}
          />
          <Route
            path='/notifications'
            element={ <NotifPage setNavHeader={setHeader} token={token} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
