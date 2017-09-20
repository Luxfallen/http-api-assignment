const http = require('http');
const url = require('url');
const query = require('querystring');
const handler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGET = (request, response, parsedURL) => {
  let status;
  const accepted = request.headers.accept.split(',');
  const type = accepted[0] || 'application/json';
  const params = query.parse(parsedURL.query);
  if (parsedURL.pathname === '/style.css') {
    handler.getCSS(request, response);
  } else if (parsedURL.pathname === '/' || parsedURL.pathname === '/client.html') {
    handler.getIndex(request, response);
  } else {
    switch (parsedURL.pathname) {
      case '/success':
        status = 200;
        break;
      case '/badRequest':
        if (params.valid) {
          status = 200;
        } else {
          status = 400;
        }
        break;
      case '/unauthorized':
        if (params.loggedIn === 'yes') {
          status = 200;
        } else {
          status = 401;
        }
        break;
      case '/forbidden':
        status = 403;
        break;
      case '/internal':
        status = 500;
        break;
      case '/notImplemented':
        status = 501;
        break;
      default:
        status = 404;
        break;
    }
    handler.respond(request, response, status, type);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  handleGET(request, response, parsedURL);
};

http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
