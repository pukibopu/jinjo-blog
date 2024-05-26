'use client'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link, { type LinkProps } from 'next/link'
import React, { useState } from 'react'

import { RichLink } from '@/components/links/RichLink'
import { HoverCard } from '@/components/ui/HoverCard'
import { env } from '@/env.mjs'
import { makeBlurDataURL } from '@/lib/image'

type PeekabooLinkProps = LinkProps &
    React.ComponentPropsWithoutRef<'a'> & {
        children: React.ReactNode
    }

const PeekabooLink = ({ href,
    children,
    className,
    ...props
}: PeekabooLinkProps) => {
    const [isOpen, setIsOpen] = useState(false)
    if (!href.startsWith('http')) {
        return (
            <Link href={href} className={clsx(className)} {...props}>
                {children}
            </Link>
        )
    }

    if (!env.NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED) {
        return (
            <RichLink
                href={href}
                className={clsx(
                    'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
                    className
                )}
                target="_blank"
                {...props}
            >
                {children}
            </RichLink>
        )
    }

    const onOpenChange = (open: boolean) => {
        setIsOpen(open)
    }

    return (
        <HoverCard.Root openDelay={0} closeDelay={50} onOpenChange={onOpenChange}>
            <HoverCard.Trigger asChild>
                <RichLink
                    href={href}
                    className={clsx(
                        'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
                        className
                    )}
                    target="_blank"
                    {...props}
                >
                    {children}
                </RichLink>
            </HoverCard.Trigger>
            <AnimatePresence mode="wait">
                {isOpen && (
                    <HoverCard.Portal forceMount>
                        <HoverCard.Content asChild collisionPadding={250}>
                            <motion.div
                                className="pointer-events-none relative z-50 w-[400px] origin-top overflow-hidden !p-0"
                                initial={{
                                    opacity: 0,
                                    scale: 0.965,
                                    y: 9,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    height: 250,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.98,
                                    y: 8,
                                    height: 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                            >
                                <Image
                                    src={`/api/link-preview?url=${href}`}
                                    alt={`${href} 的预览图`}
                                    className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                                    placeholder="blur"
                                    blurDataURL={makeBlurDataURL(16, 16)}
                                    width={400}
                                    height={250}
                                    unoptimized
                                />
                            </motion.div>
                        </HoverCard.Content>
                    </HoverCard.Portal>
                )}
            </AnimatePresence>
        </HoverCard.Root>
    )
}

export default PeekabooLink