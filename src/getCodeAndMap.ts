import * as vscode from 'vscode'
import { getSourceMapUrl } from './getSourceMapUrl'

export async function getCodeAndMap(): Promise<{ code: string; map: string } | undefined> {
  const editor = vscode.window.activeTextEditor
  if (!editor)
    return

  const document = editor.document

  const code = editor.selection.isEmpty ? document.getText() : editor.selections.map(document.getText).join('\n')
  if (!code)
    return

  const file = document.fileName
  const dir = file.replace(/\/[^\/]+$/, '')
  const readTextFile = async (relativePath: string) => {
    try {
      const uri = vscode.Uri.file(`${dir}/${relativePath}`)
      const buf = await vscode.workspace.fs.readFile(uri)
      return new TextDecoder('utf-8').decode(buf)
    }
    catch (err) {
      console.warn('Error reading file', err)
    }
  }

  const mapUrl = getSourceMapUrl(code)
  if (mapUrl) {
    if (mapUrl.startsWith('data:')) {
      const [type, data] = mapUrl.split(',')
      const map = new TextDecoder('utf-8').decode(Buffer.from(data, type.includes('base64') ? 'base64' : 'utf-8'))
      if (map)
        return { code, map }
    }
    else if (/^https?:/.test(mapUrl)) {
      // TODO: fetch map from url
    }
    else if (mapUrl.startsWith('/')) {
      // TODO: read map from absolute path?
    }
    else if (!document.isUntitled) {
      const map = await readTextFile(mapUrl)
      if (map)
        return { code, map }
    }
  }

  if (document.isUntitled)
    return

  const fileName = file.split('/').pop()
  if (fileName) {
    const filelist = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dir))
    const mapFiles = filelist.map(([name]) => name).filter(f => f.endsWith('.map'))
    const mapFile
      = mapFiles.find(f => f === `${fileName}.map`)
      || mapFiles.find(f => fileName.startsWith(f.split('.')[0]))
    if (mapFile) {
      const map = await readTextFile(mapFile)
      if (map)
        return { code, map }
    }
  }
}
