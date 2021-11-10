import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NavBar.scss";
import { connect } from 'react-redux';
import { Redirect } from "react-router";
import {logout } from "../Store/Actions/auth";

class NavBar extends Component {

  logout=(e)=>{
    e.preventDefault()
    try {
      this.props.logout();
      this.props.hubCon.stop().then(function() {
        alert('Logout SuccessFully');
        console.log("LOGOUT");
      
    });
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    if(this.props.isLogin){ return (
      <div> 
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">
              <button onClick={this.logout} >Logout</button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );}
    else return null
  }
}

const mapStateToProps = (state) => {
  return{
  currentUser:state.auth.authUser,
  isLogin:state.auth.authLogin,
  hubCon:state.auth.HubConnection
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NavBar);
