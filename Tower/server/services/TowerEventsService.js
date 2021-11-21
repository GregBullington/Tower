import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class TowerEventsService {
  async createTowerEvent(body) {
    const towerEvent = await dbContext.TowerEvents.create(body)
    return towerEvent.populate('creator')
  }

  async getAllTowerEvents(query = {}) {
    return await dbContext.TowerEvents.find(query).populate('creator')
  }

  async getTowerEventById(id) {
    const towerEvent = await dbContext.TowerEvents.findById(id).populate('creator')
    if (!towerEvent) {
      throw new BadRequest('There is no Event by that ID!')
    }
    return towerEvent
  }

  async editTowerEvent(id, update) {
    const updatedPackage = await dbContext.TowerEvents.findByIdAndUpdate(id, update, { new: true })
    return updatedPackage
  }

  async cancelTowerEvent(body) {
    const towerEvent = await this.getTowerEventById(body.id)
    if (towerEvent.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('You are not able to edit this event!')
    }
    const updatedEvent = dbContext.TowerEvents.findOneAndUpdate({ _id: body.id, creatorId: body.creatorId }, body, { new: true })
    return updatedEvent
  }
}

export const towerEventsService = new TowerEventsService()
