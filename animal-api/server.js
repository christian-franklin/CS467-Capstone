const express = require("express");
const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore();

const app = express();

const router = express.Router();
const login = express.Router();

app.use(express.json());

app.use("/", router);
app.use("/login", login);

// Custom error handling to send error as JSON instead of HTML
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    const errorMessage = "Missing or invalid token";

    // Sending JSON response with error message
    res.status(401).json({ error: errorMessage });
  }
});


// ****************************************
// CRUD functionality for animal profiles *
// ****************************************
app.get('/api/animals', async (req, res) => {
  const query = datastore.createQuery('Animal');
  const [animals] = await datastore.runQuery(query);
  res.json(animals);
});

app.get('/api/animals/:id', async (req, res) => {
  const animalKey = datastore.key(['Animal', parseInt(req.params.id, 10)]);
  const [animal] = await datastore.get(animalKey);
  if (!animal) return res.status(404).send('The animal with the given ID was not found.');
  res.json(animal);
});

app.post('/api/animals', async (req, res) => {
  const { key, ...animalData } = req.body;
  const animalKey = datastore.key(['Animal']);
  const entity = {
    key: animalKey,
    data: animalData,
  };
  await datastore.save(entity);
  res.json({ id: animalKey.id, ...animalData });
});

app.put('/api/animals/:id', async (req, res) => {
  const animalKey = datastore.key(['Animal', parseInt(req.params.id, 10)]);
  const [animal] = await datastore.get(animalKey);
  if (!animal) return res.status(404).send('The animal with the given ID was not found.');

  const { key, ...updatedData } = req.body;
  const entity = {
    key: animalKey,
    data: { ...animal, ...updatedData },
  };
  await datastore.update(entity);
  res.json({ id: animalKey.id, ...animal, ...updatedData });
});

app.delete('/api/animals/:id', async (req, res) => {
  const animalKey = datastore.key(['Animal', parseInt(req.params.id, 10)]);
  await datastore.delete(animalKey);
  res.status(204).send();
});
// ********************************************
// END CRUD functionality for animal profiles *
// ********************************************


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
