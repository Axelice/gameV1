import axios from 'axios';

export function saveScriptAPI(data: any) {
  return axios
    .post(`/api/saveScript`, data)
    .then(response => {
      console.log(response);
      debugger;
    })
    .catch(error => {
      if (error.response.status === 401) {
        window.location.href = '/login'
      }
    });
}
