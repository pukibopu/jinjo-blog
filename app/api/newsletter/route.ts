import { Ratelimit } from '@upstash/ratelimit'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '@/data/email'
import { db } from '@/lib/db'