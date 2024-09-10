import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Forgotpassword from './Components/Forgotpassword';
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from './Components/Register';



function App() {
  return ( 
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/forgotpassword" element={<Forgotpassword/>} />
          <Route path="/home" element={<Home />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;