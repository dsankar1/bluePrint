import React from "react";

class ProjectsPage extends React.Component {

    render() {
        return (
            <div>
                <h1>Username: {this.props.user.username}</h1>
                <h1>Firstname: {this.props.user.firstname}</h1>
                <h1>Lastname: {this.props.user.lastname}</h1>
                <h1>Token: {this.props.user.token}</h1>
            </div>
        )
    }
}

export default ProjectsPage;