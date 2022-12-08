/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
import NProgress from 'nprogress'

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/v2/',
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
      .request({ method: 'get', url: 'gateway' })
      .then((response) => {
        if (callback) callback(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  getGateway(id, callback) {
    apiClient
      .request({
        method: 'get',
        url: `gateway/${id}`,
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        alert(error.response.data)
        console.log(error)
      })
  },
  createGateway(gateway, callback) {
    apiClient
      .request({
        method: 'post',
        url: 'gateway/',
        data: gateway,
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        alert(error.response.data)
        console.log(error)
      })
  },
  updateGateway(gateway, callback) {
    apiClient
      .request({
        method: 'patch',
        url: 'gateway/',
        data: gateway,
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        alert(error.response.data)
        console.log(error)
      })
  },
  deleteGateway(id, callback) {
    apiClient
      .request({
        method: 'delete',
        url: `gateway/${id}`,
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        alert(error.response.data)
        console.log(error)
      })
  },
  updatePeripheral(peripheral, callback) {
    apiClient
      .request({
        method: 'patch',
        url: 'peripheral/',
        data: peripheral,
      })
      .then((response) => {
        callback(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
