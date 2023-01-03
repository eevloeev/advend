import axios, { AxiosRequestConfig } from "axios"

const apiRequest = (config: AxiosRequestConfig) =>
  axios({
    baseURL: `${process.env.API_URL}/api/v1/`,
    ...config,
  })

export default apiRequest
