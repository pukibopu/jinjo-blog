import { proxy } from 'valtio'

import {Comment} from "@prisma/client"

type PostID = string
export const blogPostState = proxy<{
  postId: PostID
  currentBlockId: string | null
  comments: PostIDLessCommentDto[]
  replyingTo: PostIDLessCommentDto | null
}>({
  postId: '',
  currentBlockId: null,
  comments: [],
  replyingTo: null,
})
export type PostIDLessCommentDto = Omit<Comment, 'postId'>
export function addComment(comment: PostIDLessCommentDto) {
  blogPostState.comments.push(comment)
}

export function replyTo(comment: PostIDLessCommentDto) {
  blogPostState.replyingTo = comment
}

export function clearReply() {
  blogPostState.replyingTo = null
}

export function focusBlock(blockId: string | null) {
  blogPostState.currentBlockId = blockId
}

export function clearBlockFocus() {
  blogPostState.currentBlockId = null
}