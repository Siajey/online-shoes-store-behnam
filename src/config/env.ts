import { z } from "zod";

/**
 * اعتبارسنجی متغیرهای محیطی. اگر چیزی کم باشد، برنامه همان ابتدا با پیام روشن خطا می‌دهد.
 * فقط متغیرهای NEXT_PUBLIC_ به مرورگر می‌رسند؛ هیچ secret با این پیشوند نگذارید.
 */
const schema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_USE_MOCKS: z.enum(["true", "false"]).default("false"),
});

export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS,
});
