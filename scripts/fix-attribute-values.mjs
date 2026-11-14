import { readFileSync, writeFileSync } from "node:fs";

function edit(file, from, to) {
  const s = readFileSync(file, "utf8");
  if (s.includes(to)) return console.log(file + ": قبلاً اعمال شده");
  if (!from.test(s)) return console.error(file + ": الگو پیدا نشد");
  writeFileSync(file, s.replace(from, to));
  console.log(file + ": به‌روز شد");
}

edit(
  "src/features/products/mappers.ts",
  /\[attributeLabel\(name\),\s*value\]/,
  "[attributeLabel(name), String(value)]",
);
edit(
  "src/features/products/dto.ts",
  /attributes:\s*Record<string,\s*string>;/,
  "attributes: Record<string, string | number>;",
);
edit(
  "src/features/cart/server/dto.ts",
  /attributes:\s*\{\s*name:\s*string;\s*value:\s*string\s*\}\[\];/,
  "attributes: { name: string; value: string | number }[];",
);
