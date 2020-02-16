const { app } = require('electron').remote

export const torrentsDownloadDir = `${app.getPath('downloads')}/Media`

export const subtitlesDownloadDir = `${torrentsDownloadDir}/subtitles`
