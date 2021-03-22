import axios from 'axios'
import { URLSearchParams } from 'url'
import { createHmac } from 'crypto'

const ENDPOINT = 'https://antpool.com'
const TIMEOUT = 5000

const createNonce = () => Date.now()
const createSignature = (input, secret) => {
  let msg = ''
  for (const index in input) {
    msg += input[index]
  }
  return createHmac('sha256', secret).update(msg).digest('hex').toUpperCase()
}

const createApiCall = ({ key, secret, userId, coin, endpoint, timeout }) => (uri, params) => {
  const nonce = createNonce()
  const input = [
    userId,
    key,
    nonce
  ]

  const qs = new URLSearchParams({
    key,
    nonce,
    signature: createSignature(input, secret),
    coin,
    ...params
  })

  const instace = axios.create()

  instace.interceptors.response.use((response) => {
    if (response.data?.code !== 0) {
      throw Error(response.data.message)
    }
    return response.data.data
  }, (error) => {
    return Promise.reject(error)
  })

  const response = instace.request({
    url: `${endpoint}${uri}?${qs.toString()}`,
    method: 'POST'
  })

  return response
}

export default options => {
  const endpoint = (options && options.endpoint) || ENDPOINT
  const timeout = (options && options.timeout) || TIMEOUT
  const apiRequest = createApiCall({ ...options, endpoint, timeout })

  return {
    poolStats: () => apiRequest('/api/poolStats.htm'),
    account: (params) => apiRequest('/api/account.htm', params),
    hashrate: (params) => apiRequest('/api/hashrate.htm', params),
    workers: (params) => apiRequest('/api/workers.htm', params),
    paymentHistoryV2: (params) => apiRequest('/api/paymentHistoryV2.htm', params),
    changeMiningCoin: (coin) => apiRequest('/api/changeMiningCoin.htm', { coin }),
    accountOverview: (params) => apiRequest('/api/accountOverview.htm', params),
    userWorkerList: (params) => apiRequest('/api/userWorkerList.htm', params),
    coinCalculator: (params) => apiRequest('/api/coinCalculator.htm', params),
    userHashrateChart: (params) => apiRequest('/api/userHashrateChart.htm', params)
  }
}
