const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addTodoWindow;

app.on("ready", () => {
  // Main Window Create
  mainWindow = new BrowserWindow({
    width: 350,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  // NOTE: when app closed force other windows to close
  mainWindow.on("closed", () => app.quit());

  // Main Menu Create
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const createNewWindow = () => {
  addTodoWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Agregar una tarea",
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  addTodoWindow.loadURL(`file://${__dirname}/add-todos.html`);

  // NOTE: Ahorrar memoria al cerrar la ventana
  addTodoWindow.on("closed", () => (addTodoWindow = null));
};

ipcMain.on("todo:add", (event, todo) => {
  mainWindow.webContents.send("todo:add", todo);
  addTodoWindow.close();
});

const menuTemplate = [
  {
    label: "Archivo",
    submenu: [
      {
        label: "Nueva tarea",
        click() {
          createNewWindow();
        },
      },
      {
        label: "Salir",
        // accelerator: "Ctrl+Q", // NOTE: Atajo
        accelerator: (() => {
          if (process.platform === "darwin") {
            return "Command+Q";
          } else {
            return "Ctrl+Q";
          }
        })(),
        click() {
          app.quit(); // NOTE: Salir
        },
      },
    ],
  },
];

// En MAC agrega un nuevo elemento al inicio del menu
if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

// Open Dev Tools in Dev Mode
if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload",
        accelerator: "F5",
      },
      {
        label: "More tools",
        submenu: [
          {
            label: "Developer tools",
            accelerator:
              process.platform === "darwin" ? "Command+Alt+I" : "F12",
            click(item, focusedWindow) {
              focusedWindow.toggleDevTools();
            },
          },
        ],
      },
    ],
  });
}
