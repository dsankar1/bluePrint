import React from "react";

const LandingPage = (props) => {
    return (
        <div>
            <h1>Username: {props.user.username}</h1>
            <h1>Firstname: {props.user.firstname}</h1>
            <h1>Lastname: {props.user.lastname}</h1>
            <h1>Token: {props.user.token}</h1>
        </div>
    );
}

export default LandingPage;