import { Popover, PopoverButton, type PopoverProps,Transition,TransitionChild, PopoverOverlay, PopoverPanel} from '@headlessui/react'

import { clsx } from 'clsx'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback } from 'react'
import { navitems } from '@/data/navitems'

const NavItem = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = usePathname() === href

    return (
        <li>
            <Link href={href} className={clsx('relative block whitespace-nowrap px-3 py-2 transition', isActive ? 'text-indigo-600 dark:text-indigo-400'
                : 'hover:text-indigo-600 dark:hover:text-indigo-400'
            )}>
                {children}
                {isActive && (
                    <motion.span
                        className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-indigo-700/0 via-indigo-700/70 to-indigo-700/0 dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0"
                        layoutId="active-nav-item"
                    />
                )}
            </Link>
        </li>
    )
}

const PCNav = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const radius = useMotionValue(0)

    const handleMouseMove = useCallback(
        ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
            const viewport = currentTarget.getBoundingClientRect()
            mouseX.set(clientX - viewport.left)
            mouseY.set(clientY - viewport.top)
            radius.set(Math.sqrt(viewport.width ** 2 + viewport.height ** 2) / 2.5)

        },
        [mouseX, mouseY, radius]
    )

    const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

    return (
        <nav
            onMouseMove={handleMouseMove}
            className={clsx(
                'group relative',
                'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
                'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
                'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
                '[--spotlight-color:rgb(88_101_242_/_0.3)] dark:[--spotlight-color:rgb(88_101_242_/_0.1)]',
                className
            )}
            {...props}
        >
            {/* Spotlight overlay */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background }}
                aria-hidden="true"
            />

            <ul className="flex bg-transparent px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 ">
                {navitems.map(({ href, text }) => (
                    <NavItem key={href} href={href}>
                        {text}
                    </NavItem>
                ))}
            </ul>
        </nav>
    )

}

const MobileNavItem = ({
    href,
    children,
}: {
    href: string
    children: React.ReactNode
}) => {
    return (
        <li>
            <PopoverButton as={Link} href={href} className="block py-2">
                {children}
            </PopoverButton>
        </li>
    )
}

const Mobile = (props: PopoverProps<'div'>) => {
    return (
        <Popover {...props}>
            <PopoverButton className="group flex items-center rounded-full bg-gradient-to-b from-zinc-50/20 to-white/80 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md focus:outline-none focus-visible:ring-2 dark:from-zinc-900/30 dark:to-zinc-800/80 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20 dark:focus-visible:ring-yellow-500/80">
                前往
                <svg
                    viewBox="0 0 8 6"
                    aria-hidden="true"
                    className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
                >
                    <path
                        d="M1.75 1.75 4 4.25l2.25-2.5"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </PopoverButton>
            <Transition>
                <TransitionChild
                    as={React.Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <PopoverOverlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur dark:bg-black/80" />
                </TransitionChild>
                <TransitionChild
                    as={React.Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <PopoverPanel
                        focus
                        className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-gradient-to-b from-zinc-100/75 to-white p-8 ring-1 ring-zinc-900/5 dark:from-zinc-900/50 dark:to-zinc-900 dark:ring-zinc-800"
                    >
                        <div className="flex flex-row-reverse items-center justify-between">
                            <PopoverButton aria-label="关闭菜单" className="-m-1 p-1">
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
                                >
                                    <path
                                        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </PopoverButton>
                            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                站内导航
                            </h2>
                        </div>
                        <nav className="mt-6">
                            <ul className="-my-2 divide-y divide-zinc-500/20 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                                {navitems.map(({ href, text }) => (
                                    <MobileNavItem key={href} href={href}>
                                        {text}
                                    </MobileNavItem>
                                ))}
                            </ul>
                        </nav>
                    </PopoverPanel>
                </TransitionChild>
            </Transition>
        </Popover>
    )

}

export const NavBar={
    PCNav,Mobile
}as const