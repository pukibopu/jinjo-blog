import type { FC, PropsWithChildren } from 'react'
export type ComponentProps<P = {}> = PropsWithChildren<
  {
    className?: string
  } & P
>
export type Component<P = {}> = FC<ComponentProps<P>>