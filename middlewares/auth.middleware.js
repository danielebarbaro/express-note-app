const authMiddleware = (request, response, next) => {
  const {headers} = request;
  if (headers['secret'] === process.env.API_KEY) {
    next();
  } else if (headers['secret'] != process.env.API_KEY && headers['secret'] ) {
    response
        .status(401)
        .json({
          'success': false,
          'code': 2002,
          'error': 'Forbidden',
        });
  } else {
    response
        .status(403)
        .json({
          'success': false,
          'code': 2001,
          'error': 'Unauthorized',
        });
  }
};

export default authMiddleware;
