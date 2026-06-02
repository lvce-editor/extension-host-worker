import type { BenchmarkResult } from './BenchmarkResult.ts'

const rowHeight = 52
const labelWidth = 170
const chartWidth = 520
const rawColor = '#2563eb'
const zipColor = '#16a34a'

export const createBenchmarkSvg = (results: readonly BenchmarkResult[], formatBytes: (bytes: number) => string): string => {
  const maxSize = Math.max(...results.map((result) => result.rawBytes))
  const height = 72 + results.length * rowHeight
  const rows = results
    .map((result, index) => {
      const y = 56 + index * rowHeight
      const rawWidth = Math.round((result.rawBytes / maxSize) * chartWidth)
      const zipWidth = Math.round((result.zipBytes / maxSize) * chartWidth)
      return `<text x="24" y="${y + 18}" class="label">${result.label}</text>
<rect x="${labelWidth}" y="${y}" width="${rawWidth}" height="18" rx="2" fill="${rawColor}" />
<rect x="${labelWidth}" y="${y + 22}" width="${zipWidth}" height="18" rx="2" fill="${zipColor}" />
<text x="${labelWidth + rawWidth + 8}" y="${y + 14}" class="value">${formatBytes(result.rawBytes)}</text>
<text x="${labelWidth + zipWidth + 8}" y="${y + 36}" class="value">${formatBytes(result.zipBytes)} zipped</text>`
    })
    .join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="${height}" viewBox="0 0 860 ${height}" role="img" aria-labelledby="title desc">
<title id="title">Isolated extension API bundle size benchmark</title>
<desc id="desc">Raw and zipped bundle sizes for generated isolated extension worker examples.</desc>
<style>
  text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .title { font-size: 20px; font-weight: 700; fill: #111827; }
  .legend, .value { font-size: 12px; fill: #374151; }
  .label { font-size: 14px; fill: #111827; }
</style>
<rect width="860" height="${height}" fill="#ffffff" />
<text x="24" y="30" class="title">Isolated Extension API Bundle Size</text>
<rect x="510" y="19" width="12" height="12" fill="${rawColor}" />
<text x="530" y="30" class="legend">bundle</text>
<rect x="600" y="19" width="12" height="12" fill="${zipColor}" />
<text x="620" y="30" class="legend">zip</text>
${rows}
</svg>
`
}
