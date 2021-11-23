<template>
  <router-link :to="{ name: 'EventDetails', params: {id: event.id} }">
    <div class="card elevation-2 bg-secondary mb-5 p-1 selectable" @click="setActiveEvent()" :title="event.name">
      <img class="standard-height" :src="event.coverImg" alt="event cover image">
      <h4>
        {{ event.name }}
      </h4>
      <p>
        {{ event.location }}
      </p>
      <p>
        {{ new Date(event.startDate).toDateString() }}
      </p>
      <span v-if="event.isCanceled" class="text-danger at-cap">
        <p class="p-0 m-0"><b>CANCELED</b></p>
      </span>
      <span v-else-if="event.capacity > 0">
        Available Capacity: {{ event.capacity }}
      </span>
      <span v-else-if="event.capacity <= 0" class="text-danger at-cap">
        <p class="p-0 m-0"><b>AT CAPACITY</b></p>
      </span>
    </div>
  </router-link>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
export default {
  props: {event: {type: Object, required: true}},
  setup(props) {
    return {
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
      setActiveEvent() {
        AppState.activeEvent = props.event
      }
    }
  }
}





</script>


<style lang="scss" scoped>

.bg-dark-blur {
  background: rgba(24, 24, 24, 0.562);
  backdrop-filter: blur(20px);
}
.standard-height {
  min-height: 300px;
  object-fit: cover;
}
.at-cap {
  text-decoration: line-through;
  text-shadow: 2px 2px #440000;
  margin-top: none;
}
</style>