# demo of using angular + backend api + jwt auth

This sample is published as part of the corresponding blog article at [https://www.toptal.com/angular/angular-6-jwt-authentication](https://www.toptal.com/angular/angular-6-jwt-authentication).

Visit https://www.toptal.com/blog and subscribe to our newsletter to read great posts!

# server
need to add the jwt package

npm install @auth0/angular-jwt

need to install body-parser, jsonwebtoken and express-jwt

npm install body-parser jsonwebtoken express-jwt

- body-parser is used to analyze, and could process different kind of response type, such as text, json, urlendcoded and could also handle different encoding

# sign and create the token
```
    var token = jwt.sign({userID: user.id}, secretKey, {expiresIn: '2h'});
```

## auth

http://localhost:4000/api/auth/

username and password

## Get Todos
http://localhost:4000/api/todos

header: Authorization: Bearer {token}

