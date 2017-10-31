import React from "react";
import { Redirect } from "react-router-dom";
import logo from "../res/blueprint_logo.png";
import axios from "axios";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.authenticateCredentials = this.authenticateCredentials.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }

    isLoading(on) {
        var spinner = document.getElementById("spinner");
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

    authenticateCredentials() {
        this.isLoading(true);
        axios.post("http://localhost:3001/api/authenticate", this.state)
        .then(response => {
            this.props.updateToken(response.data);
            if (!response.data.valid) {
                this.isLoading(false);
            }
        })
        .catch(err => {
            console.log(err);
            this.isLoading(false);
        });
    }

    render() {
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-label">
                        <img src={logo} height="30px" alt="bluePrint Logo" />
                    </div>
                    <div id="spinner"></div>
                    <div id="form" className="login-form">
                        <div className="group">
                            <input type="text" required
                                onChange={event => this.setState({ username: event.target.value })} />
                            <span className="highlight"></span><span className="bar"></span>
                            <label>Username</label>
                        </div>
                        <div className="group">
                            <input type="password" required
                                onChange={event => this.setState({ password: event.target.value })} />
                            <span className="highlight"></span><span className="bar"></span>
                            <label>Password</label>
                        </div>
                        <button className="btn btn-submit" type="submit"
                            onClick={event => { this.authenticateCredentials(); }}>
                            Login
                        </button>
                        <a className="login-forgot" href="#">Forgot Password?</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;