import axios from "axios";
import React from "react";
import { logIn } from "../Store/Actions/auth";
import { allUsers } from '../Store/Actions/allUsers'
import "./Register.scss";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { JoinedRooms } from '../Store/Actions/Room'


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      type:'password',
      error: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

 showPassword=(e)=>{
   console.log(this.state.type)
var type=this.state.type;
  if (type === "password") {
    this.setState({type : "text"});
  } else {
    this.setState({ type : "password"});
  }
  
}
  handleChange(e) {
    if(e.target.type==='password')
    this.setState({type:e.target.type})

    const target = e.target;
    this.setState({
      [target.name]: target.value,
    });
  }
  async handleSubmit(event) {
    event.preventDefault();
    let verified = false;
    const { username, password } = this.state;
    try {

      const res = await axios.get(`http://localhost:6081/api/Application/${username}/${password}`)

      if (res.data == '') {
        this.setState({ error: "Incorrect Password or Username!" })
        console.log("Incorrect Password or Username! ")
      } else {
        const getRes = await axios.get('http://localhost:6081/api/Application/Users')
        const getRooms = await axios.get(`http://localhost:6081/api/Application/rooms/${username}`)
        if (getRes.data) {
          this.props.AllUsers(getRes.data);
        }
        if (getRooms.data) {
          this.props.JoinedRooms(getRooms.data);
        }

        console.log(this.props.history.push("/chatmessenger"))
        const user = res.data
        this.props.logIn(user);
      }

    } catch (error) {
      console.log(error);
    }

    // const { username, email, fullname, password } = this.state;
    // /* Generate random number that will be serve as the ID of the user */
    // const randomNum = Math.ceil(Math.random() * 10000);
    // const userData = {
    //   username,
    //   email,
    //   fullname,
    //   password,
    //   id: randomNum,
    //   role: "Member",
    //   photoUrl: "https://talkjs.com/docs/img/ronald.jpg",
    // };

    // /* Store user data in browser's local storage */
    // localStorage.setItem("currentUser", JSON.stringify(userData));
    // /*Redirect to the my network page */
    // this.props.history.push("/mynetwork");
  }
  render() {
    if (this.props.isLogin) return <Redirect to='/chatmessenger' />
    return (
      <div className="login-container">
        <div className="login-form form-group">
          <form onSubmit={this.handleSubmit}>
            <label className="lable">Login</label>
            <h3 className="login-error">{this.state.error}</h3>
            <input
              type="text"
              name="username"
              onChange={this.handleChange}
              placeholder="Username"
              className="input"
              required
            />
            <input 
             autoComplete="off"
              type={this.state.type}
              name="password"
              onChange={this.handleChange}
              placeholder="Password"
              className="input"
              required
            />
            <input type="checkbox" onClick={this.showPassword}/>Show Password<hr/>

            <input type="submit" className="button" placeholder="submit" />
            <div className="Form-group">
              <Link to="/register" >
                Register as New User
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.auth.authLogin
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (user) => dispatch(logIn(user)),
    AllUsers: (users) => dispatch(allUsers(users)),
    JoinedRooms: (Rooms) => dispatch(JoinedRooms(Rooms)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
