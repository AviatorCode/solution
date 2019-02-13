const path = require('path');
const express = require('express');
// Requiring the "express" package returns a function
// that creates an instance of the express application
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');




// calling the function returns to us our app
// This app will become our server
const app = express();
// Typing the template name followed by `.ejs` everytime is annoying
// This lets express/our app know that if we try to render a view
// and we do not provide a file extension (like .ejs), our app
// should assume by default that the extension is .ejs
app.set('view engine', 'ejs');

// STATIC ASSETS
// Use `path.join` to combine string arguments into directory paths
// For Example:
// path.join('/', 'Users', 'bob'); // => '/Users/bob'

// `__dirname` is a global variable available anywherer in any applicaiton
// that is run by Node that returns the full directory path beginning from
// root (i.e. '/') to the location of the file where `__dirname` is used.
// console.log('__dirname:', __dirname);

// The static assets middleware will take all the files and directories
// at a specified path and serve them publically with their own URL.
app.use(express.static(path.join(__dirname, 'public')));
// The line above connects our `public` directory to express
// so that it can serve the browser those images/css files/ bropwser-side
// js files, etc

// ----------
// MIDDLEWARE
// ----------

// LOGGER
// app.use is a method that states we would like to call the
// callback function given to use with  every single request
// In this case, logger('dev') reeturns to us that callback
// to be called later, since logger is a higher order function
app.use(logger('dev'));

// BODY PARSER / URLENCODED
// This middleware will decode the data that was submitted
// from the form using the "POST" HTTP verb

// When the "extended" option is set to `true`, it will allow
// form data to tak the shape of arrays
// or objects. But if set to `false`, you can only get string from
// form data.
app.use(express.urlencoded({ extended: true }));
// It will modify the `request` object given to routes
// by adding a property to it named `body`
// `request.body` will be an object containing the data from our form

// METHOD OVERRIDE
app.use(
    // Without this, we cannot accept DELETE or PATCH or PUT requests from
    // the browser!
    methodOverride((req, res) => {
        if (req.body && req.body._method) {
            const method = req.body._method;
            // This modifies the request object
            // it changes it from a POST request
            // to be whatever the value for _method was
            // within the form that was just submitted
            return method;
        }
    }),
);

// COOKIE PARSER
app.use(cookieParser());
// What cookieParser does as a middleware is modify the request and response objects
// that are given to all of our routes
// it adds a property to the request object named `cookies` which is an object itself
// of key value pairs
// it adds a method to response object called cookie()
// which we will use to set cookies

// CUSTOM MIDDLEWARE
app.use((request, response, next) => {
    // console.log('cookies:', request.cookies);
    // Read cookies from the request using `request.cookies`
    // They're represented by an object whose properties are cookie-names
    // and the values associated with those properties are the corresponding
    // cookie values
    // The is only available when "cookie-parser" middleware is installed and setup.
    const username = request.cookies.username;

    // Set properties on `response.locals` to create variables that
    // are global and available to all of the rendered templates.
    response.locals.loggedInUserName = username || '';

    // The third argument to all middlewars is a callback function
    // named "next". When called, it tells Express that this middleware is complete
    // and moves on to the next middleware in line, or if it is the last middleware
    // begins looking for the route that matches the request
    next();
});

// ------
// ROUTES
// ------

// const postsRouter = require('./routes/postsRouter');
// // All requests that being with the path "/posts" should be sent
// // and handled by the postsRouter
// // In addition, any route defined within the postsRouter
// // will automatically have "/posts" prepended to the path specified
// // within that route
// app.use('/posts', postsRouter);

//const clucksRouter = require('.routes/clucksRouter')
//app.use('/clucks', clucksRouter)

const baseRouter = require('./routes/baseRouter');
// the baseRouter defined within and exported from `routes/baseRouter.js`
// is being "hooked up" to our app in the line of code below
// This says that all requests with any HTTP verb, and to any path beginning
// with  "/" should be handled by the baseRouter
app.use('/', baseRouter);

 //const clucksRouter = require('./routes/clucksRouter');
 //app.use('/clucks', clucksRouter);

// ------------
// RUN SERVER
// ------------
const PORT = 5000;
const HOST = 'localhost'; // 127.0.0.1
app.listen(PORT, HOST, () => {
    console.log(`Server is listening at http://${HOST}:${PORT}`);
});
