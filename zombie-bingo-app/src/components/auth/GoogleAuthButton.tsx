import React, { useState, useEffect } from 'react'
import type { UserSession } from '../../types/navigation'

interface GoogleAuthButtonProps {
  onSuccess: (session: UserSession) => void
  isRegister?: boolean
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess, isRegister = false }) => {
  const [showDevModal, setShowDevModal] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!googleClientId) return

    // Cargar SDK oficial de Google Identity Services dinámicamente si hay Client ID
    const scriptId = 'google-gsi-client'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        const win = window as unknown as {
          google?: {
            accounts?: {
              id?: {
                initialize: (opts: Record<string, unknown>) => void
                prompt: () => void
              }
            }
          }
        }
        win.google?.accounts?.id?.initialize({
          client_id: googleClientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              try {
                // Decodificar JWT de Google sin librerías externas
                const payload = JSON.parse(atob(response.credential.split('.')[1]))
                onSuccess({
                  id: 'g-' + (payload.sub || Date.now()),
                  username: payload.name || payload.given_name || 'Superviviente Google',
                  email: payload.email,
                  avatar: payload.picture || '/img/avatar1.jpg',
                  isAuthenticated: true,
                  provider: 'google',
                })
              } catch (err) {
                console.error('Error al decodificar credencial de Google:', err)
              }
            }
          },
        })
      }
      document.body.appendChild(script)
    }
  }, [googleClientId, onSuccess])

  const handleClick = () => {
    const win = window as unknown as {
      google?: {
        accounts?: {
          id?: {
            prompt: () => void
          }
        }
      }
    }

    if (googleClientId && win.google?.accounts?.id) {
      win.google.accounts.id.prompt()
    } else {
      // Modo Desarrollo / Sandbox sin Client ID de GCP
      setShowDevModal(true)
    }
  }

  const handleSelectMock = (name: string, email: string, avatar: string) => {
    setShowDevModal(false)
    onSuccess({
      id: 'g-dev-' + Date.now(),
      username: name,
      email,
      avatar,
      isAuthenticated: true,
      provider: 'google',
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="w-full h-11 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-medium text-sm border border-slate-300 shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="font-semibold tracking-wide">
          {isRegister ? 'Registrarse con Google' : 'Continuar con Google'}
        </span>
      </button>

      {/* Modal simulador para entorno local */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div>
                <h4 className="text-white text-sm font-semibold">Iniciar sesión con Google</h4>
                <p className="text-xs text-slate-400">Elige una cuenta para Zombie Bingo</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleSelectMock('Brayan Cortés', 'brayanstidcorteslombana@gmail.com', '/img/avatar1.jpg')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                  B
                </div>
                <div className="truncate">
                  <div className="text-sm font-medium text-white">Brayan Cortés</div>
                  <div className="text-xs text-slate-400 truncate">brayanstidcorteslombana@gmail.com</div>
                </div>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (customName && customEmail) {
                  handleSelectMock(customName, customEmail, '/img/avatar2.jpg')
                }
              }}
              className="space-y-2 pt-2 border-t border-slate-800"
            >
              <div className="text-xs text-slate-400 font-medium">O usa otra cuenta:</div>
              <input
                type="text"
                placeholder="Nombre"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="correo@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!customName || !customEmail}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
              >
                Entrar con esta cuenta
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowDevModal(false)}
              className="mt-3 w-full py-1.5 rounded-lg text-slate-400 hover:text-white text-xs transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
