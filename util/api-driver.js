import {BasicAuthToken} from './util.js';
import {user, pass} from './cred';
import fetch from 'node-fetch';

const apiURL = 'https://edulunch.fi/api';
const restaurantsUrlPath = '/restaurants'.replace(/^\//,'');

export function fetchRestaurants() {

  const url = `${apiURL}/${restaurantsUrlPath}`;
  console.log("fetching restaurants' data ...");
  return fetch(url, {method: 'GET'})
    .then( response => {
      let contentType = response.headers.get("content-type").replace(/;.*$/,'');
      if ( contentType != "application/json") {
        return Promise.reject("received wrong content-type.")
      }
      return response.json();
    })
    .catch(err => {
      console.log('Cannot fetch restaurants.');
      throw err;
    });
}

export function saveMenu(restaurant, menu) {
  const url = `${apiURL}/${restaurantsUrlPath}/${restaurant}/menu`;
  let fetchOptions = {
    method:'POST',
    body: JSON.stringify(menu),
    headers: {'Content-Type':'application/json', 'authorization': BasicAuthToken(user, pass)}
  };
  return fetch(url, fetchOptions).then(res => {
    return res.status;
    // return res.json()
  });
}
