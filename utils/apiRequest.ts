import axios, { AxiosRequestConfig } from "axios"

const apiRequest = (config: AxiosRequestConfig) =>
  axios({
    baseURL: `${window?.location?.origin}/api/v1/`,
    ...config,
  })

export default apiRequest
