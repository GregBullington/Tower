<template>
  <div class="row justify-content-center m-2">
    <div class="col-md-2 d-flex justify-content-center">
      <img class="img-container" :src="comment.creator.picture" alt="profile picture" title="{{comment.creator.name}}">
    </div>
    <div class="col-md-10 card bg-dark">
      <div class="row">
        <div class="col-6">
          <p><b>{{ comment.creator.name }}</b></p>
        </div>
        <div class="col-6 text-end">
          <i v-if="account.id == comment.creator.id" class="mdi mdi-delete-forever text-danger mdi-24px selectable" @click="removeComment(comment.id)" title="Remove Comment"></i>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>{{ comment.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import Pop from "../utils/Pop"
import { commentsService } from "../services/CommentsService"
export default {
  props: {comment: Object },
  setup(){
    return {
      account: computed(() => AppState.account),
      async removeComment(id) {
        try {
          if(await Pop.confirm("You are removing a comment, Are you sure?")){
            await commentsService.removeComment(id)
          }
        } catch (error) {
          logger.error(error)
          Pop.toast("Somthing went wrong removing comment!", 'error')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>

</style>