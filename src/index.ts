import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  // Track currently webview panel
  let currentPanel: vscode.WebviewPanel | undefined

  context.subscriptions.push(
    vscode.commands.registerCommand('sourceMapVisualization.show', () => {
      if (currentPanel) {
        // If we already have a panel, show it in the target column
        currentPanel.reveal(getViewColumn())
        updatePanel(currentPanel)
      }
      else {
        // Otherwise, create a new panel
        vscode.window.setStatusBarMessage('Show source map visualization...', show(context.extensionUri).then((panel) => {
          currentPanel = panel
          // Reset when the current panel is closed
          panel.onDidDispose(
            () => {
              currentPanel = undefined
            },
            null,
            context.subscriptions,
          )
        }))
      }
    }),
  )
}

const viewType = 'sourceMapVisualization'

async function show(extensionUri: vscode.Uri) {
  const panel = vscode.window.createWebviewPanel(
    viewType,
    'Source Map Visualization',
    getViewColumn(),
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  )

  panel.webview.html = getHtmlForWebview(panel.webview, extensionUri)

  updatePanel(panel)

  return panel
}

function getViewColumn() {
  return vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One
}

async function updatePanel(panel: vscode.WebviewPanel) {
  if (!panel)
    return
  const data = await getCodeAndMap()
  if (!data)
    return
  panel.webview.postMessage({
    command: 'update',
    data,
  })
}

async function getCodeAndMap() {
  const editor = vscode.window.activeTextEditor
  if (!editor)
    return

  const document = editor.document

  const file = document.isUntitled ? 'Untitled Document' : document.fileName
  const dir = file.replace(/\/[^\/]+$/, '')
  const fileName = file.split('/').pop()
  if (!fileName)
    return

  const fileMetas = await Promise.resolve(vscode.workspace.fs.readDirectory(vscode.Uri.file(dir))).catch(() => [])
  let mapFileName = fileMetas.find(([name]) => name === `${fileName}.map`)?.[0]
  mapFileName ??= fileMetas.find(([name]) => name.startsWith(fileName?.split('.')[0]) && name.endsWith('.map'))?.[0]

  const selectedCode = document.getText(editor.selection)
  const getFullCode = async () => Promise.resolve(vscode.workspace.fs.readFile(vscode.Uri.file(file)).then(buffer => new TextDecoder('utf-8').decode(buffer))).catch(() => document.getText())
  const code = selectedCode || await getFullCode()
  if (!mapFileName) {
    const lastLine = (selectedCode ? await getFullCode() : code).split('\n').pop() ?? ''
    if (!lastLine.startsWith('//# sourceMappingURL=')) {
      vscode.window.setStatusBarMessage('Source map not found!', 5000)
      return
    }
    const map = new TextDecoder('utf-8').decode(Buffer.from(lastLine.split(',').pop() ?? '', 'base64'))
    if (!map) {
      vscode.window.setStatusBarMessage('Source map not found!', 5000)
      return
    }
    return { code, map }
  }

  const mapFile = `${dir}/${mapFileName}`

  const map = await vscode.workspace.fs.readFile(vscode.Uri.file(mapFile)).then(buffer => new TextDecoder('utf-8').decode(buffer))

  return { code, map }
}

function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
  // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
  const mainScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'res', 'main.js'))
  const codeScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'res', 'code.js'))

  // Do the same for the stylesheet.
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'res', 'style.css'))

  // Use a nonce to only allow a specific script to be run.
  const nonce = getNonce()

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${styleUri}" rel="stylesheet">
    </head>
    <body>
      <div id="toolbar">
        <section>
          <h2>Original code</h2>
          <div id="fileListParent"><select id="fileList"></select></div>
        </section>
        <section>
          <h2>Generated code</h2>
        </section>
      </div>
      <div id="statusBar">
        <section>
          <div id="originalStatus"></div>
        </section>
        <section>
          <div id="generatedStatus"></div>
        </section>
      </div>
      <script nonce="${nonce}" src="${mainScriptUri}"></script>
      <script nonce="${nonce}" src="${codeScriptUri}"></script>
    </body>
    </html>`
}

function getNonce() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}
