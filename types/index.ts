import type { FC, PropsWithChildren } from 'react'
export type ComponentProps<P = {}> = PropsWithChildren<
  {
    className?: string
  } & P
>
export type Component<P = {}> = FC<ComponentProps<P>>

export const kvKeys = {
  totalPageViews: 'total_page_views',
  lastVisitor: 'last_visitor',
  currentVisitor: 'current_visitor',
  postViews: (id: string) => `post:views:${id}`,
  postReactions: (id: string) => `post:reactions:${id}`,
} as const