'use client'

import { useQuery } from '@tanstack/react-query'
import { addComment, blogPostState,PostIDLessCommentDto } from '@/components/blog/blog-post.state'
import { type Post } from '@/sanity/schemas/post'
import { Comment } from "@prisma/client"
import { useEffect } from 'react'


const BlogPostStateLoader = ({ post }: { post: Post }) => {
    const { data: comments } = useQuery({
        queryKey: ['comments', post._id],
        queryFn: async () => {
            const res = await fetch(`/api/comments/${post._id}`);
            const data = await res.json();
            return data as PostIDLessCommentDto[];
        },
        initialData:[]
    })

    useEffect(()=>{
        blogPostState.postId = post._id
    },[post._id])

    useEffect(()=>{
        comments?.forEach((comment)=>{
            if(blogPostState.comments.find((c)=>c.id===comment.id)) return
            addComment(comment)
        })
    },[comments])
    return null
}

export default BlogPostStateLoader