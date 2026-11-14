import { readFileSync, writeFileSync } from "node:fs";

function edit(file, from, to) {
  const s = readFileSync(file, "utf8");
  if (!from.test(s)) return console.error(file + ": الگو پیدا نشد");
  writeFileSync(file, s.replace(from, to));
  console.log(file + ": به‌روز شد");
}

const mappers = "src/features/products/mappers.ts";
let s = readFileSync(mappers, "utf8");
if (s.includes("function attributePairs")) {
  console.log(mappers + ": قبلاً اعمال شده");
} else {
  edit(
    mappers,
    /Object\.entries\(v\.attributes\)\.map\(\(\[name,\s*value\]\)\s*=>\s*\[attributeLabel\(name\),\s*(?:String\(value\)|value)\]\)/,
    "attributePairs(v.attributes).map(([name, value]) => [attributeLabel(name), value])",
  );
  s = readFileSync(mappers, "utf8");
  const helper = `/**
 * بک‌اند ویژگی‌های ترکیب را آرایه‌ی {name, value} می‌دهد؛ شکل شیء هم پذیرفته می‌شود.
 * مقدار همیشه رشته می‌شود تا بقیه‌ی برنامه فقط رشته ببیند.
 */
function attributePairs(attributes: PublicVariantDto["attributes"]): [string, string][] {
  const pairs: [string, string | number][] = Array.isArray(attributes)
    ? attributes.map((a) => [a.name, a.value])
    : Object.entries(attributes);
  return pairs.map(([name, value]) => [name, String(value)]);
}

`;
  s = s.replace(/function toVariant\(/, helper + "function toVariant(");
  writeFileSync(mappers, s);
}

edit(
  "src/features/products/dto.ts",
  /attributes:\s*Record<string,\s*string(?:\s*\|\s*number)?>;/,
  "attributes: { name: string; value: string | number }[] | Record<string, string | number>;",
);
