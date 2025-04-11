// components/InstallButton.tsx
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../ui/button'

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install button
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      ; (deferredPrompt as any).prompt()
      // Wait for the user to respond to the prompt
      const { outcome } = await (deferredPrompt as any).userChoice
      // Reset the deferred prompt variable
      setDeferredPrompt(null)
      // Hide the install button after the prompt is shown
      setIsInstallable(false)
      console.log(`User response to the install prompt: ${outcome}`)
    }
  }

  return (
    <>
      {isInstallable && (
        <div className=" w-full">
          <div className="max-w-screen-md mx-auto py-4 border-t border-black">
            <Button variant="primary" onClick={handleInstallClick} className="w-full">
              <Download className="size-4" />
              Install
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default InstallButton
