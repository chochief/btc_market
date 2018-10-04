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
    p.text(
      :class="{ hidden: isDisabled }"
    )
      span Sum:
      sup  USD
      span {{ price }} * {{ amount }} =
      sup  USD
      span {{ sum }}
    p.text(
      :class="{ hidden: isDisabled }"
    )
      span Commission fee:
      sup  USD
      span {{ fee }}
    p.lead(
      :class="{ notAvailable: noBuy, hidden: isDisabled }"
    )
      span If you buy:
      sup  USD
      span {{ afterBuyUsdWill }}
      sup  BTC
      span {{ afterBuyBtcWill }}
    p.lead(
      :class="{ notAvailable: noSell, hidden: isDisabled }"
    )
      span If you sell:
      sup  USD
      span {{ afterSellUsdWill }}
      sup  BTC
      span {{ afterSellBtcWill }}
    hr.hr
    button.btn(
      :style="buyWarningStyle"
      @click="onBuyClick"
      :disabled="isDisabled || noBuy"
    ) Buy
    button.btn(
      :style="sellWarningStyle"
      @click="onSellClick"
      :disabled="isDisabled || noSell"
    ) Sell
    h1.title My orders
    table
      tr.lead(
        v-for="row in reverseHistory"
      )
        td
          span {{ row.date.toLocaleString() }}
        td
          sup  USD
          span {{ row.usd }}
        td
          sup  BTC
          span {{ row.btc }}
        td
          span {{ row.type }}
        td
          sup  price
          span {{ row.price }}
        td
          sup  amount
          span {{ row.amount }}
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
      commissionTotal: 0,
      history: []
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
    afterBuyUsdWill () {
      const usd = +this.usd
      return roundTo(6, usd - this.sum - this.fee)
    },
    afterBuyBtcWill () {
      const btc = +this.btc
      const amount = +this.amount
      return roundTo(6, btc + amount)
    },
    afterSellUsdWill () {
      const usd = +this.usd
      return roundTo(6, usd + this.sum - this.fee)
    },
    afterSellBtcWill () {
      const btc = +this.btc
      const amount = +this.amount
      return btc - amount
    },
    noBuy () {
      return this.afterBuyUsdWill < 0
    },
    noSell () {
      return this.afterSellBtcWill < 0
    },
    reverseHistory () {
      return this.history.slice().reverse()
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
      this.history.push({
        date: new Date(),
        type: 'BUY',
        price: this.price,
        amount: this.amount,
        usd: this.afterBuyUsdWill,
        btc: this.afterBuyBtcWill
      })
      this.lastPrice = this.price
      this.usd = this.afterBuyUsdWill
      this.btc = this.afterBuyBtcWill
      e.target.blur()
    },
    onSellClick (e) {
      e.preventDefault()
      this.history.push({
        date: new Date(),
        type: 'SELL',
        price: this.price,
        amount: this.amount,
        usd: this.afterSellUsdWill,
        btc: this.afterSellBtcWill
      })
      this.lastPrice = this.price
      this.usd = this.afterSellUsdWill
      this.btc = this.afterSellBtcWill
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
      box-shadow: 0 1px 1px 0 #000;
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

span {
  margin: 0 10px 0 5px;
}

.hidden {
  opacity: 0;
}

.notAvailable {
  text-decoration-line: line-through;
  color: rgba(0,0,0,.1);
}
</style>
