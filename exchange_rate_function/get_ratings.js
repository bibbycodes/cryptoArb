


exports.func = async () => {
  require('dotenv').config()
  const axios = require('axios')

  let res = await axios.get(
    `https://api.sandbox.transferwise.tech/v1/rates`,
    {headers: {Authorization:` Bearer ${process.env.TW_KEY}`}}
  ).catch(err => console.log(err))

  let rates = res.data
  

}