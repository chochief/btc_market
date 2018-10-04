module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/btc_market/'
    : '/'
}