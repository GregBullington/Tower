import { AppState } from "../AppState"
import { api } from "./AxiosService"


class AttendeesService {

  async attendTowerEvent(accountId, eventId) {
    const res = await api.post('/api/attendees', { accountId: accountId, eventId: eventId })
    AppState.attendees = [...AppState.attendees, res.data]
    AppState.activeEvent.capacity--
  }

  async unAttendTowerEvent(id) {
    await api.delete('api/attendees/' + id)
    AppState.attendees = AppState.attendees.filter(a => a.id !== id)
    AppState.activeEvent.capacity++
  }

  async getTowerEventAttendees(id) {
    const res = await api.get('api/events/' + id + '/attendees')
    AppState.attendees = res.data
  }

  async getUserAttendance(accountId) {
    const res = await api.get('account/attendees', accountId)
    AppState.attendees = res.data

  }
}

export const attendeesService = new AttendeesService()