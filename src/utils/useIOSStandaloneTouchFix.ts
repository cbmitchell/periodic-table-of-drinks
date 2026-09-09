import { useEffect } from 'react'

// Works around a WKWebView bug that only shows up when this app is running as
// an iOS home-screen web app (Add to Home Screen, i.e. `navigator.standalone`):
// after a device rotation, touch hit-testing for `position: fixed` elements
// (the control panel button, the pan/zoom table container, ...) goes stale —
// taps land nowhere — until the page receives a *real* native touch/scroll.
// Reapplying styles or transforms from JS isn't enough (PeriodicTable already
// reapplies the pan/zoom transform on resize, and that alone doesn't fix it);
// only an actual scroll nudges WKWebView into recomputing hit regions. So we
// perform that nudge ourselves right after a rotation settles, instead of
// leaving the user to discover that panning the table "unsticks" everything.
export function useIOSStandaloneTouchFix() {
  useEffect(() => {
    // `navigator.standalone` is iOS Safari's non-standard flag for "launched
    // from the home screen"; it's absent everywhere else (including desktop
    // Safari and in-browser iOS Safari), which keeps this fix scoped to
    // exactly the environment where the bug has been observed.
    if (!(window.navigator as { standalone?: boolean }).standalone) return

    // The page has no in-flow content (everything is `position: fixed`), so
    // there's normally nothing to scroll — the nudge below would be a no-op.
    // This spacer gives the document 1px of real scrollable overflow so the
    // scrollTo actually performs a native scroll rather than being clamped.
    const spacer = document.createElement('div')
    spacer.style.cssText = 'position:absolute; top:0; left:0; width:1px; height:calc(100% + 1px); pointer-events:none; visibility:hidden;'
    document.body.appendChild(spacer)

    const nudge = () => {
      window.scrollTo(0, 1)
      requestAnimationFrame(() => window.scrollTo(0, 0))
    }
    window.addEventListener('resize', nudge)
    window.addEventListener('orientationchange', nudge)
    return () => {
      window.removeEventListener('resize', nudge)
      window.removeEventListener('orientationchange', nudge)
      spacer.remove()
    }
  }, [])
}
