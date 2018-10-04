<template lang="pug">
  form.form
    h1.title Limit order
    .block
      span.lead USD: {{ usd }}
      span.lead BTC: {{ btc }}
      span.lead Last price: {{ lastPrice }}
    .block
      span.text Min amount: {{ minAmount }}
      span.text Commission fee: {{ commissionFee }}%
    hr.hr
    input(
      type="text"
      v-model="price"
      @input="onPriceChange"
      :style="priceErrStyle"
    )
    p.label {{ labels.price }}
    input(
      type="text"
      v-model="amount"
      @input="onAmountChange"
      :style="amountErrStyle"
    )
    p.label {{ labels.amount }}
    hr.hr
    p.text
      span Total:
      sup  USD
      span {{ price }} * {{ amount }} +
      sup  USD
      span {{ fee }}(Commission fee) =
      sup  USD
      span {{ total }}
    p.lead
      span If you buy:
      sup  USD
      span {{ afterBuyUsdWill }}
      sup  BTC
      span {{ afterBuyBtcWill }}
    p.lead
      span If you sell:
      sup  USD
      span {{ afterSellUsdWill }}
      sup  BTC
      span {{ afterSellBtcWill }}
    button.btn(
      :style="buyWarningStyle"
      @click="onBuyClick"
      :disabled="isDisabled"
    ) Buy
    button.btn(
      :style="sellWarningStyle"
      @click="onSellClick"
      :disabled="isDisabled"
    ) Sell
</template>

<script>
const PRICE_LABEL = 'Price (USD)'
const AMOUNT_LABEL = 'Amount (BTC)'

export default {
  data () {
    return {
      usd: 100000,
      btc: 200,
      lastPrice: 6565.9,
      price: 6565.95,
      amount: 100,
      minAmount: 0.001,
      labels: {
        price: PRICE_LABEL,
        amount: AMOUNT_LABEL
      },
      errors: {
        price: false,
        amount: false
      },
      commissionFee: 0.15,
      commissionTotal: 0
    }
  },
  computed: {
    valid () {
      return !this.errors.price && !this.errors.amount
    },
    isDisabled () {
      return !this.valid
    },
    priceErrStyle () {
      return this.errors.price ? { color: 'red' } : {}
    },
    amountErrStyle () {
      return this.errors.amount ? { color: 'red' } : {}
    },
    buyWarningStyle () {
      return (this.price > this.lastPrice) ? { 'background-color': 'red' } : { 'background-color': '#335185' }
    },
    sellWarningStyle () {
      return (this.price < this.lastPrice) ? { 'background-color': 'red' } : { 'background-color': '#335185' }
    },
    newPriceMinimal () {
      return roundTo(6, this.lastPrice - this.lastPrice / 10)
    },
    newPriceMaximal () {
      return roundTo(6, this.lastPrice + this.lastPrice / 10)
    },
    sum () {
      const price = +this.price
      const amount = +this.amount
      return roundTo(6, price * amount)
    },
    fee () {
      return roundTo(6, this.sum / 100 * 0.15)
    },
    total () {
      return this.sum + this.fee
    },
    afterBuyUsdWill () {
      const usd = +this.usd
      return usd - this.total
    },
    afterBuyBtcWill () {
      const btc = +this.btc
      const amount = +this.amount
      return btc + amount
    },
    afterSellUsdWill () {
      const usd = +this.usd
      return usd + this.total
    },
    afterSellBtcWill () {
      const btc = +this.btc
      const amount = +this.amount
      return btc - amount
    }
  },
  methods: {
    onPriceChange () {
      let count = 0
      if (!isFloat(this.price)) {
        this.labels.price = 'Price must be a float number'
        count++
      }
      const price = +this.price
      if (price > this.newPriceMaximal) {
        this.labels.price = `The maximum price - ${this.newPriceMaximal} (+10% from last price ${this.lastPrice})`
        count++
      }
      if (price < this.newPriceMinimal) {
        this.labels.price = `The minimum price - ${this.newPriceMinimal} (-10% from last price ${this.lastPrice})`
        count++
      }
      //
      if (count === 0) {
        this.labels.price = PRICE_LABEL
        this.errors.price = false
      } else {
        this.errors.price = true
      }
    },
    onAmountChange () {
      let count = 0
      if (!isFloat(this.amount)) {
        this.labels.amount = 'Amount must be a float number'
        count++
      }
      if (+this.amount < this.minAmount) {
        this.labels.amount = `Amount must be greater than ${this.minAmount}`
        count++
      }
      //
      if (count === 0) {
        this.labels.amount = AMOUNT_LABEL
        this.errors.amount = false
      } else {
        this.errors.amount = true
      }
    },
    onBuyClick (e) {
      e.preventDefault()
      console.log('buy')
      e.target.blur()
    },
    onSellClick (e) {
      e.preventDefault()
      console.log('sell')
      e.target.blur()
    }
  }
}

function isFloat (str) {
  // const r = /^[+-]?\d+(\.\d+)?$/
  const r = /^\d+(\.\d+)?$/
  return r.test(str) && ((str[0] !== '0') || (str[1] !== '0' && +str > 0 && +str < 1))
}

function roundTo (digs, num) {
  const a = Math.pow(10, digs)
  return Math.round(num * a) / a
}
</script>

<style lang="scss" scoped>
.form {
  position: relative;
  z-index: 1;
  margin: 24px 10px;
  padding: 64px 32px;
  border-radius: 4px;
  background-color: #e9ecef;
  & .title {
    font-family: 'Oswald', sans-serif;
    font-size: 56px;
    line-height: 1.2;
  }
  & .lead {
    font-size: 24px;
    margin: 0 16px 16px 0;
  }
  & .hr {
    border: 0;
    border-top: 1px solid rgba(0,0,0,.1);
    margin: 20px 0;
  }
  & .text {
    margin: 0 16px 16px 0;
  }
  & .btn {
    position: relative;
    z-index: 1;
    margin-right: 10px;
    padding: 12px 50px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #335185;
    color: white;
    outline: none;
    border: 0;
    font-size: 33px;
    transition: top 0.5s ease;
    &:hover {
      box-shadow: 0 1px 0 1px #000;
    }
    &:focus {
      top: 2px;
    }
    &:disabled {
      background-color: rgba(0,0,0,.1) !important;
      cursor: default;

      &:hover {
        box-shadow: none;
      }
    }
  }
}

input, textarea {
  display: block;
  width: 100%;
  outline: none;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 24px;
  padding: 12px 21px;
  box-sizing: border-box;
}

textarea {
  resize: none;
  font-size: 21px;
}

.label {
  margin-bottom: 16px;
  padding: 6px 21px 0;
  text-align: center;
}

.block {
  margin: 16px 0 0;
}
</style>
