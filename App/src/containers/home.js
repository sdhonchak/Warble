import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { login , connectSocket } from '../actions'

class Home extends Component {
	constructor(props) {
        super(props);
        this.state = { username:'', password:'',dumbuser:'' };
		this.props.connectSocket(io());
    }

	handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
       this.setState({password: e.target.value});
    }

	handleLogin(){



		fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
           	body: JSON.stringify({
             username: this.state.username,
             password: this.state.password
		 	})
	  	})
	  	.then(json => json.json())

	  	.catch(function(error) {
	  		console.log("request failed");
	  	})

	}

	handleDumbLogin(){
		this.props.login(this.state.dumbuser);
		browserHistory.push('/chat')
	}

	render(){

    	return(
	      <div>
		     <div className="loginForm">
			    <div>
			        <label>Username:</label>
			        <input type="text" name="username"  onChange={this.handleUsernameChange.bind(this)}/>
			    </div>
			    <div>
			        <label>Password:</label>
			        <input type="password" name="password" onChange={this.handlePasswordChange.bind(this)}/>
			    </div>
			    <div>
			        <button onClick={this.handleLogin.bind(this)}>Login</button>
			    </div>
			</div>

			<br/>
			<div>
				<input type='text' ref='dumblogin' onChange={ (evt)=>{this.setState({ dumbuser: evt.target.value })} } ></input>
				<button onClick={this.handleDumbLogin.bind(this)}>Dumb Login</button>
			</div>
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