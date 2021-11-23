import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { towerEventsService } from '../services/TowerEventsService'
import { attendeesService } from '../services/AttendeesService'
import { commentsService } from '../services/CommentsService'

export class TowerEventsController extends BaseController {
  constructor() {
    super('api/events')
    this.router
      .get('', this.getAllTowerEvents)
      .get('/:id/attendees', this.getEventAttendees)
      .get('/:id/comments', this.getTowerEventComments)
      .get('/:id', this.getTowerEventById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createTowerEvent)
      .put('/:id', this.editTowerEvent)
      .delete('/:id', this.cancelTowerEvent)
  }

  async createTowerEvent(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const towerEvent = await towerEventsService.createTowerEvent(req.body)
      return res.send(towerEvent)
    } catch (error) {
      next(error)
    }
  }

  async getAllTowerEvents(req, res, next) {
    try {
      const query = req.query
      const towerEvents = await towerEventsService.getAllTowerEvents(query)
      return res.send(towerEvents)
    } catch (error) {
      next(error)
    }
  }

  async getTowerEventComments(req, res, next) {
    try {
      const query = req.params.id
      const towerEventComments = await commentsService.getTowerEventComments({ eventId: query })
      return res.send(towerEventComments)
    } catch (error) {
      next(error)
    }
  }

  async getTowerEventById(req, res, next) {
    try {
      const towerEvents = await towerEventsService.getTowerEventById(req.params.id)
      return res.send(towerEvents)
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

  async editTowerEvent(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const id = req.params.id
      const updateData = req.body
      updateData._id = id
      delete updateData.isCanceled
      const updatedEvent = await towerEventsService.editTowerEvent(id, updateData)
      return res.send(updatedEvent)
    } catch (error) {
      next(error)
    }
  }

  async cancelTowerEvent(req, res, next) {
    try {
      const creatorId = req.userInfo.id
      const id = req.params.id
      const updatedEvent = await towerEventsService.editTowerEvent(id, { creatorId: creatorId, isCanceled: true })
      res.send(updatedEvent)
    } catch (error) {
      next(error)
    }
  }
}
