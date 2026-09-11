import axios from 'axios';

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then(resp => {
        resolve(resp.data);
      })
      .catch(err => reject(err));
  });
}

// const options = {
//   method: 'GET',
//   url: SERVICES.CHECK_MAIL_BUNDLING(params),
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Authorization': `Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3Jk`
//   }
// };

// return fetch(options);