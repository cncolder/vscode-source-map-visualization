import * as vscode from 'vscode'
import { getNonce } from './getNonce'

export function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
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
