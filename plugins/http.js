import axios from 'axios';
import qs from 'qs';
axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.API_ROOT;
export default ({app,store,redirect,req},inject)=>{
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
            console.warn(err.response.config.url+' not find');
        }
      return Promise.reject(err)
    }
  );

  inject('fetch',(url,params={},req=null)=>{
    return new Promise((resolve,reject)=>{
      axios.get(url,{
        params:params,
        headers:req?req.headers:{}
      }).then(response=>{
        resolve(response)
      }).catch(err=>{
        reject(err)
      })
    })
  });

  // 原版
  // inject('fetch',(url,params={})=>{
  //   return new Promise((resolve,reject)=>{
  //     axios.get(url,{
  //       params:params
  //     }).then(response=>{
  //       resolve(response)
  //     }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // });
  //
  // app.$relayFetch = (url,params,headers)=>{
  //   return new Promise((resolve, reject)=>{
  //     axios.get(`http://localhost${url}`,{
  //       params:params,
  //       headers:headers
  //     }).then(res=>{
  //       resolve(res)
  //     }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // };

  inject('post',(url,data={},req=null)=>{
    return new Promise((resolve,reject)=>{
      axios.post(url,qs.stringify(data),{
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          ...(req?req.headers:{})
        }
      }).then(response=>{
          resolve(response)
        }).catch(err=>{
        reject(err)
      })
    })
  });

  // 原版
  // inject('post',(url,data={},op={headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}})=>{
  //   return new Promise((resolve,reject)=>{
  //     axios.post(url,qs.stringify(data),op)
  //       .then(response=>{
  //         resolve(response)
  //       }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // });
  //
  // app.$relayPost = (url,data,headers)=>{
  //   return new Promise((resolve,reject)=>{
  //     axios.post(`http://localhost${url}`,qs.stringify(data),{
  //       headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',...headers}
  //     }).then(res=>{
  //       resolve(res)
  //     }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // };

  inject('post_form',(url,data,op={headers: {'Content-Type': 'multipart/form-data'},timeout:100000})=>{
    return new Promise((resolve,reject)=>{
      axios.post(url,data,op)
        .then(response=>resolve(response))
        .catch(err=>reject(err))
    })
  });
}
