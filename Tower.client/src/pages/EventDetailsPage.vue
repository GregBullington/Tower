<template>
  <div class="row justify-content-center container-fluid">
    <div class="col-md-10 card bg-secondary elevation-2 mt-5 p-2">
      <div class="row">
        <div v-if="activeEvent.creatorId == account.id && !activeEvent.isCanceled" class="col text-end dropdown">
          <i class="mdi mdi-dots-horizontal mdi-24px selectable dropdown-toggle" data-bs-toggle="dropdown" title="Event Options"></i>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item selectable bg-danger" @click="cancelTowerEvent(activeEvent)">Cancel Event</a>
            </li>
            <li>
              <a class="dropdown-item selectable bg-primary" data-bs-toggle="modal" data-bs-target="#eventForm">Edit Event</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <img class="img-fluid" :src="activeEvent.coverImg" alt="">
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-6">
              <h3>{{ activeEvent.name }}</h3>
            </div>
            <div class="col-6">
              <h4>{{ new Date(activeEvent.startDate).toDateString() }}</h4>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <h5>{{ activeEvent.location }}</h5>
              <p>{{ activeEvent.type }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col mb-5">
              <p>{{ activeEvent.description }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mt-4">
              <span v-if="activeEvent.isCanceled" class="text-danger at-cap">
                <h5 class="p-0 m-0"><b>CANCELED</b></h5>
              </span>
              <span v-else-if="activeEvent.capacity > 0">
                <h5>Available Capacity: {{ activeEvent.capacity }}</h5>
              </span>
              <span v-else-if="activeEvent.capacity <= 0" class="text-danger at-cap">
                <h5 class="p-0 m-0"><b>AT CAPACITY</b></h5>
              </span>
            </div>
            <div v-if="account.id && attendedEvents.eventId !== activeEvent.eventId && !activeEvent.isCanceled && activeEvent.capacity > 0" class="col-md-6 d-flex align-items-end justify-content-center">
              <button class="btn btn-warning btn-lg px-4" @click="attendTowerEvent(account.id, activeEvent.id)" title="Attend Event">
                Attend <i class="mdi mdi-human-handsup"></i>
              </button>
            </div>
            <!-- REVIEW need help with showing the unattend button under condition that Im attending also review the functionality -->
            <div v-if="account.id && attendedEvents.eventId == activeEvent.eventId && !activeEvent.isCanceled && activeEvent.capacity" class="col-md-6 d-flex align-items-end justify-content-center">
              <button class="btn btn-danger btn-lg px-4" @click="unAttendTowerEvent(account.id)" title="UnAttend Event">
                UnAttend <i class="mdi mdi-human-handsup"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center container-fluid">
    <div v-if="attendees.length > 0 && !activeEvent.isCanceled " class="col-md-10 card bg-grey elevation-2 mt-5 p-1">
      <p>
        <b>See whos attending</b>
      </p>
      <div class="row">
        <div class="col-2" v-for="a in attendees" :key="a.id">
          <img class="img-container" :src="a.account.picture" alt="account image" :title="a.account.name">
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center container-fluid">
    <div class="col-md-10 card bg-secondary elevation-2 mt-5 p-4 mb-5">
      <div class="row">
        <div class="col text-success text-end">
          <p><b>Join the conversation</b></p>
        </div>
      </div>
      <form @submit="postComment()">
        <div class="row">
          <div class="col">
            <textarea style="resize: none;"
                      class="form-control"
                      name="postComment"
                      id="postComment"
                      cols="30"
                      rows="5"
                      placeholder="Tell the people..."
                      v-model="comment.body"
            ></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col mt-3 text-end mb-5">
            <button type="submit" class="btn btn-success text-dark btn-lg">
              <b>Post Comment</b>
            </button>
          </div>
        </div>
      </form>
      <div class="row">
        <div v-for="c in comments" :key="c.id" class="col-md-10">
          <CommentComponent :comment="c" />
        </div>
      </div>
    </div>
  </div>
  <Modal id="eventForm">
    <template #modal-title>
      Create Event!
    </template>

    <template #modal-body>
      <EventForm :event="activeEvent" />
    </template>
  </Modal>
</template>


<script>
import { computed, ref } from "@vue/reactivity"
import { AppState } from "../AppState"
import { useRoute } from "vue-router"
import { onMounted, watchEffect } from "@vue/runtime-core"
import { logger } from "../utils/Logger"
import Pop from "../utils/Pop"
import { eventsService } from "../services/EventsService"
import { attendeesService } from "../services/AttendeesService"
import { commentsService } from "../services/CommentsService"
export default {
  setup(){
    const route = useRoute()
    const comment = ref({ eventId: route.params.id})
    watchEffect(async(account) => {
      try {
        if(route.params.id){
          await eventsService.getActiveTowerEvent(route.params.id)
          await attendeesService.getTowerEventAttendees(route.params.id)
          await commentsService.getTowerEventComments(route.params.id)
        }
      } catch (error) {
        logger.error(error)
        Pop.toast("Something went wrong getting page data!", 'error')
      }

      try {
        await attendeesService.getUserAttendance(account)
      } catch (error) {
        logger.error(error)
        Pop.toast("Something went wrong getting the events you're attending!", 'error')
      }
    })
    // logger.log(AppState.attendedEvents)
    return {
      route,
      comment,
      account: computed(() => AppState.account),
      events: computed(() => AppState.events),
      activeEvent: computed(() => AppState.activeEvent),
      attendees: computed(() => AppState.attendees),
      attendedEvents: computed(() => AppState.attendedEvents),
      comments: computed(() => AppState.comments),

      async attendTowerEvent(accountId, eventId) {
        try {
          await attendeesService.attendTowerEvent(accountId, eventId)
        } catch (error) {
          logger.error(error)
          Pop.toast("Something went wrong attending this event!", 'error')
        }
      },
// REVIEW need help with this 
      async unAttendTowerEvent(accountId) {
        try {
          if(await Pop.confirm('You are UnAttending this event, Are you Sure?'))
          await attendeesService.unAttendTowerEvent(accountId)
        } catch (error) {
          logger.error(error)
          Pop.toast("Something went wrong UnAttending this event!", 'error')
          
        }
      },
//  REVIEW need help with this
      async cancelTowerEvent(activeEvent) {
        try {
          if(await Pop.confirm('You are canceling this event, Are you Sure?'))
          await eventsService.cancelTowerEvent(activeEvent)
        } catch (error) {
          logger.error(error)
          Pop.toast("Something went wrong canceling this event!", 'error')
        }
      },
      async postComment() {
        try {
          await commentsService.postComment(comment.value)
          comment.value = {eventId: route.params.id}
        } catch (error) {
          logger.error(error)
          Pop.toast("Something went wrong posting comment!", 'error')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.at-cap {
  text-decoration: line-through;
  text-shadow: 2px 2px #440000;
  margin-top: none;
}
</style>