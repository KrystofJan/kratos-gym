const fs = require('fs');

function logApi(msg){
  const date = new Date();

  return_message = "[" + date.toString() + "] - " + msg + "\n"; 

    fs.appendFile('../../Logs/APIlog.txt', return_message, err => {
        if (err) {
          console.error(err);
        }
      });
}

function logApiSuccess(msg){
  const date = new Date(year,month,day,hours,minutes,seconds,ms);

  return_message = "[" + date.toString() + "] - " + msg + "\n"; 

    fs.appendFile('../../Logs/APIlog.txt', return_message, err => {
        if (err) {
          console.error(err);
        }
      });
}

module.exports = {
  logApi,
};
