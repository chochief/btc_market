<template lang="pug">
  form.form
    h1.title Limit order
    span.lead USD: {{ usd }}
    span.lead BTC: {{ btc }}
    span.lead Last price: {{ lastPrice }}
    span.lead Commission fee ({{ commissionFee }}%): {{ commissionTotal }}
    hr.hr
    input(
      type="text"
      v-model="price"
      @input="onPriceChange"
      :style="priceErrStyle"
    )
    p.label {{ priceLabel }}
    input(
      type="text"
      v-model="amount"
      @input="onAmountChange"
      :style="amountErrStyle"
    )
    p.label {{ amountLabel }}
    hr.hr
    button.btn Buy
    button.btn Sell
</template>

<script>
export default {
  data () {
    return {
      usd: 500,
      btc: 200,
      lastPrice: 15,
      price: 14,
      amount: 100,
      priceLabel: 'Price',
      priceErr: false,
      amountLabel: 'Amount',
      amountErr: false,
      commissionFee: 0,
      commissionTotal: 0,
      valid: false
    }
  },
  computed: {
    isDisabled () {
      return !this.valid
    },
    priceErrStyle () {
      return this.priceErr ? { color: 'red' } : {}
    },
    amountErrStyle () {
      return this.priceErr ? { color: 'red' } : {}
    }
  },
  methods: {
    onPriceChange () {
      let count = 0
      if (!isFloat(this.price)) {
        this.priceLabel = 'Price must be a float number'
        count++
      }
      //
      if (count === 0) {
        this.priceLabel = 'Price'
        this.priceErr = false
      } else {
        this.priceErr = true
      }
    },
    onAmountChange () {
      let count = 0
      if (!isNumber(this.amount)) {
        this.amountLabel = 'Amount must be a number'
        count++
      }
      //
      if (count === 0) {
        this.amountLabel = 'Amount'
        this.amountErr = false
      } else {
        this.amountErr = true
      }
    },
    checkForm (e) {
      e.preventDefault()
      if (!isNumber(this.amount)) {
        this.amountLabel = 'Amount must be a number'
      }
    }
  }
}

function isNumber (str) {
  const r = /^\d+$/
  return r.test(str) && str[0] !== '0'
}

function isFloat (str) {
  const r = /^[+-]?\d+(\.\d+)?$/
  return r.test(str) && ((str[0] !== '0') || (str[1] !== '0' && +str > 0 && +str < 1))
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
    margin-bottom: 16px;
  }
  & .btn {
    position: relative;
    z-index: 1;
    margin-right: 10px;
    padding: 12px 16px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #335185;
    color: white;
    outline: none;
    border: 0;
    font-size: 22px;
    transition: all 0.5s ease;
    &:hover {
      color: #fbce2a;
    }
    &:focus {
      top: 2px;
    }
    &:disabled {
      background-color: rgba(0,0,0,.1);
      cursor: default;
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
</style>
