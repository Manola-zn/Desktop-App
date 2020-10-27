const { app, BrowserWindow } = require('electron');
const os = require('os-utils');
const path = require('path');

//Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) { //Eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  //Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: __dirname + '/cpu.jpg',
    webPreferences:{
      nodeIntegration: true
    }
  });

  //And load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  //Open the DevTools.
  //MainWindow.webContents.openDevTools();

  //Retrieve CPU usage every one second
  setInterval(() => {
    os.cpuUsage(function(v){
        
        mainWindow.webContents.send('cpu',v*100);
        mainWindow.webContents.send('mem',os.freememPercentage()*100);
        mainWindow.webContents.send('total-mem', os.totalmem()/1024);

      });
  },1000);
 
};

//This method will be called when Electron has finished
//Initialization and is ready to create browser windows.
//Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

//Quit when all windows are closed, except on macOS. There, it's common
//For applications and their menu bar to stay active until the user quits
//Explicitly with Cmd + Q
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  //On OS X it's common to re-create a window in the app when the
  //Dock icon is clicked and there are no other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

