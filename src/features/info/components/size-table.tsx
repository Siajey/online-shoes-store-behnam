import { toPersianDigits } from "@/lib/format";
import { infoCopy } from "../copy";
import { sizeChart } from "../size-chart";

/** جدول تطبیق سایز اروپایی با طول پا. اعداد فارسی و چپ‌به‌راست‌ نمی‌شوند. */
export function SizeTable() {
  const c = infoCopy.sizeGuide;
  return (
    <div className="rounded-card bg-surface overflow-x-auto">
      <table className="w-full text-center">
        <caption className="sr-only">{c.tableCaption}</caption>
        <thead>
          <tr className="border-line text-fg-muted border-b text-sm">
            <th scope="col" className="px-4 py-3 font-medium">
              {c.colSize}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {c.colFoot}
            </th>
          </tr>
        </thead>
        <tbody>
          {sizeChart.map((row) => (
            <tr key={row.eu} className="border-line border-b last:border-b-0">
              <th scope="row" className="px-4 py-3 font-medium">
                {toPersianDigits(row.eu)}
              </th>
              <td className="px-4 py-3">
                {toPersianDigits(row.footCm.toFixed(1).replace(".", "٫"))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
