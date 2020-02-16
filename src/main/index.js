'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { download } from 'electron-dl'
import fs from 'fs'
import { downloadLink } from '@/api/titlovi'
import { subtitlesDownloadDir } from '@/config'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('download-subtitle', async (e, { id }) => {
  await downloadSubtitle(id)
})

async function downloadSubtitle (id) {
  let options = {
    directory: subtitlesDownloadDir,
    onStarted: item => handlesSubtitleExists(item)
  }

  try {
    const dl = await download(BrowserWindow.getFocusedWindow(), downloadLink + id, options)

    mainWindow.webContents.send('subtitle-downloaded', {path: dl.getSavePath()})
  } catch (err) {
    mainWindow.webContents.send('download-subtitle-error', err)
  }
}

function handlesSubtitleExists (item) {
  fs.readdir(subtitlesDownloadDir, (err, files) => {
    if (!err && files.includes(item.getFilename())) {
      item.cancel()

      mainWindow.webContents.send(
        'subtitle-downloaded',
        { path: `${subtitlesDownloadDir}/${item.getFilename()}` }
      )
    }
  })
}
