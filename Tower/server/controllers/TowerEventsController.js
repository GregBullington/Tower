import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { towerEventsService } from '../services/TowerEventsService'

export class TowerEventsController extends BaseController {
  constructor() {
    super('api/events')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createTowerEvent)
      .get('', this.getAllTowerEvents)
      .get('/:id', this.getTowerEventById)
      .put('/:id', this.editTowerEvent)
      .delete('/:id', this.editTowerEvent)
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

  async getTowerEventById(req, res, next) {
    try {
      const towerEvents = await towerEventsService.getTowerEventById(req.params.id)
      return res.send(towerEvents)
    } catch (error) {
      next(error)
    }
  }

  async editTowerEvent(req, res, next) {
    try {
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
      req.body.creatorId = req.userInfo.id
      req.body.eventId = req.params.eventId
      req.body.isCanceled = true
      const updatedEvent = await towerEventsService.cancelTowerEvent(req.body)
      res.send(updatedEvent)
    } catch (error) {
      next(error)
    }
  }
}
