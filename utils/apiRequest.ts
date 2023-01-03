import axios, { AxiosRequestConfig } from "axios"

const apiRequest = (config: AxiosRequestConfig) =>
  axios({
    baseURL: "http://localhost:3000/api/v1/",
    ...config,
  })

export default apiRequest
