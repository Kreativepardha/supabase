import { createFileRoute } from '@tanstack/react-router'
import { NextApiRequest, NextApiResponse } from 'next'

import { toWebHandler } from '@/compat/next/api'

// Returns the raw HTML of a page so the SQL editor can render link previews
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query

  try {
    const response = await fetch(String(url), { redirect: 'follow' })
    const body = await response.text()
    res.setHeader('Content-Type', response.headers.get('content-type') ?? 'text/html')
    return res.status(response.status).send(body)
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

const webHandler = toWebHandler(handler)

export const Route = createFileRoute('/api/link-preview')({
  server: { handlers: { GET: webHandler } },
})
