import axios, { AxiosRequestConfig } from "axios"

const apiRequest = (config: AxiosRequestConfig) =>
  axios({
    baseURL: `http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/v1/`,
    ...config,
  })

export default apiRequest
