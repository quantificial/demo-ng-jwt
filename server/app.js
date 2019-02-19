const _ = require('lodash');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
var winston = require('winston');
const {transports, createLogger, format} = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //      
      //new (winston.transports.File)({'timestamp':true}),
      new winston.transports.File({ filename: 'error.log', level: 'error', 'timestamp': true }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }  

var TODOS = [
    { 'id': 1, 'user_id': 1, 'name': "Get Milk", 'completed': false },
    { 'id': 2, 'user_id': 1, 'name': "Fetch Kids", 'completed': true },
    { 'id': 3, 'user_id': 2, 'name': "Buy flowers for wife", 'completed': false },
    { 'id': 4, 'user_id': 3, 'name': "Finish Angular JWT Todo App", 'completed': false },
];
var USERS = [
    { 'id': 1, 'username': 'jemma' },
    { 'id': 2, 'username': 'paul' },
    { 'id': 3, 'username': 'sebastian' },
];
function getTodos(userID) {
    var todos = _.filter(TODOS, ['user_id', userID]);

    return todos;
}
function getTodo(todoID) {
    var todo = _.find(TODOS, function (todo) { return todo.id == todoID; })

    return todo;
}
function getUsers() {
    return USERS;
}

// support json body
app.use(bodyParser.json());

// support urlencoded form
app.use(bodyParser.urlencoded({ extended: false }))

// the secret

const secretKey = 'qwertyuiop[]12345567890-='

app.use(expressJwt({secret: secretKey}).unless({path: ['/api/auth']}));

// express jwt error handling
app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({message:err.message});
      logger.error(err);
      return;
    }
 next();
});



app.get('/', function (req, res) {
    res.send('Angular JWT Todo API Server')
});

// get jwt token
app.post('/api/auth', function(req, res) {
    const body = req.body;
    console.log(req.body);

    const user = USERS.find(user => user.username == body.username);
    if(!user || body.password != 'todo') return res.sendStatus(401);
    
    // jwt.sign( payload, secret or key, options and callback)
    var token = jwt.sign({userID: user.id}, secretKey, {expiresIn: '2h'});
    res.send({token});
});

app.get('/api/todos', function (req, res) {
    res.type("json");
    res.send(getTodos(req.user.userID));
});

app.get('/api/todos/:id', function (req, res) {
    var todoID = req.params.id;
    res.type("json");
    res.send(getTodo(todoID));
});

app.get('/api/users', function (req, res) {
    res.type("json");
    res.send(getUsers());
});

app.listen(4000, function () {
    console.log('Angular JWT Todo API Server listening on port 4000!')
});
