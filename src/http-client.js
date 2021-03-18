import axios from 'axios'
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

const createApiCall = ({ key, secret, userId, coin, endpoint, timeout }) => {
  const nonce = createNonce()
  const input = [
    userId,
    key,
    nonce
  ]

  const instance = axios.create({
    baseURL: endpoint,
    timeout,
    params: {
      key,
      nonce,
      signature: createSignature(input, secret),
      coin
    }
  })

  instance.interceptors.response.use((response) => {
    if (response.data?.code !== 0) {
      throw Error(response.data.message)
    }
    return response.data.data
  }, (error) => {
    return Promise.reject(error)
  })

  return instance
}

export default options => {
  const endpoint = (options && options.endpoint) || ENDPOINT
  const timeout = (options && options.timeout) || TIMEOUT
  const apiRequest = createApiCall({ ...options, endpoint, timeout })

  return {
    poolStats: () => apiRequest.post('/api/poolStats.htm'),
    account: (params) => apiRequest.post('/api/account.htm', params),
    hashrate: (params) => apiRequest.post('/api/hashrate.htm', params),
    workers: (params) => apiRequest.post('/api/workers.htm', params),
    paymentHistoryV2: (params) => apiRequest.post('/api/paymentHistoryV2.htm', params),
    changeMiningCoin: () => apiRequest.post('/api/changeMiningCoin.htm'),
    accountOverview: (params) => apiRequest.post('/api/accountOverview.htm', params),
    userWorkerList: (params) => apiRequest.post('/api/userWorkerList.htm', params),
    coinCalculator: (params) => apiRequest.post('/api/coinCalculator.htm', params),
    userHashrateChart: (params) => apiRequest.post('/api/userHashrateChart.htm', params)
  }
}
