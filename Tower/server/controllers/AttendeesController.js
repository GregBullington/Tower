import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { attendeesService } from '../services/AttendeesService'

export class AttendeesController extends BaseController {
  constructor() {
    super('/api/attendees')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.attendTowerEvent)
      .delete('/:id', this.unAttendTowerEvent)
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

  async unAttendTowerEvent(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const attendeeId = req.params.id
      const unAttended = await attendeesService.unAttendTowerEvent(accountId, attendeeId)
      return res.send(unAttended)
    } catch (error) {
      next(error)
    }
  }
}
