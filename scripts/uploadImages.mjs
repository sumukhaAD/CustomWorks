import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'

const SUPABASE_URL = ''
const SUPABASE_SERVICE_KEY = ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const fileContent = readFileSync('./src/lib/products.ts', 'utf8')

const imageRegex = /"image":\s*"(data:image\/svg\+xml;base64,[^"]+)"/g
let match
let updatedContent = fileContent
let count = 1

const uploads = []

while ((match = imageRegex.exec(fileContent)) !== null) {
  const base64Data = match[1].replace('data:image/svg+xml;base64,', '')
  const buffer = Buffer.from(base64Data, 'base64')
  const filename = `product-${count}.svg`
  uploads.push({ filename, buffer, original: match[1] })
  count++
}

for (const item of uploads) {
  console.log(`Uploading ${item.filename}...`)
  const { error } = await supabase.storage
    .from('product-images')
    .upload(item.filename, item.buffer, {
      contentType: 'image/svg+xml',
      upsert: true
    })

  if (error) {
    console.error(`Failed: ${item.filename}`, error.message)
    continue
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(item.filename)

  updatedContent = updatedContent.replace(
    `"${item.original}"`,
    `"${data.publicUrl}"`
  )
  console.log(`✓ ${item.filename} → ${data.publicUrl}`)
}

writeFileSync('./src/lib/products.ts', updatedContent)
console.log('Done! products.ts updated.')