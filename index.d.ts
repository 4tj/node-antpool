declare module 'node-antpool' {

  export interface MiningType {
    payMethod: string
    percent: number
    percentStr: string
  }

  export enum CoinType {
    BTC = 'BTC',
    BCH = 'BCH',
    LTC = 'LTC',
    ETH = 'ETH',
    ZEC = 'ZEC',
    DASH = 'DASH',
    XMC = 'XMC',
    BTM = 'BTM',
    USDT = 'USDT'
  }

  export interface CoinInfo {
    coinType: string
    networkDiff: number
    blockReward: number // 总奖励
    coinPriceCny: number
    coinPriceUsd: number
    miningType: MiningType[]
    blockIncentive: number // 矿工奖励
    blockTxFee: number //  交易费奖励
  }

  export interface PoolStatsResponse {
    poolHashrate: number // 矿池算力（单位为：MH/s）
    activeWorkerNumber: number // 有效矿工数
    poolStatus: string // 矿池状态
    networkDiff: number // 当前网络难度
    estimateTime: number // Block期望时间（单位：秒）
    currentRound: number // 当前运行时间（单位：秒）
    totalShareNumber: number // 总工作量
    totalBlockNumber: number // 总Block数
  }

  export interface AccountResponse {
    earn24Hours: string // 最近一日收益
    earnTotal: string // 总收益
    paidOut: string // 已支付收益
    balance: string // 余额
    settleTime: string // 最近一日收益日期
  }

  export interface HashrateResponse {
    last10m: string // 十分钟算力
    last30m: string // 三十分钟算力(废弃)
    last1h: string // 一小时算力
    last1d: string // 一天算力
    prev10m: string // 前十分钟算力(废弃)
    prev30m: string // 前三十分钟算力(废弃)
    prev1h: string // 前一小时算力(废弃)
    prev1d: string // 前一天算力(废弃)
    accepted: string // 接收的算力
    stale: string // 失效算力
    dupelicate: string // 重复算力
    other: string // 其他算力
    totalWorkers: number // 总矿工数量
    activeWorkers: number // 活跃矿工数量
  }

  export interface WorkersResponse {
    rows: {
      worker: string // 矿工名称
      last10m: string // 十分钟算力
      last30m: string // 三十分钟算力(废弃)
      last1h: string // 小时算力
      last1d: string // 天算力
      prev10m: string // 前十分钟算力
      prev30m: string // 前三十分钟算力(废弃)
      prev1h: string // 前一小时算力
      prev1d: string // 前一天算力
      accepted: string // 接收的算力
      stale: string // 无效算力
      dupelicate: string // 重复算力
      other: string // 其他算力
    }[]
    page: 1
    totalPage: 1
    pageSize: 10
    totalRecord: 1
  }

  export enum PaymentType {
    PAYOUT = 'payout',
    RECV = 'recv'
  }

  interface PaymentHistoryPayout {
    id: string // 记录id
    timestamp: string // 支付时间
    walletAddress: string // 钱包地址
    txId: string // 交易哈希
    amount: string // 支付额度
  }

  interface PaymentHistoryRecv {
    timestamp: string // 时间
    hashrate: string // 算力
    hashrateUnit: string // 算力值
    ppsAmount: string // pps收益
    pplnsAmount: string // pplns收益
    soloAmount: string // solo挖矿收益
    ppappsAmount: string // ppapps挖矿收益
    ppapplnsAmount: string // ppapplns挖矿收益
    fppsBlockAmount: string // fpps挖矿区块奖励收益
    fppsFeeAmount: string // fpps挖矿交易费收益
  }

  export interface PaymentHistoryV2Response {
    rows: PaymentHistoryRecv[] | PaymentHistoryPayout[]
    page: number
    totalPage: number
    pageSize: number
    totalRecord: number
  }

  export interface ChangeMiningCoinResponse {
    version: string
    code: number
    message: string
  }

  export interface AccountOverviewResponse {
    hsLast10m: string // 十分钟算力
    hsLast1d: string // 天算力
    invalidWorkerNum: number // 失效矿工数量
    totalAmount: string // 收益总金额
    totalWorkerNum: number // 矿工总数量
    unpaidAmount: string // 未支付金额
    yesterdayAmount: string // 最近一日收益
    inactiveWorkerNum: string // 掉线矿工数量
    hsLast1h: string // 小时算力
    userId: string // 用户id
    activeWorkerNum: string // 活跃矿工数量
  }

  export enum WorkerStatus {
    ALL = '0',
    ONLINE = '1',
    OFFLINE = '2',
    INVALID = '3'
  }

  export interface UserWorkerListResponse {
    result: {
      page: number
      totalPage: number
      pageSize: number
      totalRecord: number
      rows: {
        workerId: string // 矿工名称
        hsLast1h: string // 一小时算力
        hsLast1d: string // 一天算力
        rejectRatio: string // 拒绝率
        shareLastTime: string // 最近提交算力时间
      }[]
    }
    coinType: string
    userId: string
  }

  export interface CoinCalculatorResponse {
    payMethod: string // 收益模式
    coinType: string // 收益币种，例如当计算SHA256币种的收益时，收益币种为BTC
    networkDiff: string // 网络难度
    hashInput: string // 输入的算力值
    feePercent: string // 手续费率
    blockIncentiveVal: string // 区块奖励收益（收益以币结算）
    blockTxFee: string // 区块交易费收益（收益以币结算）
    coinMount: string // 每日收益币种的数量
    resultMountCny: string // 每日收益人民币
    resultMountUsd: string // 每日收益美元
    coinPriceCny: string // 币价/人民币
    coinPriceUsd: string // 币价/美元
  }

  export interface UserHashrateChartResponse {
    poolSpeedBeanList: {
      date: number // 时间戳
      speed: number // 算力值
    }
    unit: string // 算力值单位
    coin: string // 币种
  }

  export interface AntPool {
    poolStats (): Promise<PoolStatsResponse>
    account (options?: { userId: string }): Promise<AccountResponse>
    hashrate (options?: { userId?: string }): Promise<HashrateResponse>
    workers (options?: { clientUserId: string, groupId?: string, pageEnable?: boolean, page?: number, pageSize?: number }): Promise<WorkersResponse>
    paymentHistoryV2 (options?: { pageEnable?: boolean, type: PaymentType, page?: number, pageSize?: number }): Promise<PaymentHistoryV2Response>
    changeMiningCoin (): Promise<ChangeMiningCoinResponse>
    accountOverview (options?: { userId: string }): Promise<AccountOverviewResponse>
    userWorkerList (options?: { userId: string, workerStatus: WorkerStatus, page: number, pageSize: number }): Promise<UserWorkerListResponse>
    coinCalculator (options?: { hashInput: number, networkDiff?: number, feePercent?: number }): Promise<CoinCalculatorResponse>
    userHashrateChart (opitons?: { userId: string, userWorkerId: string, date: string, type: number }): Promise<UserHashrateChartResponse>
  }

  export interface AntPoolClientOptions {
    key?: string
    secret?: string
    coin?: CoinType
    userId?: string
    timeout?: number
  }

  export default function (options?: AntPoolClientOptions): AntPool
}
