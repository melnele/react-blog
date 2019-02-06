import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  submit() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    window.location.reload();
  }

  updateText(value) {
    this.setState({
      text: value,
    });
  }

  async post() {
    try {
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'authorization': sessionStorage.getItem("token")
        }
      };
      await axios.post('http://localhost:8080/api/blog/create', this.state, config);
    } catch (error) {
      alert(error.response.data.msg);
    }
    window.location.reload();
  }

  render() {
    if (!sessionStorage.getItem("token")) {
      return (
        <div className="App">
          <header className="App-header-sign">
            <SignUpForm></SignUpForm>
          </header>
        </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <div id="signout">
            <h3 id="username">{sessionStorage.getItem("username")}</h3>
            <input type="button" value="Sign Out" onClick={() => { this.submit() }} />
          </div>
          <div>
            <textarea id="posttext"
              onChange={(event) => { this.updateText(event.target.value) }}
              value={this.state.username}></textarea>
            <input id="postsubmit" type="button" value="Post" onClick={() => { this.post() }} />
            <br></br>
            <hr></hr>
          </div>
          <BlogPosts></BlogPosts>
        </header>
      </div>
    );
  }
}

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  updatePassword(value) {
    this.setState({
      password: value,
    });
  }

  updateUsername(value) {
    this.setState({
      username: value,
    });
  }

  async signup() {
    try {
      await axios.post('http://localhost:8080/api/user/signup', this.state);
      var token = (await axios.post('http://localhost:8080/api/user/signin', this.state)).data;
      sessionStorage.setItem("token", token.data);
      sessionStorage.setItem("username", this.state.username);
    } catch (error) {
      alert(error.response.data.msg);
    }
    this.setState({
      password: '',
    });
    window.location.reload();
  }

  async signin() {
    try {
      var token = (await axios.post('http://localhost:8080/api/user/signin', this.state)).data;
      sessionStorage.setItem("token", token.data);
      sessionStorage.setItem("username", this.state.username);
    } catch (error) {
      alert(error.response.data.msg);
    }
    this.setState({
      password: '',
    });
    window.location.reload();
  }

  render() {
    return (
      <form>
        <h1>Sign Up/In</h1>
        <input
          type="text"
          onChange={(event) => { this.updateUsername(event.target.value) }}
          value={this.state.username}
        />
        <br></br>
        <input
          type="password"
          password={this.state.password}
          onChange={(event) => { this.updatePassword(event.target.value) }}
        />
        <br></br>
        <input type="button" value="Sign Up" onClick={() => { this.signup() }} />
        <input type="button" value="Sign In" onClick={() => { this.signin() }} />
      </form>
    )
  }
}

class BlogPosts extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }
  componentDidMount() {
    var config = {
      headers: {
        'Content-Type': 'application/json',
        'authorization': sessionStorage.getItem("token")
      }
    };
    axios.get('http://localhost:8080/api/blog/getall', config)
      .then(res => this.setState({ data: res.data.data }));
  }

  render() {
    return (
      <div>
        <h3>Feed</h3>
        <ul>
          {this.state.data.map(item => (
            <li>
              <p>{item.text}</p>
              <small>By {item.user.username}</small>
              <hr></hr>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
