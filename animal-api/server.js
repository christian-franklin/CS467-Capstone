const express = require("express");
const { Datastore } = require('@google-cloud/datastore');
const bodyParser = require("body-parser");
const request = require("request");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");

const datastore = new Datastore({
  projectId: process.env.projectId,
});

const ANIMAL = "Animal"

const app = express();

const router = express.Router();
const login = express.Router();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.secret,
  baseURL: process.env.baseURL,
  clientID: process.env.clientID,
  issuerBaseURL: process.env.issuerBaseURL,
};

const CLIENT_ID = config.clientID;
const CLIENT_SECRET = config.secret;
const DOMAIN = process.env.DOMAIN;

require("dotenv").config();
app.use(express.json());

app.use("/", router);
app.use("/login", login);

/* ------------- Helper Functions -------------------------*/
function fromDatastore(item) {
  item.id = item[Datastore.KEY].id;
  return item;
}

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  issuer: `https://${DOMAIN}/`,
  algorithms: ["RS256"],
});

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

app.get('/', async (req, res) => {
  console.log('Application entrance');
  res.json("success");
})

app.get('/animals', async (req, res) => {
  const query = datastore.createQuery('Animal');
  const [animals] = await datastore.runQuery(query);
  res.json(animals);
});

app.get('/animals/:id', async (req, res) => {
  const animalKey = datastore.key(['Animal', parseInt(req.params.id, 10)]);
  const [animal] = await datastore.get(animalKey);
  if (!animal) return res.status(404).send('The animal with the given ID was not found.');
  res.json(animal);
});

app.post('/animals', async (req, res) => {
  const { key, ...animalData } = req.body;
  const animalKey = datastore.key(['Animal']);
  const entity = {
    key: animalKey,
    data: animalData,
  };
  await datastore.save(entity);
  res.json({ id: animalKey.id, ...animalData });
});

app.put('/animals/:id', async (req, res) => {
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

app.delete('/animals/:id', async (req, res) => {
  const animalKey = datastore.key(['Animal', parseInt(req.params.id, 10)]);
  await datastore.delete(animalKey);
  res.status(204).send();
});
// ********************************************
// END CRUD functionality for animal profiles *
// ********************************************

app.use("/", router);
app.use("/login", login);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
