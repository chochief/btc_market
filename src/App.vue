<template lang="pug">
  div(id="app")
    .content
      app-form
</template>

<script>
import AppForm from '@/components/AppForm'

export default {
  name: 'app',
  components: {
    AppForm
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
}

html, body {
  height: 100%;
}

body {
  // font-family: 'Oswald', sans-serif;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  overflow-y: scroll;
  box-sizing: border-box;
}

.content {
  flex: 1 0 auto;
  overflow: hidden;
  margin: 30px auto 30px;
  max-width: 1024px;
  padding: 30px;
  // min-height: 2000px;
}
</style>
