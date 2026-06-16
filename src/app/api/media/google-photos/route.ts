import { NextResponse } from 'next/server'
import https from 'https'

export const dynamic = 'force-dynamic'

// Follow short link redirects (e.g., photos.app.goo.gl -> photos.google.com/share/...)
function resolveRedirects(url: string, depth = 0): Promise<string> {
  if (depth > 5) return Promise.resolve(url)
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(resolveRedirects(res.headers.location, depth + 1))
      } else {
        resolve(url)
      }
    }).on('error', () => {
      resolve(url)
    })
  })
}

// Fetch raw HTML of the resolved URL
function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    }).on('error', (err) => reject(err))
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const albumUrl = searchParams.get('url')

    if (!albumUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    const cleanUrl = albumUrl.trim()
    
    // Validate that it looks like a Google Photos sharing link
    if (!cleanUrl.includes('photos.app.goo.gl') && !cleanUrl.includes('photos.google.com')) {
      return NextResponse.json({ error: 'Invalid Google Photos URL' }, { status: 400 })
    }

    // Resolve redirection
    const longUrl = await resolveRedirects(cleanUrl)
    
    // Fetch album page HTML
    const html = await fetchHtml(longUrl)
    
    // Regex matching all lh3.googleusercontent.com urls including path slashes (e.g. /pw/)
    const regex = /(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_\/=-]+)/g
    const matches = html.match(regex) || []
    
    // De-duplicate matches
    const uniqueMatches = Array.from(new Set(matches))
    
    // Filter to keep only matches containing "/pw/" which represent actual user-uploaded photo items
    const photoBaseUrls = uniqueMatches
      .filter(url => url.includes('/pw/'))
      .map(url => {
        // Strip out existing dimension parameters (e.g. =w41-h72-no, =w600-h315-p-k, etc.)
        const base = url.split('=')[0]
        return {
          type: 'image' as const,
          // Append w1920 for premium high-resolution previews
          src: `${base}=w1920`
        }
      })

    if (photoBaseUrls.length === 0) {
      return NextResponse.json({ error: 'No images found in the shared Google Photos album. Make sure the album is shared publicly.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      media: photoBaseUrls
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
      }
    })
  } catch (error: any) {
    console.error('Google Photos album scraping error:', error)
    return NextResponse.json({ error: error.message || 'Failed to scrape Google Photos album' }, { status: 500 })
  }
}
