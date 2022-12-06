/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
import NProgress from 'nprogress'

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors to initiate and stop progress bar during axios requests
apiClient.interceptors.request.use((config) => {
  NProgress.start()
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },
  function (error) {
    NProgress.done()
    return Promise.reject(error)
  },
)

export default {
  getGateways(callback) {
    apiClient
      .request({ method: 'get', url: 'gateways' })
      .then((response) => {
        if (callback) callback(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  getGateway(serial, callback) {
    apiClient
      .request({
        method: 'get',
        url: `gateway/`,
        params: {
          serial
        }
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  deleteGateway(serial, callback) {
    apiClient
      .request({
        method: 'delete',
        url: `gateway/`,
        params: {
          serial
        }
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
