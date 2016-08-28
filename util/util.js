export function waitForAll(promises) {
  return new Promise(function(resolve, reject){
    let settled = 0 ,fulfilled = 0;
    for (let i = 0; i < promises.length; i++) {
      promises[i]
      .then(function (resposeCode) {
        // console.log(resposeCode);
        settled++;
        if (resposeCode == 200) {
          fulfilled ++;
        }
        if(settled == promises.length) {
          resolve(fulfilled);
        }
      })
      .catch(function (err) {
        settled++;
        console.log(err);
        if(settled == promises.length) {
          resolve(fulfilled);
        }
      });
    }
  });
}

export function BasicAuthToken(user,pass){
  let buf = new Buffer(user+":"+pass)
  return "Basic " + buf.toString('base64');
}
