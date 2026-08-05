import { useEffect, useState } from 'react'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react'
import { loadPressed, savePressed } from '../lib/firebase'

const pk = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

function Notebook() {
  const { user } = useUser()
  const [pressed, setPressed] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    loadPressed(user.id).then((p) => {
      setPressed(p)
      setLoaded(true)
    })
  }, [user])

  // Cross-island bridge: expose current pressed set + a toggler for specimen buttons.
  useEffect(() => {
    ;(window as any).__pressed = new Set(pressed)
    window.dispatchEvent(new CustomEvent('notebook:sync', { detail: pressed }))
  }, [pressed])

  useEffect(() => {
    const onToggle = (e: Event) => {
      const slug = (e as CustomEvent).detail as string
      if (!user) return
      setPressed((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        savePressed(user.id, next)
        return next
      })
    }
    window.addEventListener('notebook:press', onToggle as EventListener)
    return () => window.removeEventListener('notebook:press', onToggle as EventListener)
  }, [user])

  return (
    <div className="notebook">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="nb-btn" type="button">Field notebook</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <span className="nb-count" title="Pressed specimens">
          {loaded ? pressed.length : '—'} pressed
        </span>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  )
}

export default function ClerkIsland() {
  if (!pk) {
    return (
      <div className="notebook">
        <span className="nb-count nb-muted" title="Set PUBLIC_CLERK_PUBLISHABLE_KEY to enable">
          notebook offline
        </span>
      </div>
    )
  }
  return (
    <ClerkProvider publishableKey={pk}>
      <Notebook />
    </ClerkProvider>
  )
}
