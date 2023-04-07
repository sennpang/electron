const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async () => {
  const response = await versions.ping()
  console.log(response) // 打印 'pong'
}
console.log(myAPI)

func()

const setButton = document.getElementById('setTitleBtn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})

const openFileBtn = document.getElementById('openFileBtn')
const filePathElement = document.getElementById('filePath')

openFileBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  console.log(filePath)
  filePathElement.innerText = filePath
})

const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue
})

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})