<template>
  <div class="row" v-if="!account.id">
    <div class="text-center mt-5">
      <h1>Please Login</h1>
    </div>
  </div>
</template>

<script>
import { AppState } from "../AppState"
import { computed, onMounted } from "@vue/runtime-core"
export default {
  // NOTE onmounted for getting account info 
  name: 'Home',
  setup() {
    return {
      account: computed(() => AppState.account)
    }
  }
}
</script>

<style scoped lang="scss">
.home{
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;
  .home-card{
    width: 50vw;
    > img{
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
