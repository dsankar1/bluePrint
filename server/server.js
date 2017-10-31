var express = require("express");
var mysql = require("mysql");
var parser = require("body-parser");
var config = require("./config");
var jwt = require("jsonwebtoken");
//var cors = require("cors");

var app = express();
var apiRoutes = express.Router();

//app.use(cors());
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
const userExists = 1;
const userNotFound = 2;
const incorrectPassword = 3;
const serverError = 4;
const missingFields = 5;

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
app.post("/api/authenticate", function (req, res) {
    if (typeof req.body.username != 'undefined'
        && typeof req.body.password != 'undefined'
    ) {
        var username = req.body.username;
        var password = req.body.password;
        var sql = "select * from users where username='" + username + "';";

        executeQuery(sql, function (err, result) {
            if (err) {
                console.log("Database Server Error");
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
app.get("/api/projects", function (req, res) {
    console.log(req.decoded.username);
    var username = req.decoded.username;
    var sql = "select project_access.manager, projects.*, functional_requirements.description as functional_requirements, nonfunctional_requirements.description as nonfunctional_requirements, risks.description as risks from (((project_access left outer join projects on project_access.project_id = projects.id) left outer join risks on project_access.project_id = risks.project_id) left outer join functional_requirements on project_access.project_id = functional_requirements.project_id) left outer join nonfunctional_requirements on project_access.project_id = nonfunctional_requirements.project_id where project_access.username = '" + username + "';";
    executeQuery(sql, function(err, results) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results);
            res.json({ results });
        }
    });
});

app.use(express.static(__dirname + '/../build'));

// returns index.html for every get request that isn't part of /api
app.get('*', function(req, res){
  res.sendFile(__dirname + '/../build/index.html');
});

app.listen(3001, function () {
    console.log("Listening on port 3001");
});