const { app, BrowserWindow } = require('electron')

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
function createWindow() {
  // Tarayıcı penceresini oluştur.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('.\\wwwroot\\js\\jquery\\jquery-3.5.0.min.js')
  // and load the index.html of the app.
  win.loadFile('.\\wwwroot\\index.html')

  // DevTools'u aç.
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Bazı API'ler sadece bu olayın gerçekleşmesinin ardından kullanılabilir.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // MacOS'de kullanıcı CMD + Q ile çıkana dek uygulamaların ve menü barlarının
  // aktif kalmaya devam etmesi normaldir.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // MacOS'de dock'a tıklandıktan sonra eğer başka pencere yoksa
  // yeni pencere açılması normaldir.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. Ayrıca bunları ayrı dosyalara koyabilir ve buradan isteyebilirsiniz.