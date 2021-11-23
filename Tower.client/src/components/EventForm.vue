<template>
  <div class="row">
    <form @submit.prevent="handleSubmit()">
      <div class="col">
        <div class="row">
          <div class="col mt-3">
            <input class="form-control bg-lighter"
                   type="text"
                   name:="Name"
                   placeholder=" Event Name..."
                   v-model="editable.name"
                   required
            />
          </div>
        </div>
        <div class="row">
          <div class="col mt-3">
            <textarea
              style="resize: none"
              class="form-control bg-lighter"
              name="event-body"
              rows="5"
              placeholder="Description..."
              v-model="editable.description"
              required
            >
            </textarea>
          </div>
        </div>
        <div class="row">
          <p class="mb-1 mt-3">
            Select Event Type
          </p>
          <div class="col-md-6">
            <div class="form-check form-check-inline">
              <input class="form-check-input"
                     type="radio"
                     name="inlineRadioOptions"
                     id="inlineRadio1"
                     value="concert"
                     v-model="editable.type"
                     required
              >
              <label class="form-check-label" for="inlineRadio1">Concert</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input"
                     type="radio"
                     name="inlineRadioOptions"
                     id="inlineRadio2"
                     value="convention"
                     v-model="editable.type"
                     required
              >
              <label class="form-check-label" for="inlineRadio2">Convention</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input"
                     type="radio"
                     name="inlineRadioOptions"
                     id="inlineRadio3"
                     value="sport"
                     v-model="editable.type"
                     required
              >
              <label class="form-check-label" for="inlineRadio2">Sport</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input"
                     type="radio"
                     name="inlineRadioOptions"
                     id="inlineRadio4"
                     value="digital"
                     v-model="editable.type"
                     required
              >
              <label class="form-check-label" for="inlineRadio2">Digital</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mt-3">
            <input class="form-control bg-lighter"
                   type="text"
                   name:="coverImg"
                   placeholder="Image Url..."
                   v-model="editable.coverImg"
                   required
            />
          </div>
        </div>
        <div class="row">
          <div class="col mt-3">
            <input class="form-control bg-lighter"
                   type="text"
                   name:="Location"
                   placeholder=" Event Location..."
                   v-model="editable.location"
                   required
            />
          </div>
        </div>
        <div class="row">
          <div class="col mt-3">
            <input class="form-control bg-lighter"
                   type="number"
                   name:="capacity"
                   placeholder=" Event Capacity..."
                   v-model="editable.capacity"
                   required
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mt-3 mb-3">
            <input class="form-control bg-lighter"
                   type="date"
                   name:="startDate"
                   placeholder="Starte Date"
                   v-model="editable.startDate"
                   required
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col text-end">
          <button
            title="Cancel"
            type="button"
            class="btn rounded bg-none ms-2 px-5"
          >
            Cancel
          </button>
          <button
            type="submit"
            title="Submit"
            class="btn rounded btn-primary ms-2 px-5 text-dark"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import { computed, ref } from "@vue/reactivity"
import { eventsService } from "../services/EventsService"
import { logger } from "../utils/Logger"
import Pop from "../utils/Pop"
import { AppState } from "../AppState"
import { Modal } from "bootstrap"
import { useRouter } from "vue-router"
import { watchEffect } from "@vue/runtime-core"
export default {
  props: {event: {type: Object, required: true}},
  setup(props){
    const router = useRouter()
    const editable = ref({})
    watchEffect(() => {editable.value = { ...props.event}})
    return {
      activeEvent: computed(() => AppState.activeEvent),
      editable,
      async handleSubmit() {
        try {
          if (editable.value.id) {
          await eventsService.createEvent(editable.value)
          } else {
            await eventsService.editEvent(editable.value)
          }
          Modal.getOrCreateInstance(document.getElementById("eventForm")).hide();
          router.push({
            name: 'EventDetails', params: {id: AppState.activeEvent.id}
          })
        } catch (error) {
          logger.error(error)
          Pop.toast("Something went wrong creating Event!", 'error')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>

</style>