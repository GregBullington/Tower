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
    await api.delete('api/attendees/' + id)
    // logger.log(res.data)
    AppState.attendees = AppState.attendees.filter(a => a.id !== id)
  }

  async getTowerEventAttendees(id) {
    const res = await api.get('api/events/' + id + '/attendees')
    // logger.log(res.data)
    AppState.attendees = res.data
  }

  async getUserAttendance(accountId) {
    await api.get('account/attendees', accountId)

  }
}

export const attendeesService = new AttendeesService()