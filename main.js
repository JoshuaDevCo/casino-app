// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const headerHeight = 60
const tableWidth = 630
const tableHeight = 300

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  hardResetMethod: 'exit'
});

function createWindow () {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 630*1.8,
    height: 360*1.8,
    minWidth: 630*0.6,
    minHeight: 360*0.6,
    frame: false,
    transparent: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
      //preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  ipcMain.on("minimise", () => {
    mainWindow.minimize()
  })
  
  ipcMain.on("maximise", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
      mainWindow.webContents.send("maximiseBtn")
    }
    else {
      mainWindow.maximize()
      mainWindow.webContents.send("unmaximiseBtn")
    }
  })
  
  ipcMain.on("close", () => {
    mainWindow.close()
  })

  mainWindow.on("resize", () => {
    let aspectRatio = tableWidth / (tableHeight+headerHeight)
    if(mainWindow.getBounds().width>576) {
      mainWindow.setAspectRatio(aspectRatio)
    } else {
      mainWindow.setAspectRatio(1/aspectRatio)
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


