// ------
// ROUTES
// ------

const express = require('express');
const router = express.Router();

// URL (Uniform Resource Locator)
// URL http://localhost:4545/hello_world
//    scheme |   host  | port | path
//
// The "scheme" identifies the protocol being used
// to communicate. Could be HTTP, HTTPS, SSH, FTP, TCP, WS, etc
//
// The "host" identifies te domain or IP that hosting the server
//
// The "port" specifies the port that is being used by
// that web app on the server
//
// The "path" identifies the location of a resource on the server

// The following method creates a "route"
// - The name of the method ('i.e. `get`) corresponds to
// an HTTP VERB (get, post, delete, patch, put, etc)
// - The first argument to the method is the "path" of a URL
// - The second argument is a callback that is triggered when
// a client makes a request to that route
// using the correct/matching HTTP VERB
// So in this case, when a client makes a GET request to "/hello_world"
// The callback will execute
router.get('/hello_world', (request, response) => {
    // The "request" argument is an object that represents
    // the HTTP request being made by a client (i.e. browser)
    // It contains the HTTP headers, the data, the URL, the HTTP verb,
    // etc

    // The " response" argument is an object that represents the server's
    // response to the client. We build the response ourselves by calling
    // methods that belong to the response object, in order to add data
    // e.g. HTML, JSON, etc
    // We can also specify the status codes and HTTP headers
    //   console.log('This is the hello_world route');
    // We can modify the response object by setting the status code
    // or headers. But this must be done before sending back a response
    // to the client
    // response.status(200);

    // The `send` method of `response` takes a string and adds to
    // to the response as its data - the payload.
    // It terminates the response, sending the response to the browser.
    response.send('<h1>Hello World</h1>');

    // If we try to modify the response object, or send a second response
    // to the client, our server will crash!
    // response.send('Other string');
    // That means we can only have one method per route that sends a
    // a response to the client.
});

// Create a route for the root "/" path
// This will send/render an ejs template to the client
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // A week in millisenconds
router.get('/', (request, response) => {
    response.cookie('myCookie', 'cookie value here', {
        maxAge: COOKIE_MAX_AGE,
    });
    // `reponse.render(<ejs-file-path-within-views-directory>)`
    // Renders an EJS template located at "views/" + <ejs-file-path>

    // In the call below, the file at "./views.welcome.ejs" is
    // rendered into HTML and is sent as the payload of ther server's
    // response to the client.
    // Like `response.send`, this terminates the response.
    response.render('clucks');
});

router.get('/contact_us', (request, response) => {
    response.render('contactUs');
});

router.get('/thank_you', (request, response) => {
    const params = request.query;
    //   console.log('params', params);
    // The object properties of params are named based on the "name" attributes
    // for the inputs of the form.
    const fullName = params.fullName;
    const favoriteColor = params.favoriteColor;
    const favoriteDay = params.favoriteDay;
    const message = params.message;

    response.locals.fullName = fullName;

    response.render('thankYou', {
        favoriteDay: favoriteDay,
        favoriteColor: favoriteColor,
        message: message,
    });
});

router.post('/sign_in', (req, res) => {
    const params = req.body;
    // `req.body` is only avaiable if the "urlencoded" middleware is being used,
    // and it will contain data from a submitted form as an object

    // `response.cookie(<cookie-name>, <cookie-value>, <options>)`
    // The `res.cookie` method is added to the `response` object
    // by the `cookie-parser` middleware.
    // We use this method to send cookies to the browser.
    // - The first argument is a string that represent's the name of the cookie
    // - The second is the value for that cookie
    // - (Optional) The last arg are the options for that cookie
    res.cookie('username', params.username, { maxAge: COOKIE_MAX_AGE });
    // Like `response.send` and `response.render`, `response.redirect`
    // terminates the response with a redirect status code and a location (URL)
    // When the browser receives a redirect response, it makes a follow-up request
    // to the provided location.
    // In this case, the broswe is send to our welcome / root route ("/")
    res.redirect('/');
});

router.post('/sign_out', (req, res) => {
    // we user `response.clearCookie` to remove the specific cookie with
    // that cookie-name
    // In this case, we are removing the `username` cookie from th browser
    res.clearCookie('username');
    res.redirect('/');
});

// MAKE SURE YOU EXPORT!
module.exports = router;
