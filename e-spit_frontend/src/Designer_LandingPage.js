import React, { useState } from "react";
import {ReactDOM} from 'react';
import {Link, redirect, Routes, Route, useNavigate, Navigation} from 'react-router-dom';
import currentuser from "./App";
import currentproject from './App';
export


var base_url = "https://sbjoexsw53.execute-api.us-east-1.amazonaws.com/Prod/";
var devlister_url = base_url + "devlister";      // POST: {arg1:5, arg2:7}
let initialprojectlist = [];
let hasloadedprojects = false;



function Designer_LandingPage(){
  let username = currentuser.user;
  const [listofprojects, setList] = useState(initialprojectlist);
  const navigate = useNavigate();
  DevlisterCaller(username);

  function DevlisterCaller(username) { // Requests List of Projects by the logged in Designer
    if(hasloadedprojects == false){
    // Creating Lambda Payload
    var data = {};
    data["username"] = username;
    
    // Wrapping Payload in a "Body"
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", devlister_url, true);

    console.log('Asking Lambda for Projects by user : ', username)
    xhr.send(js);
  
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log('Received Data from Lambda')

      var parsed_response = JSON.parse(xhr.responseText);
      //console.log("JSONParse Result :", responseunit)
      var response_info  = parsed_response["body"];
      //console.log("result : ", response_info)
      hasloadedprojects = true;
      if(response_info != undefined){
        for(let i=0; i < (response_info.length); i++){
          console.log(i)
          if(i>0){
            setList(listofprojects => [...listofprojects, [response_info[i]["username"], response_info[i]["type"], response_info[i]["story"], response_info[i]["name"], response_info[i]["launched"], response_info[i]["goal"], response_info[i]["funds"], response_info[i]["deadline"]]])
          }
          else{
            setList(listofprojects => [[response_info[i]["username"], response_info[i]["type"], response_info[i]["story"], response_info[i]["name"], response_info[i]["launched"], response_info[i]["goal"], response_info[i]["funds"], response_info[i]["deadline"]]])
          }}
      console.log(listofprojects)
    }

    } else {
      console.log("did not receive projects back")
    }
  }
  };
  }

  function Create_Project(){
    hasloadedprojects = false;
    console.log("Navigating to Create A Project Page! ---------------------")
    navigate('/Designer_Create_Project');
  }
    
  const handleBackToLogin  = () => {
    hasloadedprojects = false;
    console.log("Navigating back to the Login Page (from DLP page) ---------------------")
    navigate('/');
  }

  const handleToProject  = (project_number, project_name) => {
    hasloadedprojects = false;
    currentproject.projectnum = project_number;
    currentproject.projectname = project_name;

    console.log("Navigating to Project Page", project_name, "(from DLP page) ---------------------")
    navigate('/Designer_ProjectPage');
  }

  function resethasloadedprojects(){
    hasloadedprojects = false;
  }
  
  function launchchecker(YorN){
    if(YorN == 0){
      return("No")
    }
    if(YorN == 1){
      return("Yes")
    }
    else{
      return("error")
    }
  }

  function goalchecker(fundsraised, goal){
    if(goal > fundsraised){
      return("No")
    }
    if(goal < fundsraised){
      return("Yes")
    }
    else{
      return("error")
    }
  }


   function displayprojects(){
    return(listofprojects.map((item,index)=>{
        console.log(index)
         return( 
         <center >
          Project Name: {listofprojects[index][3]}<br/>
          Developer Name: {listofprojects[index][0]}<br/>
          Project Type: {listofprojects[index][1]}<br/>
          Project Story: {listofprojects[index][2]}<br/>
          Project Fundraising Goal: {listofprojects[index][5]}<br/>
          Is the Project Launched? : {launchchecker(listofprojects[index][4])}<br/>
          Funds Raised by the Project: {listofprojects[index][6]}<br/>
          Has the Project Reached it's Goal? : {goalchecker(listofprojects[index][6], listofprojects[index][5])}<br/>
          Project deadline: {listofprojects[index][7]}<br/>
         <center><button onClick={()=>handleToProject(1, listofprojects[index][3])} type="submit" className="btn">Go to Project : {listofprojects[index][3]}</button></center><br/>
         </center>
          )}))
}




  console.log(listofprojects)
    return (
      <div>

          
          <h1><center>Welcome to the Designer Home Page!</center></h1>
          <h1><center>You've Logged in!</center></h1>
          <br/>
          <center>If you have a project, it will show up here:</center>


          {displayprojects()}
          <br/>


          
          <center><button onClick={Create_Project}>Create A Project</button></center>
          <center><button onClick={()=>handleBackToLogin()} type="submit" className="btn">Back To Login</button></center>

          </div>
        );
    }


export default Designer_LandingPage;