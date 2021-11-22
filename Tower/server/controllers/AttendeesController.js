import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { attendeesService } from '../services/AttendeesService'

export class AttendeesController extends BaseController {
  constructor() {
    super('')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('/api/attendees', this.attendTowerEvent)
      .get('/account/attendees', this.getUserAttendance)
      .get('/api/events/:id/attendees', this.getEventAttendees)
      .delete('/api/attendees/:id', this.unAttendTowerEvent)
  }

  async attendTowerEvent(req, res, next) {
    try {
      req.body.accountId = req.userInfo.id
      const attend = await attendeesService.attendTowerEvent(req.body)
      return res.send(attend)
    } catch (error) {
      next(error)
    }
  }

  async getUserAttendance(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const userAttendance = await attendeesService.getUserAttendance({ accountId: accountId })
      return res.send(userAttendance)
    } catch (error) {
      next(error)
    }
  }

  async getEventAttendees(req, res, next) {
    try {
      const query = req.params.id
      const eventAttendees = await attendeesService.getEventAttendees({ eventId: query })
      return res.send(eventAttendees)
    } catch (error) {
      next(error)
    }
  }

  async unAttendTowerEvent(req, res, next) {
    try {
      req.body.accountId = req.userInfo.id
      req.body.attendeeId = req.params.id
      const attendee = req.body
      const unAttended = await attendeesService.unAttendTowerEvent(attendee)
      return res.send(unAttended)
    } catch (error) {
      next(error)
    }
  }
}
