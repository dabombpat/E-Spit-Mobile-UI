import React, { useState } from "react";
import {Link, redirect, Routes, Route, useNavigate} from 'react-router-dom';
import { currentuser } from "./App";
import currentproject from './App';


var base_url = "https://sbjoexsw53.execute-api.us-east-1.amazonaws.com/Prod/";
var adminlister_url = base_url + "adminlister";      // POST: {arg1:5, arg2:7}
var reapproject_url = base_url + "reapprojects";      // POST: {arg1:5, arg2:7}
var delete_project_url = base_url + "deleteproject";      // POST: {arg1:5, arg2:7}
var delete_pledge_url = base_url + "deletepledge";      // POST: {arg1:5, arg2:7}
var pledge_info_url = base_url + "pledgeviewer";      // POST: {arg1:5, arg2:7}
var pledge_supporter_url = base_url + "pledgesupporterviewer";      // POST: {arg1:5, arg2:7}
let initialprojectlist = [];
let initialpledgesupporterlist = [];
let initialpledgelist = [];
let hasloadedprojects = false;
let hasloadedpledges = false;



function Admin_LandingPage(){
  let username = currentuser.user
  const [listofprojects, setList] = useState(initialprojectlist);
  const [pledge_list, setPledgeList] = useState(initialpledgelist);
  const [pledge_supporter_list, setPledgeSupporterList] = useState(initialpledgesupporterlist);
  const navigate = useNavigate();
  Project_List_Caller();





  function Project_List_Caller() { // Requests List of Projects by the logged in Designer
    if(hasloadedprojects == false){
    // Creating Lambda Payload
    var data = {};
    
    // Wrapping Payload in a "Body"
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();
    xhr.open("GET", adminlister_url, true);

    console.log('Asking Lambda for All Projects')
    xhr.send(js);
  
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log('Received Data from Lambda')

      var parsed_response = JSON.parse(xhr.responseText);
      //console.log("JSONParse Result :", responseunit)
      var response_info  = parsed_response["result"];
      //console.log("result : ", response_info)
      
      if(response_info != undefined){
        for(let i=0; i < (response_info.length); i++){
          console.log(i)
          hasloadedprojects = true;
          if(i>0){
            setList(listofprojects => [...listofprojects, [response_info[i]["username"], response_info[i]["type"], response_info[i]["story"], response_info[i]["name"], response_info[i]["launched"], response_info[i]["goal"], response_info[i]["funds"], response_info[i]["deadline"],response_info[i]["success"],response_info[i]["failed"]]])
          }
          else{
            setList(listofprojects => [[response_info[i]["username"], response_info[i]["type"], response_info[i]["story"], response_info[i]["name"], response_info[i]["launched"], response_info[i]["goal"], response_info[i]["funds"], response_info[i]["deadline"],response_info[i]["success"],response_info[i]["failed"]]])
          }}
      console.log(listofprojects)
    }

    } else {
      console.log("did not receive projects back")
    }
  }
  };
  }

  function handleDeleteProject(project_name, designer_name, pledge_list){
    for (let m=0; m<(pledge_list.length); m++){
      let hasloadedpledges = false;
      console.log("looking to delete pledge # ", m)
      handleDeletePledge(currentproject.user, currentproject.projectname, pledge_list[m][1], pledge_list[m][2])
    }
    
    // Creating Payload to send to Lambda
    var data = {};
    data["username"] = designer_name;
    data["name"] = project_name;
    
    // to work with API gateway, I need to wrap inside a 'body'
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", delete_project_url, true);
    xhr.send(js);
  
    console.log('Sent Request to Lambda to delete Project : ', project_name)
    // This will process results and update HTML as appropriate. 
    
    xhr.onloadend = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log('Received Response from Lambda')
        let hasloadedprojects = false;
  
        var parsed_response = JSON.parse(xhr.responseText);
        //console.log("JSONParse Result :", responseunit)
        var response_info  = parsed_response["result"];
        //console.log("result : ", response_info[0]["username"], response_info[0]["type"],)
        alert("Deleted Project!")
        hasloadedprojects = false
        navigate('/');
        if(response_info != undefined){
      }
      
      } else {
        console.log("did not receive projects back")
      }
  };
  }

  function handleDeletePledge(username, projectname, reward, amount){
    // Creating Payload to send to Lambda
    var data = {};
    data["username"] = username;
    data["projectname"] = projectname;
    data["reward"] = reward;
    data["amount"] = amount;
  
    
    // to work with API gateway, I need to wrap inside a 'body'
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", delete_pledge_url, true);
    xhr.send(js);
  
    console.log('Sent Request to Lambda to delete Pledge : ', reward)
    // This will process results and update HTML as appropriate. 
    
    xhr.onloadend = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log('Received Response from Lambda')
  
        var parsed_response = JSON.parse(xhr.responseText);
        //console.log("JSONParse Result :", responseunit)
        var response_info  = parsed_response["result"];
        //console.log("result : ", response_info[0]["username"], response_info[0]["type"],)
        alert("Deleted Pledge!")
        //navigate('/Designer_LandingPage');
        if(response_info != undefined){
      }
      
      } else {
        console.log("did not receive projects back")
      }
  };
  }

  function RequestPledgeSupporterListFromLambda(project_name, reward) {
    // Creating Payload to send to Lambda
    var data = {};
    data["projectname"] = project_name;
    data["reward"] = reward;
    
    // to work with API gateway, I need to wrap inside a 'body'
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", pledge_supporter_url, true);
    xhr.send(js);
  
    console.log('Sent Request to Lambda for list of pledge supporter: ')
    // This will process results and update HTML as appropriate. 
    
    xhr.onloadend = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log('Received Pledge Supporter Data from Lambda')
        

        var parsed_response = JSON.parse(xhr.responseText);
        //console.log("JSONParse Result :", responseunit)
        var response_info  = parsed_response["result"];
        //console.log("result : ", response_info)
        
        if(response_info != undefined){
          for(let i=0; i < (response_info.length); i++){
            //console.log(response_info[i]["supporterusername"])
            if(pledge_supporter_list[0] != ""){
              setPledgeSupporterList(pledge_supporter_list => [...pledge_supporter_list, [response_info[i]["supporterusername"], response_info[i]["reward"]]])
            }
            else{
              setPledgeSupporterList(pledge_supporter_list => [[response_info[i]["supporterusername"], response_info[i]["reward"]]])
              
            }
            
          }
      }
  
      } else {
        console.log("did not receive projects back")
      }
  };
  }

  function RequestPledgeListFromLambda(project_name) {
    if(hasloadedpledges == false){
      hasloadedpledges = true;
    // Creating Payload to send to Lambda
    var data = {};
    data["projectname"] = project_name;
    
    // to work with API gateway, I need to wrap inside a 'body'
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", pledge_info_url, true);
    xhr.send(js);
  
    console.log('Sent Request to Lambda for list of pledges: ')
    // This will process results and update HTML as appropriate. 
    
    xhr.onloadend = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log('Received Pledge Data from Lambda')
        

        var parsed_response = JSON.parse(xhr.responseText);
        //console.log("JSONParse Result :", responseunit)
        var response_info  = parsed_response["result"];
        //console.log("result : ", response_info)
        
        if(response_info != undefined){
          for(let i=0; i < (response_info.length); i++){
            RequestPledgeSupporterListFromLambda(currentproject.projectname, response_info[i]["reward"])
            //console.log(i)
            if(i>0){
              setPledgeList(pledge_list => [...pledge_list, [response_info[i]["projectname"], response_info[i]["reward"], response_info[i]["amount"], response_info[i]["maxsupporters"], response_info[i]["currentsupporters"]]])
            }
            else{
              setPledgeList(pledge_list => [[response_info[i]["projectname"], response_info[i]["reward"], response_info[i]["amount"], response_info[i]["maxsupporters"], response_info[i]["currentsupporters"]]])
            }}
      }
  
      } else {
        console.log("did not receive projects back")
      }

    };
  }
  }

  function statuschecker(success,failed){
    if(success){return "SUCCESS"}
    if(failed){return "FAILED"}
    else{return "IN PROGRESS"}
  }

  function displayprojects(){
      return(listofprojects.map((item,index)=>{
          console.log(index)
          return( 
          <center >
            Project Status: {statuschecker(listofprojects[index][8],listofprojects[index][9])}<br/>
            Project Name: {listofprojects[index][3]}<br/>
            Developer Name: {listofprojects[index][0]}<br/>
            Project Type: {listofprojects[index][1]}<br/>
            Project Story: {listofprojects[index][2]}<br/>
            Project Fundraising Goal: {listofprojects[index][5]}<br/>
            Is the Project Launched? : {launchchecker(listofprojects[index][4])}<br/>
            Funds Raised by the Project: {listofprojects[index][6]}<br/>
            Project deadline: {listofprojects[index][7]}<br/>
            <center><button onClick={()=>handleDeleteProject(listofprojects[index][3], listofprojects[index][0], pledge_list)} type="submit" className="btn">Delete Project : {listofprojects[index][3]}</button></center><br/><br/>
          </center>
            )}))
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

  const handleBackToLogin  = () => {
    console.log("Navigating back to the Login Page (from ALP page) ---------------------")
    hasloadedprojects = false
    navigate('/');
  }

  const handleReapProjects  = () => {
    console.log("Reaping Projects")
    alert("Attempting to Reap Projects")
    var data = {}
    var body = {}
    body["body"] = JSON.stringify(data);
    var js = JSON.stringify(body);
  
    var xhr = new XMLHttpRequest();

    xhr.open("GET", reapproject_url, true);

    console.log('Asking Lambda for All Projects')
    xhr.send(js);
  
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log('Received Data from Lambda')

      var parsed_response = JSON.parse(xhr.responseText);
      //console.log("JSONParse Result :", responseunit)
      var response_info  = parsed_response["result"];
      //console.log("result : ", response_info)
      hasloadedprojects = false;
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
  }


    return (
        <div>
      
          <h1><center>Welcome to the Admin Home Page!</center></h1>
          <h1><center>You're Logged in as Admin!</center></h1>
          <center><button onClick={()=>{hasloadedprojects=false; handleReapProjects();handleBackToLogin()}} type="submit" className="btn">Reap Projects</button></center>
          <br/><br/>
          {displayprojects()}

          <br/>
          <center><button onClick={()=>{hasloadedprojects = false;handleBackToLogin()}} type="submit" className="btn">Back To Login</button></center>
          </div>

          
        );
    }


export default Admin_LandingPage;