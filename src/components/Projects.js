import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// css
import "../css/Projects.css";

//components
import CreateProject from "./CreateProject";
import Spinner from "./Spinner";

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: undefined,
            filter: ""
        };
        this.fetchProjects = this.fetchProjects.bind(this);
        this.filterProjects = this.filterProjects.bind(this);
        this.addProject = this.addProject.bind(this);
        this.projectList = this.projectList.bind(this);
    }

    fetchProjects() {
        var authOptions = {
            method: "GET",
            url: "http://localhost:3001/api/projects",
            headers: {
                "x-access-token": this.props.user.token
            }
        };
        axios(authOptions)
        .then(result => {
            this.setState({ projects: result.data.projects });
        })
        .catch(err => {
            this.setState({ projects: null });
            console.log(err);
        });
    }

    addProject(project) {
        this.setState({ projects: [...this.state.projects, project] });
    }

    filterProjects() {
        var projects = this.state.projects;
        var filtered;
        if (projects) {
            filtered = projects.map((project, index) => (
                project.title.toUpperCase().includes(this.state.filter.toUpperCase()) ?
                <tr key={ index }>
                    <td><Link to={ "/projects/" + project.id }>{ project.title }</Link></td>
                    <td>{ project.risk_status }</td>
                    <td>
                        { 
                            project.requirements_hours 
                            + project.designing_hours
                            + project.coding_hours 
                            + project.testing_hours 
                            + project.management_hours
                        }
                    </td>
                    <td>{ project.manager_name }</td>
                    <td>{ project.description }</td>
                </tr> : null
            ));    
        }
        return filtered;
    }

    loading() {
        return (
            <Spinner id="project-spinner"/>
        );
    }

    projectList() {
        return (
            <div id="projects" className="gray-border">
                <input type="text" className="form-control filter-projects-input" name="search" placeholder="Search..."
                    onChange={ event => this.setState({ filter: event.target.value }) }/>
                <CreateProject user={ this.props.user } addProject={ this.addProject }/>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Hours</th>
                            <th>Manager</th>
                            <th>Description</th>
                        </tr>
                        { this.filterProjects() }
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        this.fetchProjects();
    }

    render() {
        return (
            <div>
                <div className="page-header">
                    Projects
                </div>
                { this.state.projects === undefined ? this.loading() : this.projectList() }
            </div>
        )
    }
}

export default Projects;