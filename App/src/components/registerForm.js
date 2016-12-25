import React, { Component } from 'react'

export default class Register extends Component{
	render(){
        return(
        	<div className="bodyLogin">
            <div className="registerForm">
           
            <div className="loginWrap">
            <h1>Register</h1>
			    <div>
			        <label>Username:</label>
			        <input type="text" name="username_reg"  onChange={this.props.username}/>
			    </div>
			    <div>
			        <label>Password:</label>
			        <input type="password" name="password_reg" onChange={this.props.password}/>
			    </div>
			    <div>
			        <button onClick={this.props.submit}>Register</button>
			    </div>
			    <a onClick={this.props.switch} href='#'>click to Login</a>
			    </div>
			</div>
			</div>
        )

    }
}