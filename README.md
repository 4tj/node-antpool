# node-antpool
> [antpool.com](https://v3.antpool.com/userApiGuide) nodejs api client

### Installation
```bash
npm install node-antpool
```

### Getting started
```javascript
import AntPool from 'node-antpool'

const client = AntPool()

const client2 = AntPool({
  timeout: 5000 // http request timeout
})

client.account().then(data => console.log(data))
```