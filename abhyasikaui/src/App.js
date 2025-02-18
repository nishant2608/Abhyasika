import React from 'react';
import logo from './logo.svg';
import './App.css';
import NirmiteeLogo from './Nirmitee.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={NirmiteeLogo} className="App-logo" alt="logo" />
        <div className="App-links">
          <a href="/login" className="App-link">Login</a>
          <a href="/register" className="App-link">Register</a>
        </div>
        <div style={{fontWeight:'bold', fontSize:'larger', marginTop: '10px'}}>Welcome to Abhyasika</div>
        <p>
          This is an AI-powered application to help students, teachers, and other educators. You can register for free.
        </p>
        <p>
          The main feature of this app is that you can have AI generate content for you as well as quizzes (which you can also manually set, solve, and review with leaderboards). You can also talk with an AI assistant at all times in the right side window.
        </p>
        <p>
          The app has the following structure: projects -&gt; chapters -&gt; topics & quizzes. Topics is where your content will be, and you can access the "generate a quiz from AI" feature there.
        </p>
        
      </header>
    </div>
  );
}

export default App;