import { useRef, useMemo, useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'

const App = () => {

  const [username, setUsername] = useState(()=>{
    return new URLSearchParams(window.location.search).get('username') || '';
  });

  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const [userConnected, setUserConnected] = useState([]);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText('monaco'), [ydoc]);
 

  const handleMount = (editor) => {
    editorRef.current = editor
    const provider = providerRef.current
    if (!provider) return

    bindingRef.current?.destroy()
    bindingRef.current = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    )
  }

  const handleJoin = (e) => {
    e.preventDefault()
    const name = e.target.username.value.trim()
    if (!name) return
    setUsername(name)
    const params = new URLSearchParams(window.location.search)
    params.set('username', name)
    window.history.replaceState({}, '', `?${params.toString()}`)
  }

  useEffect(() => {
    if (!username) return

    const provider = new SocketIOProvider('http://localhost:3000', 'monaco', ydoc, {
      autoConnect: true,
    })
    providerRef.current = provider

    provider.awareness.setLocalStateField('user', { username })
    const onAwarenessChange = () => {
      const states = Array.from(provider.awareness.getStates().values())
      setUserConnected(
        states
          .filter((state) => state?.user?.username)
          .map((state) => state.user),
      )
    }
    provider.awareness.on('change', onAwarenessChange)

    function handleBeforeUnload() {
      provider.awareness.setLocalStateField('user', null)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      bindingRef.current?.destroy()
      bindingRef.current = null
      provider.destroy()
      providerRef.current = null
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [username, ydoc])
  if(!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
        <form
          onSubmit={handleJoin}
          className="w-full max-w-sm rounded-2xl border border-neutral-800/60 bg-[#fffdf0] p-8 shadow-2xl shadow-black/40"
        >
          <input
            type="text"
            name="username"
            placeholder="Your name"
            autoComplete="username"
            required
            className="mt-8 w-full rounded-xl border border-neutral-300/80 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/25"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-neutral-900 py-3 text-sm font-medium text-[#fffdf0] transition hover:bg-neutral-800 active:scale-[0.99]"
          >
            Continue
          </button>
        </form>
      </div>
    )
  }
  return (
    <main className="box-border flex h-screen gap-3 bg-[#0a0a0a] p-3">
      <aside   className="w-[28%] min-w-[220px] shrink-0 rounded-2xl border border-neutral-800/60 bg-[#fffdf0]"
        aria-label="Sidebar">
        <ul className="p-4">
        <h1 className="text-lg font-bold text-neutral-900">Users</h1>
          {userConnected.map((user)=>(
           
            <li key={user.username} className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">{user.username}</span>
            </li>
          ))}
        </ul>
        </aside>

      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-[#121212]"
        aria-label="Editor"
      >
        <div className="editor-shell min-h-0 flex-1">
         <Editor
         height="100%"
         width="100%"
         language="javascript"
         theme="collab-dark"
        onMount={handleMount}
         />
        </div>
      </section>
    </main>
  )
}

export default App
