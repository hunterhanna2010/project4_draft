import React, {Component} from 'react';
import './App.css';
import WelcomeBody from './WelcomeBody';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';

class App extends Component {
  state = {
    token: '',
    user: null,
    errorMessage: '',
    lockedResult: ''
  }

  checkForLocalToken = () => {
    // Look in localStorage for a token
    let token = localStorage.getItem('mernToken')
    if (!token || token === 'undefined') {
      // if no token, remove all evidence of mernToken from localStorage and state 
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // if found a token, verify it on the backen 
      axios.post('/auth/me/from/token', {token})
        .then( response => {
          if (response.data.type === 'error') {
            localStorage.removeItem('mernToken') 
            this.setState({
              token: '',
              user: null, 
              errorMessage: response.data.message
            })
          } else {
            // if verified, store it back in localStorage and state 
            localStorage.setItem('mernToken', response.data.token)
            this.setState({
              token: response.data.token,
              user: response.data.user
            })
          }
        })
    }
  }

  componentDidMount = () => {
    this.checkForLocalToken()
  }

  liftToken = ({token, user}) => {
    this.setState({
      token,
      user
    })
  }

  logout = () => {
    localStorage.removeItem('mernToken')
    this.setState({
      token: '',
      user: null
    })
  }

  handleClick = (e) => {
    let config = {
      headers: {
        Authorization: `Bearer ${this.state.token}`
      }
    }
    axios.get('/locked/test', config).then( response => {
      this.setState({
        lockedResult: response.data
      })
    })
  }

  render (){
    let contents;
    if(this.state.user) {
      contents = (
        <> 
          <p>Hello, {this.state.user.name}</p>
          <button onClick={this.handleClick}>Test the protected route</button>
          <button onClick={this.logout}>Logout</button> <br />
          <p>{this.state.lockedResult}</p>

        </>
      )
    } else {
      contents = (
      <> 
      
      <Signup liftToken={this.liftToken} />
      <Login liftToken={this.liftToken} />
      <WelcomeBody />
      
      </>
    )
  }
  return (
    <div className="App">
      <header><h1>Welcome to JobTrackers! </h1></header>
      <div className="content-box">
        {contents}
      </div>
    </div>
  )
  }
}


export default App;
