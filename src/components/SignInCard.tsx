/*
 * SignInCard — the /sign-in page's Clerk <SignIn> surface for The Field Ledger.
 * The ONLY Clerk provider on this page (one provider per page). Every specimen
 * and dead-link record stays public; this card only opens a session for the
 * field notebook (pressed specimens, saved to Firestore by Clerk user id).
 * Themed field-guide: verdigris on aged rag paper, engraved rules.
 */
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'

const pk = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

const appearance = {
  variables: {
    colorPrimary: '#2f6d5e',
    colorText: '#23302a',
    colorTextSecondary: '#6f6046',
    colorBackground: '#f2ecdb',
    colorInputBackground: '#e9e2ce',
    colorInputText: '#23302a',
    colorDanger: '#b3402b',
    borderRadius: '2px',
    fontFamily: "'Spectral', Georgia, serif",
  },
  elements: {
    card: {
      backgroundColor: '#f2ecdb',
      border: '1px solid #9c8f6a',
      boxShadow: '0 1px 0 #cabf9d, 0 10px 34px rgba(35,48,42,0.18)',
      borderRadius: '3px',
    },
    headerTitle: {
      fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif",
      color: '#23302a',
      letterSpacing: '-0.01em',
    },
    headerSubtitle: { color: '#6f6046' },
    formButtonPrimary: {
      backgroundColor: '#2f6d5e',
      color: '#f2ecdb',
      fontWeight: '600',
      borderRadius: '2px',
      textTransform: 'none',
    },
    formFieldInput: {
      backgroundColor: '#e9e2ce',
      borderColor: '#9c8f6a',
      color: '#23302a',
    },
    formFieldLabel: { color: '#23302a' },
    footerActionLink: { color: '#2f6d5e' },
    identityPreviewEditButton: { color: '#2f6d5e' },
    logoBox: { height: '26px' },
  },
} as const

function SignedInNote() {
  const { user } = useUser()
  const who = user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? 'field botanist'
  return (
    <div className="si-done">
      <div className="si-row">
        <UserButton afterSignOutUrl="/sign-in/" />
        <span className="si-hi">Signed in — {who}</span>
      </div>
      <a className="si-go" href="/">
        Back to the specimens →
      </a>
    </div>
  )
}

export default function SignInCard() {
  if (!pk) {
    return (
      <p className="si-off">
        Sign-in is offline on this build. All specimens and dead-link records stay public.
      </p>
    )
  }
  return (
    <ClerkProvider publishableKey={pk} afterSignOutUrl="/sign-in/">
      <SignedOut>
        <div className="si-mount">
          <SignIn routing="hash" signUpUrl="/sign-in/" fallbackRedirectUrl="/" />
          <p className="si-anon">
            Just browsing the ledger? <a href="/">Keep browsing without an account →</a> Every
            specimen is public; sign in only to press them into your field notebook.
          </p>
        </div>
      </SignedOut>
      <SignedIn>
        <SignedInNote />
      </SignedIn>
      <style>{`
        .si-mount { display: flex; flex-direction: column; gap: 1.1rem; align-items: center; }
        .si-anon { color: var(--sepia, #6f6046); font-size: 0.95rem; text-align: center; max-width: 48ch; margin: 0; }
        .si-anon a { color: var(--verdigris, #2f6d5e); text-decoration: underline; text-underline-offset: 3px; }
        .si-off { color: var(--sepia, #6f6046); font-size: 0.95rem; margin: 0; max-width: 52ch; }
        .si-done { display: flex; flex-direction: column; gap: 1rem; }
        .si-row { display: flex; align-items: center; gap: 0.75rem; }
        .si-hi { font-family: ui-monospace, monospace; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--sepia, #6f6046); }
        .si-go { color: var(--verdigris, #2f6d5e); font-family: ui-monospace, monospace; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; }
        .si-go:hover { color: var(--ink, #23302a); }
      `}</style>
    </ClerkProvider>
  )
}
