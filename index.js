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

for (const resource of Object.keys(resources)) {
  console.log(resources[resource]);

  // GetAll endpoints
  app.get(`/${resource}`, async (req, res) => {
    res.json(resources[resource]);
  });

  // GetById endpoints
  app.get(`/${resource}/:id`, async (req, res) => {
    const item = resources[resource].find(
      (item) => item.id === Number(req.params.id)
    );
    if (!item) {
      res.status(404).json({ code: 404, message: "Item not found" });
      return;
    }
    res.json(item);
  });

  app.delete(`/${resource}/:id`, async (req, res) => {
    const item = resources[resource].find(
      (item) => item.id === Number(req.params.id)
    );
    if (!item) {
      res.status(404).json({ code: 404, message: "Item not found" });
      return;
    }
    resources[resource] = resources[resource].filter(
      (item) => item.id !== Number(req.params.id)
    );
    res.json(item);
  });

  app.post(`/${resource}`, async (req, res) => {
    const item = req.body;
    // TODO validar item
    // TODO encontrar el id mas alto y sumarle 1
    item.id = resources[resource].length + 1;
    resources[resource].push(item);
    res.json(item);
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
