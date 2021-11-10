import axios from "axios";
import React from "react";
import "./Register.scss";
import { Link } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      fullname: "",
      password: "",
      imageFile: null,
      imageSrc: '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // employeeAPI = (url = "http://localhost:6081/api/Application/User") => {
  //   return {
  //       fetchAll: () => axios.get(url),
  //       create: newRecord => axios.post(url, newRecord),
  //       update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
  //       delete: id => axios.delete(url + id)
  //   }
  //}

  showPreview = e => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = x => {
        this.setState({
          imageFile,
          imageSrc: x.target.result
        })
      }
      reader.readAsDataURL(imageFile)
    }
  }

  handleChange(e) {
    const target = e.target;
    this.setState({
      [target.name]: target.value,
    });
  }


  async handleSubmit(event) {


    event.preventDefault();

    const url = "http://localhost:6081/api/Application/User";
    console.log(this.state);
    const { username, password, email, fullname, imageFile } = this.state;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password)
    formData.append('email', email)
    formData.append('fullname', fullname)
    formData.append('imageFile', imageFile)

    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1])
    }
    try {
      console.log("POSTING>>>")
      const res = await axios.post(url, formData)
      if (res) {
        console.log(res)
        this.props.history.push("/");
      }
    } catch (err) {

      console.log(err);
    }

    // /* Store user data in browser's local storage */
    // localStorage.setItem("currentUser", JSON.stringify(userData));
    // /*Redirect to the my network page */
    // this.props.history.push("/mynetwork");
  }



  render() {
    return (
      <div className="login-container">
        <div className="login-form">
          <form onSubmit={this.handleSubmit}>
            <label className="lable">Register</label>
            <div className="card">
              <img src={this.state.imageSrc} className="card-img-top" />
              <div className="card-body">
                <div className="form-group">
                  <input type="file" accept="image/*" className="form-control-file"
                    onChange={this.showPreview} id="image-uploader" required />
                </div>
              </div>
            </div>

            <input
              type="text"
              name="username"
              onChange={this.handleChange}
              placeholder="Username"
              className="input"
              required
            />
            <input
              type="email"
              name="email"
              onChange={this.handleChange}
              placeholder="Email"
              className="input"
              required
            />
            <input
              type="text"
              name="fullname"
              onChange={this.handleChange}
              placeholder="Fullname"
              className="input"
              required
            />
            <input
              type="password"
              name="password"
              onChange={this.handleChange}
              placeholder="Password"
              className="input"
              required
            />
            <input type="submit" className="button" placeholder="submit" />
            <div className="Form-group">
              <Link to="/" >
                Already have a Account!
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default Register;
