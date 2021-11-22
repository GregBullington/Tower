import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'
import { towerEventsService } from './TowerEventsService'

class AttendeesService {
  // REVIEW see how to reduce the capacity
  async attendTowerEvent(body) {
    const towerEvent = await towerEventsService.getTowerEventById(body.eventId)
    const attending = await dbContext.Attendees.findOne({ eventId: body.eventId, accountId: body.accountId })
    if (attending || towerEvent.isCanceled) {
      throw new BadRequest('You\'re either attending or this event is canceled!')
    }
    const attendTowerEvent = await dbContext.Attendees.create(body)
    await attendTowerEvent.populate('event account')
    return attendTowerEvent
  }

  async getUserAttendance(query = {}) {
    const userAttendance = await dbContext.Attendees.find(query).populate('event')
    if (!userAttendance) {
      throw new BadRequest('Invalid request!')
    }
    return userAttendance
  }

  async getEventAttendees(query = {}) {
    const eventAttendees = await dbContext.Attendees.find(query).populate('event account')
    return eventAttendees
  }

  async unAttendTowerEvent(attendee) {
    const userInfo = await dbContext.Attendees.findById(attendee.attendeeId)
    if (userInfo.accountId.toString() !== attendee.accountId) {
      throw new Forbidden('Invalid request!')
    }
    await dbContext.Attendees.findByIdAndDelete(attendee.attendeeId)
  }
}

export const attendeesService = new AttendeesService()
