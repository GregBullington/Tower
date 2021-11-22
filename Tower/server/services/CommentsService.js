import { dbContext } from '../db/DbContext'
import { Forbidden } from '../utils/Errors'
class CommentsService {
  async createComment(body) {
    const userComment = await dbContext.Comments.create(body)
    await userComment.populate('creator')
    return userComment
  }

  async getTowerEventComments(query = {}) {
    const towerEventComments = await dbContext.Comments.find(query).populate('creator')
    return towerEventComments
  }

  async removeComment(user) {
    const userInfo = await dbContext.Comments.findById(user.commentId)
    if (userInfo.accountId.toString() !== user.accountId) {
      throw new Forbidden('Invalid request!')
    }
    await dbContext.Comments.findByIdAndDelete(user.commentId)
  }
}

export const commentsService = new CommentsService()
