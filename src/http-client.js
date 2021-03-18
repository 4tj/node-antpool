import axios from 'axios'
import { createHmac } from 'crypto'

const ENDPOINT = 'https://antpool.com'
const createNonce = () => Date.now()
const createSignature = (input, secret) => {
  let msg = ''
  for (const index in input) {
    msg += input[index]
  }
  return createHmac('sha256', secret).update(msg).digest('hex').toUpperCase()
}

const createApiCall = ({ key, secret, userId, coin, endpoint }) => async (
  method,
  path,
  query
) => {
  const nonce = createNonce()
  const input = [
    userId,
    key,
    nonce
  ]

  const params = {
    key,
    nonce,
    signature: createSignature(input, secret),
    coin,
    ...query
  }

  const response = await axios.request({
    url: `${endpoint}${path}`,
    method,
    params
  })

  return response.data
}

export default options => {
  const endpoint = (options && options.endpoint) || ENDPOINT
  const apiRequest = createApiCall({ ...options, endpoint })
  return {
    poolStats: () => apiRequest('POST', '/api/poolStats.htm'),
    account: (query) => apiRequest('POST', '/api/account.htm', query),
    hashrate: (query) => apiRequest('POST', '/api/hashrate.htm', query),
    workers: (query) => apiRequest('POST', '/api/workers.htm', query),
    paymentHistoryV2: (query) => apiRequest('POST', '/api/paymentHistoryV2.htm', query),
    changeMiningCoin: () => apiRequest('POST', '/api/changeMiningCoin.htm'),
    accountOverview: (query) => apiRequest('POST', '/api/accountOverview.htm', query),
    userWorkerList: (query) => apiRequest('POST', '/api/userWorkerList.htm', query),
    coinCalculator: (query) => apiRequest('POST', '/api/coinCalculator.htm', query),
    userHashrateChart: (query) => apiRequest('POST', '/api/userHashrateChart.htm', query)
  }
}
