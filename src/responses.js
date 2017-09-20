const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/css',
  });
  response.write(css);
  response.end();
};

const respond = (request, response, status, type) => {
  response.writeHead(status, { 'Content-Type': type });

  let id;
  let mess;

  switch (status) {
    case 200:
      id = 'success';
      mess = 'There have been no errors.';
      break;
    case 400:
      id = 'unreadable';
      mess = 'The request was not understood, please correct syntax before trying again.';
      break;
    case 401:
      id = 'inauthentic';
      mess = 'Access requres the user to be logged in under a valid account.';
      break;
    case 403:
      id = 'forbidden';
      mess = 'Users are not privy to this data or operation. Please do not try again.';
      break;
    case 500:
      id = 'whoops';
      mess = 'There has been an error server-side. My fault, not yours.';
      break;
    case 501:
      id = 'unrecognized';
      mess = 'The request made is not even supported, let alone recognized.';
      break;
    default:
      id = 'missing';
      mess = 'The requested resource has not been found at this moment. Feel free to try again at another time.';
      break;
  }

  if (type === 'application/json') {
    const obj = {
      id,
      message: mess,
    };
    response.write(JSON.stringify(obj));
  } else if (type === 'text/xml') {
    let obj = '<response>';
    obj = `${obj} <id>${id}</id>`;
    obj = `${obj} <message>${mess}</message>`;
    obj = `${obj} </response>`;
    response.write(obj);
  }
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  respond,
};
