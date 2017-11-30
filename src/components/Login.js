import React from "react";
import logo from "../res/blueprint_logo.png";
import axios from "axios";
import "../css/Login.css";
import Spinner from "./Spinner";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            usernameError: "",
            passwordError: ""
        };
        this.authenticateCredentials = this.authenticateCredentials.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.showErrorFromServer = this.showErrorFromServer.bind(this);
    }

    isLoading(on) {
        var spinner = document.getElementById("login-spinner");
        var form = document.getElementById("form");
        if (on) {
            spinner.style.display = "block";
            form.style.display = "none";
        }
        else {
            spinner.style.display = "none";
            form.style.display = "block";
        }
    }

    validateForm() {
        if (!this.state.username) {
            this.setState({usernameError: "Field Required"});
            return false;
        }
        if (!this.state.password) {
            this.setState({passwordError: "Field Required"});
            return false;
        }
        if (this.state.password.length < 5) {
            this.setState({passwordError: "Required 5 character length"});
            return false;
        }
        return true;
    }

    showErrorFromServer(errorCode) {
        this.setState({usernameError: "", passwordError: ""});
        switch (errorCode) {
            case 1: this.setState({usernameError: "Account not recognized"});
                break;
            case 2: this.setState({passwordError: "Incorrect password"});
                break;
            case 3: this.setState({usernameError: "Internal Server Error"});
                break;
            default: this.setState({usernameError: "Unknown Error"});
        }
    }

    authenticateCredentials() {
        if (this.validateForm()) {
            this.isLoading(true);
            axios.post("http://localhost:3001/api/authenticate", this.state)
            .then(response => {
                if (response.data.valid) {
                    this.props.updateUser(response.data);
                } else {
                    this.isLoading(false);
                    this.showErrorFromServer(response.data.errorCode);
                }
            })
            .catch(err => {
                console.log(err);
                this.isLoading(false);
            });
        }
    }

    render() {
        return (
            <div className="fill-page dark-blue-background">
                <div className="login-container">
                    <div className="login-header"><img src={logo} alt="bluePrint" height="30"/></div>
                    <Spinner id="login-spinner"/>
                    <form id="form" className="login-form">
                        <hr/>
                        <div className="form-group">
                            <label className="login-label" htmlFor="username">Username: <span style={{color: "red"}}>{this.state.usernameError}</span></label>
                            <input id="username" type="text" className="login-text form-control" 
                                onChange={event => this.setState({ username: event.target.value, usernameError: "" })}/>
                        </div>
                        <div className="form-group">
                            <label className="login-label" htmlFor="password">Password: <span style={{color: "red"}}>{this.state.passwordError}</span></label>
                            <input id="password" type="password" className="login-text form-control" 
                                onChange={event => this.setState({ password: event.target.value, passwordError: "" })}/>
                        </div>
                        <hr/>
                        <button type="submit" className="login-btn btn"
                            onClick={e => {e.preventDefault(); this.authenticateCredentials()}}>
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;