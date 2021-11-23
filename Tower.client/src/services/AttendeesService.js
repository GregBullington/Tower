import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"


class AttendeesService {

  async attendTowerEvent(accountId, eventId) {
    const res = await api.post('/api/attendees', { accountId: accountId, eventId: eventId })
    // logger.log(res.data)
    AppState.attendees = [...AppState.attendees, res.data]
  }

  async unAttendTowerEvent(id) {
    const res = await api.delete('api/attendees/' + id)
    // logger.log(res.data)
    this.getUserAttendance(id)
  }

  async getTowerEventAttendees(id) {
    const res = await api.get('api/events/' + id + '/attendees')
    // logger.log(res.data)
    AppState.attendees = res.data
  }

  async getUserAttendance(accountId) {
    const res = await api.get('account/attendees', accountId)
    AppState.attendedEvents = res.data
    // logger.log(res.data)
  }
}

export const attendeesService = new AttendeesService()