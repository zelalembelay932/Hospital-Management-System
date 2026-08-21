const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const escapePdf = (value) => String(value ?? '')
  .replace(/[^\x20-\x7E]/g, '?')
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')

const download = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const reportLines = (report) => [
  report.title,
  `Generated: ${report.generatedAt}`,
  `Period: ${report.period}`,
  '',
  ...report.summary.map(([label, value]) => `${label}: ${value}`),
  ...report.sections.flatMap((section) => [
    '',
    section.title,
    section.columns.join(' | '),
    ...section.rows.map((row) => row.join(' | '))
  ])
]

export const downloadReportAsExcel = (report, filename) => {
  const summaryRows = report.summary.map(([label, value]) => (
    `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  )).join('')

  const sections = report.sections.map((section) => `
    <h2>${escapeHtml(section.title)}</h2>
    <table>
      <thead><tr>${section.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead>
      <tbody>${section.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  `).join('')

  const workbook = `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head><meta charset="utf-8"><style>
    body { font-family: Arial, sans-serif; color: #111827; }
    h1 { color: #11698E; } h2 { margin-top: 24px; color: #19456B; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
    th, td { border: 1px solid #94a3b8; padding: 8px; text-align: left; }
    th { background: #e0f2fe; font-weight: bold; }
  </style></head>
  <body>
    <h1>${escapeHtml(report.title)}</h1>
    <p><strong>Generated:</strong> ${escapeHtml(report.generatedAt)}<br><strong>Period:</strong> ${escapeHtml(report.period)}</p>
    <h2>Summary</h2><table><tbody>${summaryRows}</tbody></table>
    ${sections}
  </body>
</html>`

  download(new Blob(['\ufeff', workbook], { type: 'application/vnd.ms-excel;charset=utf-8' }), filename)
}

export const downloadReportAsPdf = (report, filename) => {
  const lines = reportLines(report)
  const linesPerPage = 45
  const pages = []

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage))
  }

  const objects = []
  const pageIds = pages.map((_, index) => 4 + index * 2)
  const contentIds = pages.map((_, index) => 5 + index * 2)

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'

  pages.forEach((page, index) => {
    const pageId = pageIds[index]
    const contentId = contentIds[index]
    const stream = page.map((line, lineIndex) => {
      const size = lineIndex === 0 ? 16 : 10
      const y = lineIndex === 0 ? 750 : 724 - (lineIndex - 1) * 15
      return `BT /F1 ${size} Tf 50 ${y} Td (${escapePdf(line)}) Tj ET`
    }).join('\n')

    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  })

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`
  }

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  download(new Blob([pdf], { type: 'application/pdf' }), filename)
}
