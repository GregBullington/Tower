<template>
  <div class="row"></div>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
import { eventsService } from "../services/EventsService"
export default {
  setup() {
    const route = useRoute()
    watchEffect(async() => {
      try {
        if (route.params.id) {
          await eventsService.getAllTowerEvents(route.params.id)
        }
      } catch (error) {
        logger.error(error)
        Pop.toast("Something went wrong", 'error')
      }
    })




    return {
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
    }
  }
}





</script>


<style lang="scss" scoped>
</style>