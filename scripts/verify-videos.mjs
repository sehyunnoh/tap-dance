// Checks every video in src/data/steps with YouTube's oEmbed endpoint (no API key needed).
// A video that is deleted, private or blocks embedding fails the check.
//
//   npm run verify-videos            report only
//   npm run verify-videos -- --write also refresh stored titles/channels

import fs from 'node:fs'

const dir = new URL('../src/data/steps/', import.meta.url)
const write = process.argv.includes('--write')
let checked = 0
const failures = []

for (const file of fs.readdirSync(dir).filter((f) => /^level-\d+\.json$/.test(f)).sort()) {
  const url = new URL(file, dir)
  const steps = JSON.parse(fs.readFileSync(url, 'utf8'))
  let changed = false
  for (const step of steps) {
    for (const video of step.videos) {
      checked++
      const watch = `https://www.youtube.com/watch?v=${video.youtubeId}`
      const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watch)}`)
      if (!res.ok) {
        failures.push(`${file} ${step.id} ${video.youtubeId}: HTTP ${res.status}${res.status === 401 ? ' (embedding disabled)' : ''}`)
        continue
      }
      const info = await res.json()
      if (info.title !== video.title || info.author_name !== video.channel) {
        changed = true
        console.log(`~ ${step.id} ${video.youtubeId}: "${video.title}" → "${info.title}"`)
        video.title = info.title
        video.channel = info.author_name
      }
    }
  }
  if (write && changed) fs.writeFileSync(url, JSON.stringify(steps, null, 2) + '\n')
}

console.log(`${checked} videos checked, ${failures.length} unavailable`)
for (const f of failures) console.log(`  ✗ ${f}`)
process.exit(failures.length ? 1 : 0)
