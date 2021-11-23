import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"


class EventsService {

  async getAllTowerEvents() {
    const res = await api.get('api/events')
    // logger.log(res.data)
    AppState.events = res.data
  }
  async createEvent(newEvent) {
    const res = await api.post('api/events', newEvent)
    // logger.log(res.data)
    AppState.events = [...AppState.events, res.data]
    AppState.activeProject = res.data
  }

  async getActiveTowerEvent(id) {
    const res = await api.get('api/events/' + id)
    // logger.log(res.data)
    AppState.activeEvent = res.data
  }

  async cancelTowerEvent(activeEvent) {
    await api.delete('api/events/' + activeEvent.id, activeEvent)
    AppState.events = AppState.events.filter(a => a.id !== AppState.events.id)
    this.getActiveTowerEvent(activeEvent.id)
  }

  // REVIEW Need help getting this to work
  async editTowerEvent(event) {
    const res = await api.put('api/events/' + event.id, event)
    const updatedEvent = res.data
    AppState.activeEvent = updatedEvent
  }
}

export const eventsService = new EventsService()