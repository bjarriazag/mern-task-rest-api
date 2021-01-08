const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../../util/logger')(module);
const { JWT_SECRET } = require('./imports');

const cryptHasher = async (text) => {
  const salt = await bcryptjs.genSalt(10);
  text = await bcryptjs.hash(text, salt);
  return text;
};

const cryptCompare = async (text, hashedText) => {
  const comparedText = await bcryptjs.compare(text, hashedText);
  return comparedText;
};

const generateToken = async (payload) => {
  const signToken$ = new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
      if (error) {
        logger.error(error);
        reject(error);
        throw error;
      }
      resolve(token);
    });
  });
  let generatedToken;
  await signToken$
    .then((token) => {
      generatedToken = token;
      return generatedToken;
    })
    .catch(() => {
      generatedToken = null;
    });
  return generatedToken;
};

module.exports = {
  cryptHasher,
  cryptCompare,
  generateToken,
};
