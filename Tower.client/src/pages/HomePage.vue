<template>
  <div class="row justify-content-center container-fluid">
    <div class="col card mt-4 cover-img">
      <div class="row">
        <div class="col-md-3 m-md-5">
          <p>
            Get ahead of the scalpers.
          </p>
          <p>
            Reserve your seat now with
          </p>
          <p>
            real events for real people.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center container-fluid">
    <div class="col my-4">
      <FilterComponent />
    </div>
  </div>
  <div class="row container-fluid" v-if="eventType == '' ">
    <div v-for="e in events" :key="e.id" class="col-md-3">
      <EventComponent :event="e" />
    </div>
  </div>
  <div class="row container-fluid" v-else>
    <div v-for="e in filteredEvents" :key="e.id" class="col-md-3">
      <EventComponent :event="e">
      </eventcomponent>
    </div>
  </div>
</template>
<script>
import { AppState } from "../AppState"
import { computed, onMounted } from "@vue/runtime-core"
import { logger } from "../utils/Logger"
import Pop from "../utils/Pop"
import { eventsService } from "../services/EventsService"
export default {
  name: 'Home',
  setup() {
    onMounted(async() => {
      try {
          await eventsService.getAllTowerEvents()
      } catch (error) {
        logger.error(error)
        Pop.toast("Something went wrong", 'error')
      }
    })
    return {
      eventType: computed(() => AppState.eventType),
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
      filteredEvents: computed(() => AppState.events.filter(e => e.type == AppState.eventType))
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

.cover-img {
  background-image: url("https://media.istockphoto.com/photos/cinema-movie-theatre-with-red-seats-rows-and-a-black-background-picture-id1269677658?k=20&m=1269677658&s=612x612&w=0&h=e4SrlDftj-U-J9f4uzfHobwXDRbIpXpwaf7j8fD7bvk=");
  object-fit: cover;
  min-height: 200px;
  max-width: 98%;
}
</style>
