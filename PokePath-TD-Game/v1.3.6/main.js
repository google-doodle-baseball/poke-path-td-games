const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')

// Mitigaciones para crashes nativos de Chromium en Macs Intel
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('enable-logging')
app.commandLine.appendSwitch('v', '1')

let win = null

function createWindow () {
  if (win) return

  const baseWidth = 1238
  const baseHeight = 674

  win = new BrowserWindow({
    width: baseWidth,
    height: baseHeight,
    minWidth: baseWidth,
    minHeight: baseHeight,
    resizable: true,
    center: true,
    show: false,
    title: 'PokePath TD',
    icon: path.join(__dirname, 'assets', 'icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),   
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      sandbox: false,
      webSecurity: false
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))  

  win.once('ready-to-show', () => {
    if (win && !win.isDestroyed()) {
      win.show()
    }
  })

  win.setMenu(null)
  win.setContentSize(baseWidth, baseHeight)

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  win.on('closed', () => {
    win = null
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (win && !win.isDestroyed()) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(createWindow)
}


ipcMain.handle('toggle-fullscreen', () => {
  if (!win || win.isDestroyed()) return
  try {
    win.setFullScreen(!win.isFullScreen())
  } catch (err) {
    console.error('Failed to toggle fullscreen:', err)
  }
})

ipcMain.on('close-app', () => {
  app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})