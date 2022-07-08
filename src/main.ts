import axios from 'axios'

console.log('Hello T-webpack5')
axios.post('/api/user/login', {username: 'lisys'}).then((resp)=>{
  console.log(resp.data)
})
