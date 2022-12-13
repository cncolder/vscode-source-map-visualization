(() => {
  const toolbar = document.getElementById('toolbar')
  const fileListParent = document.getElementById('fileListParent')

  fileListParent.style.maxWidth = 'initial'

  const gotoInput = document.createElement('input')
  gotoInput.placeholder = ':line:col'
  gotoInput.addEventListener('input', (e) => {
    const v = e.target.value
    const [line = 0, col = 0] = v
      .split(':')
      .map(x => parseInt(x, 10))
      .filter(x => Number.isSafeInteger(x))
    if (line > 0 && col > 0)
      window.generatedTextArea.scrollTo(col, line - 1)
  })
  gotoInput.addEventListener('paste', (e) => {
    e.stopPropagation()
  })
  toolbar.lastElementChild.appendChild(gotoInput)

  const blackhole = document.createElement('div')
  blackhole.style.display = 'none'

  const ids = ['dragTarget', 'uploadFiles', 'loadExample', 'promptText', 'errorText', 'theme']
  ids.forEach((id) => {
    const el = document.createElement('div')
    el.id = id
    blackhole.appendChild(el)
  })

  document.body.appendChild(blackhole)

  window.addEventListener('message', (event) => {
    const message = event.data

    switch (message.command) {
      case 'update':
        window.finishLoading(message.data.code, message.data.map)
        break
    }
  })
})()
