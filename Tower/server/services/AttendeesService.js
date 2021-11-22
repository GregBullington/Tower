import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'
import { towerEventsService } from './TowerEventsService'

class AttendeesService {
  // REVIEW see how to reduce the capacity
  async attendTowerEvent(body) {
    const towerEvent = await towerEventsService.getTowerEventById(body.eventId)
    const attending = await dbContext.Attendees.findOne({ eventId: body.eventId, accountId: body.accountId })
    if (attending || towerEvent.isCanceled || towerEvent.capacity <= 0) {
      throw new BadRequest('You cannot attend this event due to one of the following reasons: Attending. Canceled, 0 capacity!')
    }
    const attendTowerEvent = await dbContext.Attendees.create(body)
    // modify the towerEvent

    towerEvent.capacity--
    await towerEvent.save()
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
    const towerEvent = await towerEventsService.getTowerEventById(userInfo.eventId)
    towerEvent.capacity++
    await towerEvent.save()
  }
}

export const attendeesService = new AttendeesService()
