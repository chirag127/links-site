import { useMemo, useRef, useState } from 'react'
import { complete } from '@chirag127/oz-ai'
import { allSites } from '../lib/data'

type Hit = { slug: string; name: string; why: string; category: string; url: string }

const bySlug = Object.fromEntries(allSites.map((s) => [s.slug, s]))

// Compact catalogue for the model: slug + name + one-line why. Kept small on purpose.
const catalogue = allSites.map((s) => `${s.slug} :: ${s.name} — ${s.why}`).join('\n')

const SYSTEM =
  'You are a field-guide librarian for a curated catalogue of developer websites. ' +
  'Given a need, pick the 3-6 BEST-matching specimens from the catalogue ONLY. ' +
  'Reply with a bare JSON array of their slugs, most relevant first. No prose, no code fences. ' +
  'If nothing fits, reply [].'

function parseSlugs(raw: string): string[] {
  const m = raw.match(/\[[\s\S]*\]/)
  if (!m) return []
  try {
    const arr = JSON.parse(m[0])
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export default function ToolFinder() {
  const [q, setQ] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [hits, setHits] = useState<Hit[]>([])
  const abort = useRef<AbortController | null>(null)

  const examples = useMemo(
    () => ['a place to practice system design', 'free API mocking', 'when I am stuck on a bug', 'read long-form eng blogs'],
    []
  )

  async function ask(query: string) {
    const need = query.trim()
    if (!need) return
    abort.current?.abort()
    abort.current = new AbortController()
    setState('loading')
    setHits([])
    try {
      const out = await complete(`Need: ${need}\n\nCatalogue:\n${catalogue}`, {
        system: SYSTEM,
        temperature: 0.2,
        signal: abort.current.signal,
      })
      const found = parseSlugs(out)
        .map((slug) => bySlug[slug])
        .filter(Boolean)
        .map((s) => ({ slug: s.slug, name: s.name, why: s.why, category: s.category, url: s.url }))
      setHits(found)
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="finder">
      <form
        className="finder-bar"
        onSubmit={(e) => {
          e.preventDefault()
          ask(q)
        }}
      >
        <input
          className="finder-input"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Describe what you need — e.g. free API mocking"
          aria-label="Describe the tool you need"
          autoComplete="off"
        />
        <button className="finder-go" type="submit" disabled={state === 'loading' || !q.trim()}>
          {state === 'loading' ? 'Divining…' : 'Divine'}
        </button>
      </form>

      {state === 'idle' && (
        <ul className="finder-examples">
          {examples.map((ex) => (
            <li key={ex}>
              <button
                type="button"
                onClick={() => {
                  setQ(ex)
                  ask(ex)
                }}
              >
                {ex}
              </button>
            </li>
          ))}
        </ul>
      )}

      {state === 'error' && (
        <p className="finder-note" role="alert">
          Diviner is resting — try again, or browse the plates below.
        </p>
      )}

      {state === 'done' && hits.length === 0 && (
        <p className="finder-note">No specimen matched. Reword, or browse the plates below.</p>
      )}

      {hits.length > 0 && (
        <ol className="finder-hits" aria-label="Suggested specimens">
          {hits.map((h) => (
            <li key={h.slug}>
              <a className="finder-hit" href={`/site/${h.slug}`}>
                <span className="fh-name">{h.name}</span>
                <span className="fh-why">{h.why}</span>
                <span className="fh-url">{h.url.replace(/^https?:\/\//, '')}</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
