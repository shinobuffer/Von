import axios from 'axios';
import qs from 'qs';
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.API_ROOT;
export default ({store,redirect},inject)=>{
  // console.log(store);
  // console.log(redirect);
  axios.interceptors.response.use(
    res=>res,
    err=>{
      if (err.response)
        switch (err.response.status) {
          case 401:
            store.commit('account/logout');
            redirect('/');
            break;
          case 404:
            console.warn('api not find');
        }
      return Promise.reject(err.response.data)
    }
  );

  inject('fetch',(url,params={})=>{
    return new Promise((resolve,reject)=>{
      axios.get(url,{
        params:params
      }).then(response=>{
        resolve(response)
      }).catch(err=>{
        reject(err)
      })
    })
  });

  inject('post',(url,data={},op={headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}})=>{
    return new Promise((resolve,reject)=>{
      axios.post(url,qs.stringify(data),op)
        .then(response=>{
          resolve(response)
        }).catch(err=>{
        reject(err)
      })
    })
  });

  inject('post_form',(url,data,op={headers: {'Content-Type': 'multipart/form-data'},timeout:100000})=>{
    return new Promise((resolve,reject)=>{
      axios.post(url,data,op)
        .then(response=>resolve(response))
        .catch(err=>reject(err))
    })
  });
}
