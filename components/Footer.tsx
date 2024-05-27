import { CursorClickIcon, UsersIcon } from '@/assets'
import PeekabooLink from '@/components/links/PeekabooLink'
import { Container } from '@/components/ui/Container'
import { navitems } from '@/data/navitems'
import { kvKeys } from '@/types'
import { db } from '@/lib/db'
import { env } from '@/env.mjs'
import { prettifyNumber } from '@/lib/math'
import { redis } from '@/lib/redis'
import Link from 'next/link'
import { Suspense } from 'react'
import githubpng from '@/assets/github.png'

import Image from 'next/image'
import Newsletter from './Newsletter'

const NavLink = ({
    href,
    children,
}: {
    href: string
    children: React.ReactNode
}) => {
    return (
        <Link
            href={href}
            className="transition hover:text-indigo-500 dark:hover:text-indigo-400"
        >
            {children}
        </Link>
    )
}

const Links = () => {
    return (
        <nav className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {navitems.map(({ href, text }) => (
                <NavLink key={href} href={href}>
                    {text}
                </NavLink>
            ))}
        </nav>
    )
}

const TotalPageViews = async () => {
    let views: number
    if (env.VERCEL_ENV === 'production') {
        views = await redis.incr(kvKeys.totalPageViews)
    } else {
        views = 345678
    }

    return (
        <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 md:justify-start">
            <UsersIcon className="h-4 w-4" />
            <span title={`${Intl.NumberFormat('en-US').format(views)}次浏览`}>
                总浏览量&nbsp;
                <span className="font-medium">{prettifyNumber(views, true)}</span>
            </span>
        </span>
    )
}
type VisitorGeolocation = {
    country: string
    city?: string
    flag: string
}

const LastVisitorInfo = async () => {
    let lastVisitor: VisitorGeolocation | undefined = undefined
    if (env.VERCEL_ENV === 'production') {
        const [lv, cv] = await redis.mget<VisitorGeolocation[]>(
            kvKeys.lastVisitor,
            kvKeys.currentVisitor
        )
        lastVisitor = lv
        await redis.set(kvKeys.lastVisitor, cv)
    }

    if (!lastVisitor) {
        lastVisitor = {
            country: 'US',
            flag: '🇺🇸',
        }
    }

    return (
        <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 md:justify-start">
            <CursorClickIcon className="h-4 w-4" />
            <span>
                最近访客来自&nbsp;
                {[lastVisitor.city, lastVisitor.country].filter(Boolean).join(', ')}
            </span>
            <span className="font-medium">{lastVisitor.flag}</span>
        </span>
    )
}
const Footer = async () => {
    const res = await db.subscriber.count()

    

    return (
        <footer>
            <Container.Outer>
                <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
                    <Container.Inner>
                        <div className="mx-auto mb-8 max-w-md">
                            <Newsletter subCount={`${res ?? '0'}`} />
                        </div>
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <p className="text-sm text-zinc-500/80 dark:text-zinc-400/80">
                                &copy; {new Date().getFullYear()} JinjoYan. 网站魔改于：
                                <span className='inline-block'>
                                    <Link href="https://github.com/CaliCastle/cali.so" className='inline-block justify-center'>
                                        <Image alt='' src={githubpng} width={15} height={15}  className='inline-block'/> <span>Github</span>
                                    </Link>
                                </span>
                            </p>
                            <Links />
                        </div>
                    </Container.Inner>
                    <Container.Inner className="mt-6">
                        <div className="flex flex-col items-center justify-start gap-2 sm:flex-row">
                            <Suspense>
                                <TotalPageViews />
                            </Suspense>
                            <Suspense>
                                <LastVisitorInfo />
                            </Suspense>
                        </div>
                    </Container.Inner>
                </div>
            </Container.Outer>
        </footer>
    )
}

export default Footer