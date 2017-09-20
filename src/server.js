const http = require('http');
const url = require('url');
const query = require('querystring');
const handler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGET = (request, response, parsedURL) => {
  let status;
  const accepted = request.headers.accept.split(',');
  const type = accepted[0] || 'application/json';
  // console.dir(parsedURL);
  const params = query.parse(parsedURL.query);
  switch (parsedURL.pathname) {
    case '/style.css':
      handler.getCSS(request, response);
      break;
    case '/client.html':
    case '/':
      handler.getIndex(request, response);
      break;
    case '/success':
      status = 200;
      handler.respond(request, response, status, type);
      break;
    case '/badRequest':
      if (params.valid) {
        status = 200;
      } else {
        status = 400;
      }
      handler.respond(request, response, status, type);
      break;
    case '/unauthorized':
      if (params.loggedIn === 'yes') {
        status = 200;
      } else {
        status = 401;
      }
      handler.respond(request, response, status, type);
      break;
    case '/forbidden':
      status = 403;
      handler.respond(request, response, status, type);
      break;
    case '/internal':
      status = 500;
      handler.respond(request, response, status, type);
      break;
    case '/notImplemented':
      status = 501;
      handler.respond(request, response, status, type);
      break;
    default:
      status = 404;
      handler.respond(request, response, status, type);
      break;
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  // console.log("Recieved a request.");
  handleGET(request, response, parsedURL);
};

http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
