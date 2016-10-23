import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory , Link } from 'react-router'
import { login , connectSocket } from '../actions'
import Login from '../components/loginForm'
import Register from '../components/registerForm'

class Home extends Component {
	constructor(props) {
        super(props);
         this.state = { registerForm:false, username_login:'', password_login:'', username_register:'', password_register:'',dumbuser:'' };
    }



	componentDidMount(){

		if(!this.props.socket){
			console.log("No Socket connection...attempting to connect socket");
			this.props.connectSocket(io());
		}

	}
  componentWillReceiveProps() {
    const received = JSON.parse(localStorage.getItem('token'));
    //received = JSON.parse(received);
    if (received !== null) {
      var token = received.token;
      
      fetch('http://localhost:8080/api/decode', {
               method: 'POST',
               headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
                body: JSON.stringify({
                token: token
                
        })
        })
        .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.auth == true) {
              this.props.login(received.username);
            browserHistory.push('/chat');
            }
          })
        
          .catch(function(error) {
            console.log("request failed");
          })
    }

  }

	handleUsernameChangeRegister(e) {
        this.setState({username_register: e.target.value});
      }
      handlePasswordChangeRegister(e) {
       this.setState({password_register: e.target.value});
      }
       handlePasswordChangeLogin(e) {
        this.setState({password_login: e.target.value});
     }

     handleUsernameChangeLogin(e) {
        this.setState({username_login: e.target.value});
     }

     handleRegister(){
     	fetch('http://localhost:8080/api/register', {
              method: 'POST',
              headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
             	body: JSON.stringify({
             		username: this.state.username_register,
 	             password: this.state.password_register
 	             })
  	  	})
  	  	.then(json => json.json())
  	  	.catch(function(error) {
 	  		console.log("request failed");
 	  	})
  	  }
  	  handleLogin(){
    
      fetch('http://localhost:8080/api/login', {
               method: 'POST',
               headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
                body: JSON.stringify({
                username: this.state.username_login,
                password: this.state.password_login
        })
        })
        .then((response) => response.json())
          .then((responseJson) => {
            var userInfo = {
              token:responseJson.token,
              username:responseJson.username
            }
            const serializedState = JSON.stringify(userInfo);
      
            localStorage.setItem('token', serializedState);
            
      
            this.props.login("auser");
            browserHistory.push('/chat');
          })
        
          .catch(function(error) {
            console.log("request failed");
          })
          
          
    
      }

	handleDumbLogin(){
		if(this.state.dumbuser && this.state.dumbuser !== ''  ){
			this.props.login(this.state.dumbuser);
			browserHistory.push('/chat')
		}
	}

  onClick(e){
    e.preventDefault();
    this.setState({registerForm: !this.state.registerForm});
  }

	render(){

    	return(
			<div>
			
 		      

          {this.state.registerForm && <Register switch={this.onClick.bind(this)} submit={this.handleRegister.bind(this)} password={this.handlePasswordChangeRegister.bind(this)} username={this.handleUsernameChangeRegister.bind(this)}/>}
				  {!this.state.registerForm && <Login switch={this.onClick.bind(this)} submit={this.handleLogin.bind(this)} password={this.handlePasswordChangeLogin.bind(this)} username={this.handleUsernameChangeLogin.bind(this)}/>}
          
        {
					(this.props.username) ? <Link to='/chat'>Find a chat!</Link> :  (
						<div>
							<input type='text' ref='dumblogin' onChange={ (evt)=>{this.setState({ dumbuser: evt.target.value })} } ></input>
							<button onClick={this.handleDumbLogin.bind(this)}>Dumb Login</button>
						</div>

					)

				}
				<h1>{(this.props.username == null || this.props.username == '') ? 'No user' : this.props.username }</h1>
			</div>
    	)
  }
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({login , connectSocket},dispatch);
}

function mapStateToProps(state){
	return { username:state.username, socket:state.socket }
}

export default connect(mapStateToProps,matchDispatchToProps)(Home)


