import { existsSync, readFileSync, writeFileSync } from "node:fs";

const names = ["vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.config.mjs"];
const file = names.find((n) => existsSync(n));
if (!file) {
  console.error("فایل vitest.config پیدا نشد.");
  process.exit(1);
}
const s = readFileSync(file, "utf8");
if (s.includes("NEXT_PUBLIC_API_URL")) {
  console.log("قبلاً اضافه شده است.");
  process.exit(0);
}
const match = /test\s*:\s*\{/.exec(s);
if (!match) {
  console.error("بخش test در " + file + " پیدا نشد؛ محتوای فایل را برایم بفرست.");
  process.exit(1);
}
const at = match.index + match[0].length;
const next = s.slice(0, at) + '\n    env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" },' + s.slice(at);
writeFileSync(file, next);
console.log(file + " به‌روز شد.");
