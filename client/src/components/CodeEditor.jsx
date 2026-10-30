import Editor from '@monaco-editor/react'

const EDITOR_THEME = 'collab-dark'

function defineTheme(monaco) {
  monaco.editor.defineTheme(EDITOR_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#121212',
      'editorGutter.background': '#121212',
    },
  })
}

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
  const handleMount = (_editor, monaco) => {
    defineTheme(monaco)
    monaco.editor.setTheme(EDITOR_THEME)
  }

  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      theme={EDITOR_THEME}
      value={value}
      onChange={(next) => onChange(next ?? '')}
      onMount={handleMount}
      loading={
        <div className="flex h-full items-center justify-center bg-[#121212] text-sm text-neutral-500">
          Loading editor…
        </div>
      }
      options={{
        minimap: { enabled: false },
        fontSize: 15,
        lineHeight: 24,
        fontFamily: "Consolas, 'Courier New', monospace",
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: 'line',
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        automaticLayout: true,
      }}
    />
  )
}

export default CodeEditor
