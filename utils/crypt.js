const crypto = require('crypto');

let crypt = {
  key : 'bogobogo%20$^',
  md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
  },
  encode(text) {
    let cipher = crypto.createCipher('aes-256-cbc',this.key);
    let ciphered = cipher.update(text,'utf8','hex');
    return ciphered + cipher.final('hex');
  },
  decode(text) {
    let cipher = crypto.createDecipher('aes-256-cbc',this.key);
    let ciphered = cipher.update(text, 'hex','utf8');
    return ciphered + cipher.final('utf8');
  }
};

module.exports = crypt;