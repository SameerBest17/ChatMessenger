import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Login from "./Components/Login";
import Register from './Components/Register'
import ChatMessenger from './Components/ChatMessenger/ChatMessenger'
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <NavBar />
          <Route path="/" exact component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/chatmessenger" exact component={ChatMessenger}/>
        </Router>
      </div>
    );
  }
}
export default App;
