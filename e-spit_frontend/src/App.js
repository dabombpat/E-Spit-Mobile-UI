import React from "react";
import Login from "./Login.js"
import Designer_LandingPage from "./Designer_LandingPage.js"
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin_LandingPage from "./Admin_LandingPage.js";
import Model from "./Model.js";



var currentuser = new Model("","")
export {currentuser}

var currentproject = new Model("","")
export {currentproject}


function App(){


return(
<main>
    <Routes>
        <Route path="/"  element={<Login/>} exact/>
        <Route path="/Designer_LandingPage" element={<Designer_LandingPage/>} />
        <Route path="/Admin_LandingPage" element={<Admin_LandingPage/>} />
    </Routes>
</main>
)
}
export default App;