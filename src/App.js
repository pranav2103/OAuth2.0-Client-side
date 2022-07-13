import React, { Component } from 'react';
import { useEffect } from 'react';

import logo from './logo.svg';
import {Routes, Route, useNavigate} from 'react-router-dom';
import './App.css';
import axios from 'axios';
var ref_tokens="";
var timeOutforRefreshToken=null;
var timer=0;

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  
  componentDidMount() {
    let code = "";
    let state = "";
    let sessionState = "";
    const windowLocationSearch = window.location.search;
    if (windowLocationSearch.indexOf("?code") >= 0) {
      code = decodeURIComponent(
        windowLocationSearch
          .substring(windowLocationSearch.indexOf("=") + 1, windowLocationSearch.indexOf("&"))
          .toString()
      );
    }
    if(code != null && code != "" ){
      this.callAuthorize(code);
      code="";
    }
  };
  
  
   

  callApi = async () => {
    //const response = await fetch('http://localhost:11151/testing');
    //const body = await response.json();
    //if (response.status !== 200) throw Error(body.message);
    
    window.location.replace('https://login.microsoftonline.com/beeddf5d-ddc7-4673-bf57-f78a327a3636/oauth2/v2.0/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=openid%20offline_access%20https%3A%2F%2Foutlook.office.com%2Fcalendars.read&response_type=code&client_id=57715563-eca4-4b59-8cc6-26158b1ba6c7');
    
    //return body;
  };

  callAuthorize= async(code)=> {
     await axios({
          url: `http://localhost:11151/authorize?code=${code}`})
          .then((response) =>{
            const data= response.data;
            ref_tokens=response.data.RefreshToken;
            console.log("data = ",data);
            timer=(data.ExpiresIn/200)*1000;
            timeOutforRefreshToken=setTimeout(() => this.callGetTokenfromRefreshToken(), timer); 
      })
          .catch(error => console.error(`Error: ${error}`));
    }
    
    
    
  callGetTokenfromRefreshToken= async()=>{
    await axios({
      url: `http://localhost:11151/refreshtokens?refresh_token=${ref_tokens}`})
      .then((response) =>{
        const data= response.data;
        console.log("refreshed tokens = ",data);
        clearTimeout(timeOutforRefreshToken);
        timer=(data.ExpiresIn/200)*1000;
        timeOutforRefreshToken=setTimeout(() => this.callGetTokenfromRefreshToken(), timer);
      })
      .catch(error => console.error(`Error: ${error}`));
}
  

  
render() {
  
    return (
      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.response}</p>
        <button onClick={this.callApi}>login</button>
      </div>
    );
  }
}

export default App;