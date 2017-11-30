var express = require("express");
var mysql = require("mysql");
var parser = require("body-parser");
var config = require("./config");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var morgan = require("morgan");

var app = express();
var apiRoutes = express.Router();

app.use(cors());
app.use(morgan("tiny"));
app.use(parser.json());
app.set('secret', config.secret);

var pool = mysql.createPool({
    connectionLimit: '100',
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port
});

// Error Codes
const userNotFound = 1;
const incorrectPassword = 2;
const serverError = 3;
const missingFields = 4;

// Helper Functions
function executeQuery(sql, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        else {
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    return callback(err, null);
                }
                return callback(null, result);
            });
        }
    });
}

// accepts username and password
// returns JWT
app.post("/api/authenticate", (req, res) => {
    if (typeof req.body.username != 'undefined'
    && typeof req.body.password != 'undefined') {
        var username = req.body.username;
        var password = req.body.password;
        var sql = "select * from users where username='" + username + "';";

        executeQuery(sql, function (err, result) {
            if (err) {
                console.log("Database Server Error");
                console.log(err);
                res.json({ valid: false, errorCode: serverError });
            }
            else if (result.length === 0) {
                console.log("User Not Found");
                res.json({ valid: false, errorCode: userNotFound });
            }
            else {
                var user = result[0];
                if (user.password === password) {
                    console.log("Request Successful");
                    const payload = {
                        username: username
                    };
                    var token = jwt.sign(payload, app.get('secret'), {
                        expiresIn: "300m" // expires in 5 hours
                    });
                    res.json({
                        valid: true,
                        username: user.username,
                        firstname: user.first_name,
                        lastname: user.last_name,
                        token: token
                    });
                }
                else {
                    console.log("Incorrect Password");
                    res.json({ valid: false, errorCode: incorrectPassword });
                }
            }
        });
    }
    else {
        console.log("Some Fields Undefined");
        res.json({ valid: false, errorCode: missingFields });
    }
});

// secures routes that require token to access & decodes token
apiRoutes.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

app.use('/api', apiRoutes);

// x-access-token http header needs to be included
app.get("/api/projects", (req, res) => {
    var username = req.decoded.username;
    var sql = "select projects.id, projects.title, projects.risk_status, projects.requirements_hours, projects.designing_hours, projects.coding_hours, projects.testing_hours, projects.management_hours, projects.manager_name, projects.description from project_access left outer join projects on project_access.project_id = projects.id where project_access.username = '" + username + "';";
    executeQuery(sql, function(err, results) {
        if (err) {
            console.log(err);
            res.json({ projects: [] })
        }
        else {
            res.json({ projects: results });
        }
    });
});

app.get("/api/projects/:id", (req, res) => {
    var username = req.decoded.username;
    var id = req.params.id;
    var sql = "select project_access.manager, projects.*, functional_requirements.description as functional_requirements, nonfunctional_requirements.description as nonfunctional_requirements, risks.description as risks from (((project_access left outer join projects on project_access.project_id = projects.id) left outer join risks on project_access.project_id = risks.project_id) left outer join functional_requirements on project_access.project_id = functional_requirements.project_id) left outer join nonfunctional_requirements on project_access.project_id = nonfunctional_requirements.project_id where project_access.username = '" + username + "' and project_access.project_id ='" + id + "';";
    executeQuery(sql, function(err, results) {
        if (err) {
            res.json({success: false, error: err});
        }
        else {
            res.json({ success: true, project: results[0] });
        }
    });
});

app.post("/api/projects", (req, res) => {
    if (req.body.title != undefined 
    && req.body.description != undefined
    && req.body.manager_name != undefined
    && req.body.risk_status != undefined) {
        var title = req.body.title;
        var description = req.body.description;
        var manager_name = req.body.manager_name;
        var risk_status = req.body.risk_status;
        var username = req.decoded.username;
        var sql1 = "insert into projects (title, description, manager_name, requirements_hours, designing_hours, coding_hours, testing_hours, management_hours, risk_status) values " + 
            "('" + title + "', '" + description + "', '" + manager_name + "', 0, 0, 0, 0, 0, '" + risk_status + "');"
        executeQuery(sql1, (err, results) => {
            if (err) {
                res.json({success: false, error: err});
            } else {
                var project_id = results.insertId;
                var sql2 = "insert into project_access (username, project_id, manager) values " + 
                "('" + username + "', " + project_id + ", 1);"
                executeQuery(sql2, (err, results) => {
                    if (err) {
                        res.json({success: false, error: err});
                    } else {
                        res.json({success: true, project_id: project_id});
                    }
                });
            }
        });
    } else {
        console.log("Some Fields Undefined");
        res.json({ success: false, error: "Missing fields", errorCode: missingFields });
    }
});

app.put("/api/projects", (req, res) => {

});

/*app.use(express.static(__dirname + '/../build'));

// returns index.html for every get request that isn't part of /api
app.get('*', function(req, res){
  res.sendFile(__dirname + '/../build/index.html');
});*/

app.listen(3001, function () {
    console.log("Listening on port 3001");
});