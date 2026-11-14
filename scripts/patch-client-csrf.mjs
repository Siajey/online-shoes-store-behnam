import { readFileSync, writeFileSync } from "node:fs";

const file = "src/lib/api/client.ts";
let s = readFileSync(file, "utf8");

if (s.includes("opts.csrf")) {
  console.log("قبلاً اعمال شده است؛ تغییری لازم نیست.");
  process.exit(0);
}

const edits = [
  [
    "  skipCsrf?: boolean;\n};",
    "  skipCsrf?: boolean;\n  /** برای endpointهایی که روی GET هم توکن CSRF می‌خواهند (مثل سبد خرید). */\n  csrf?: boolean;\n};",
  ],
  [
    "    if (withCsrf && isMutating(method)) headers[apiConfig.csrfHeader] = await getCsrfToken();",
    "    if (withCsrf && (isMutating(method) || opts.csrf)) {\n      headers[apiConfig.csrfHeader] = await getCsrfToken();\n    }",
  ],
  [
    "} else if (res.status === 403 && isMutating(method)) {",
    "} else if (res.status === 403 && (isMutating(method) || opts.csrf)) {",
  ],
];

for (const [from, to] of edits) {
  if (!s.includes(from)) {
    console.error("متن مورد انتظار در client.ts پیدا نشد:\n" + from);
    process.exit(1);
  }
  s = s.replace(from, to);
}
writeFileSync(file, s);
console.log("client.ts به‌روز شد.");
