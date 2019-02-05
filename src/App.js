import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    if (!sessionStorage.getItem("token")) {
      return (
        <div className="App">
          <header className="App-header">
            <SignUpForm></SignUpForm>
          </header>
        </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
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

  submit() {
    sessionStorage.setItem("token","");
  }

  render() {
    return (
      <form>
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
        <button onClick={() => { this.submit() }}>Submit</button>
      </form>
    )
  }
}
export default App;
