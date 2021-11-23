<template>
  <div class="row container-fluid">
    <div class="col mt-3">
      <h3 class="text-success">
        Events Attending
      </h3>
    </div>
    <div class="row">
      <div v-for="a in attendedEvents" :key="a.id" class="col-md-3">
        <div class="card elevation-2 bg-secondary mb-5 p-1" :title="a.event.name">
          <img class="standard-height" :src="a.event.coverImg" alt="event cover image">
          <h4>
            {{ a.event.name }}
          </h4>
          <p>
            {{ a.event.location }}
          </p>
          <p>
            {{ new Date(a.event.startDate).toDateString() }}
          </p>
          <div class="row">
            <div class="col-md-6">
              <span v-if="a.event.isCanceled" class="text-danger at-cap">
                <p class="p-0 m-0"><b>CANCELED</b></p>
              </span>
              <span v-else-if="a.event.capacity > 0">
                Open Spots: {{ a.event.capacity }}
              </span>
              <span v-else-if="a.event.capacity <= 0" class="text-danger at-cap">
                <p class="p-0 m-0"><b>AT CAPACITY</b></p>
              </span>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-danger btn-sm" @click="unAttendTowerEvent(account.id)" title="UnAttend Event">
                UnAttend <i class="mdi mdi-human-handsup"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watchEffect } from 'vue'
import { AppState } from '../AppState'
import { logger } from "../utils/Logger"
import Pop from "../utils/Pop"
import { attendeesService } from "../services/AttendeesService"
export default {
  name: 'Account',
  setup() {
    watchEffect(async(account) => {
      try {
        await attendeesService.getUserAttendance(account)
      } catch (error) {
        logger.error(error)
        Pop.toast("Something went wrong getting the events you're attending!", 'error')
      }
    })
    return {
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
      attendees: computed(() => AppState.attendees),
      attendedEvents: computed(() => AppState.attendedEvents),

      async unAttendTowerEvent(accountId) {
        try {
          if(await Pop.confirm('You are UnAttending this event, Are you Sure?'))
          await attendeesService.unAttendTowerEvent(accountId)
        } catch (error) {
          logger.error(error)
          Pop.toast("Something went wrong UnAttending this event!", 'error')
          
        }
      },
    }
  }
}
</script>

<style scoped>
.standard-height {
  max-height: 200px;
  min-height: 200px;
  object-fit: cover;
}
.at-cap {
  text-decoration: line-through;
  text-shadow: 2px 2px #440000;
  margin-top: none;
}
</style>
