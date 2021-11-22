import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { commentsService } from '../services/CommentsService'

export class CommentsController extends BaseController {
  constructor() {
    super('/api/comments')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createComment)
      .delete('/:id', this.removeComment)
  }

  async createComment(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const userComment = await commentsService.createComment(req.body)
      return res.send(userComment)
    } catch (error) {
      next(error)
    }
  }

  async removeComment(req, res, next) {
    try {
      req.body.accountId = req.userInfo.id
      req.body.commentId = req.params.id
      const userInfo = req.body
      const removedComment = await commentsService.removeComment(userInfo)
      return res.send(removedComment)
    } catch (error) {
      next(error)
    }
  }
}
