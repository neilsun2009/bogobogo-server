const generalController = require('../db/controllers/general'),
  GENERAL_CONFIG = require('../config').GENERAL_INIT;

function init() {
  // check if general exists
  generalController.getGeneral()
    .then((data) => {
      if (!data) {
        generalController.addGeneral(GENERAL_CONFIG)
          .then(() => {
            console.log('Set up initial general data.');
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => {
      console.log(err);      
    });
}

module.exports = init;