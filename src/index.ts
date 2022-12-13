import * as vscode from 'vscode'
import { getCodeAndMap } from './getCodeAndMap'
import { getHtmlForWebview } from './getHtmlForWebview'

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
  const data = await getCodeAndMap().catch((err) => {
    console.warn('Get code and map error:', err)
    return undefined
  })
  if (!data)
    return
  panel.webview.postMessage({
    command: 'update',
    data,
  })
}
