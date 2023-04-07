// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, ipcMain, nativeTheme } = require('electron')
const path = require('path')
require('update-electron-app')()

function handleSetTitle (event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.handle('ping', () => 'pong')

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // const win = new BrowserWindow({ width: 800, height: 1500 })
  // win.loadURL('https://github.com')

  // const contents = win.webContents
  // console.log(contents)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  // In the main process, we receive the port.
  ipcMain.on('port', (event) => {
    // 当我们在主进程中接收到 MessagePort 对象, 它就成为了
    // MessagePortMain.
    const port = event.ports[0]

    // MessagePortMain 使用了 Node.js 风格的事件 API, 而不是
    // web 风格的事件 API. 因此使用 .on('message', ...) 而不是 .onmessage = ...
    port.on('message', (event) => {
      // 收到的数据是： { answer: 42 }
      const data = event.data
      console.log(data)
    })

    // MessagePortMain 阻塞消息直到 .start() 方法被调用
    port.start()
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.