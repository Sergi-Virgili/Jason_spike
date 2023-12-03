import { promises as fs, readFileSync } from "fs";
import express from "express";
const DIR_FILES = "./jason";
// leer nombre de archivo y lo guarda en una variable
const fileNames = await fs.readdir(DIR_FILES);

// separar el nombre del archivo y lo guarda en una variable
const endpointNames = fileNames.map((fileName) => {
  return fileName.split(".")[0];
});

// crear una instancia de express
const app = express();
app.use(express.json());
// crear un puerto

const port = 5555;

let resources = {};

async function loadResources() {
  for (const endpoint of endpointNames) {
    const rawData = await fs.readFile(`${DIR_FILES}/${endpoint}.json`, "utf-8");
    const data = JSON.parse(rawData);
    resources[endpoint] = data;
  }
  return resources;
}

resources = await loadResources();

//  CREATE ENDPOINTS

for (const endPoint of Object.keys(resources)) {
  console.log(resources[endPoint]);

  // GetAll endpoints
  app.get(`/${endPoint}`, async (req, res) => {
    res.json(resources[endPoint]);
  });

  // GetById endpoints
  app.get(`/${endPoint}/:id`, async (req, res) => {
    const item = resources[endPoint].find(
      (item) => item.id === Number(req.params.id)
    );
    if (!item) {
      res.status(404).json({ code: 404, message: "Item not found" });
      return;
    }
    res.json(item);
  });

  app.delete(`/${endPoint}/:id`, async (req, res) => {
    const item = resources[endPoint].find(
      (item) => item.id === Number(req.params.id)
    );
    if (!item) {
      res.status(404).json({ code: 404, message: "Item not found" });
      return;
    }
    resources[endPoint] = resources[endPoint].filter(
      (item) => item.id !== Number(req.params.id)
    );
    res.json(item);
  });

  app.post(`/${endPoint}`, async (req, res) => {
    const item = req.body;
    // TODO validar item

    // Find max id and add 1 to create a new id
    let newId = 0;
    for (const dataItem of resources[endPoint]) {
      if (Number(dataItem.id) >= newId) newId = Number(dataItem.id + 1);
    }

    item["id"] = newId;
    resources[endPoint].push(item);
    res.json(item);
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
