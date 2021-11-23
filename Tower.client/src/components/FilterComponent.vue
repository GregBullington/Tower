<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-secondary px-3 elevation-2">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto">
        <li>
          <button class="btn text-light" @click="setEventType('')" title="All Events">
            All
          </button>
        </li>
        <li>
          <button class="btn text-light" @click="setEventType('concert')" title="Concert Events">
            Concert
          </button>
        </li>
        <li>
          <button class="btn text-light" @click="setEventType('convention')" title="Convention Events">
            Convention
          </button>
        </li>
        <li>
          <button class="btn text-light" @click="setEventType('sport')" title="Sport Events">
            Sport
          </button>
        </li>
        <li>
          <button class="btn text-light" @click="setEventType('digital')" title="Digital Events">
            Digital
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
export default {
  setup(){
    return {
      filteredEvents: computed(() => AppState.eventType),

      setEventType(type){
        AppState.eventType = type
      }
    }
  }
}
</script>


<style lang="scss" scoped>

</style>