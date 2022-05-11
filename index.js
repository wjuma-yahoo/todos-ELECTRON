const electron = require("electron");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let newWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const createNewWindow = () => {
  newWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add new todo",
  });
};

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New todo",
        click() {
          createNewWindow();
        },
      },
      {
        label: "Quit",
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
