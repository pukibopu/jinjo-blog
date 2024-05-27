import { Ratelimit } from "@upstash/ratelimit";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { emailConfig } from "@/data/email";
import { db } from "@/lib/db";
import ConfirmSub from "@/emails/ConfirmSub";
import { env } from "@/env.mjs";
import { url } from "@/lib";
import { resend } from "@/lib/mail";
import { redis } from "@/lib/redis";

const newsletterFormSchema = z.object({
  email: z.string().email().min(1),
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "10 s"),
  analytics: true,
});

export async function POST(req: NextRequest) {
  if (env.NODE_ENV === "production") {
    const { success } = await ratelimit.limit("subscribe_" + (req.ip ?? ""));
    if (!success) {
      return NextResponse.error();
    }
  }
  try {
    const { data } = await req.json();
    const parsed = newsletterFormSchema.parse(data);
    const subscriber = await db.subscriber.findUnique({
      where: {
        email: parsed.email,
      },
    });
    if (subscriber) {
      return NextResponse.json({ status: "success" });
    }

    const token = crypto.randomUUID();

    if (env.NODE_ENV === 'production') {
        await resend.emails.send({
          from: emailConfig.from,
          to: parsed.email,
          subject: '来自 Cali 的订阅确认',
          react: ConfirmSub({
            link: url(`confirm/${token}`).href,
          }),
        })
  
        await db.subscriber.create({
            data:{
                email:parsed.email,
                token:token,
            }
        })
      }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Newsletter]", error);

    return NextResponse.error();
  }
}
