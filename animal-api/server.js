const express = require("express");
const { Datastore } = require("@google-cloud/datastore");
const bodyParser = require("body-parser");
const request = require("request");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");

const datastore = new Datastore({
  projectId: process.env.projectId,
});

const ANIMAL = "Animal";

const app = express();
const cors = require('cors');
app.use(
  cors({
    origin: '*',
  })
);

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

/**
 * Models
 */

function get_animals() {
  const query = datastore.createQuery(ANIMAL);
  return datastore.runQuery(query).then((entities) => {
    return entities[0].map(fromDatastore);
  });
}

function get_animal(id) {
  const key = datastore.key([ANIMAL, parseInt(id, 10)]);
  return datastore.get(key).then((entity) => {
    if (entity[0] === undefined || entity[0] === null) {
      // No entity found. Don't try to add the id attribute
      return entity;
    } else {
      // Use Array.map to call the function fromDatastore. This function
      // adds id attribute to every element in the array entity
      return entity.map(fromDatastore);
    }
  });
}

/**
 * Controllers
 */

app.get("/", async (req, res) => {
  console.log("Application entrance");
  res.json("success");
});

router.get("/animals", cors(), (req, res) => {
  const animals = get_animals().then((animals) => {
    result = { "results" : animals };

    res.status(200).json(result);
  });
});

router.get("/animals/:id", cors(), (req, res) => {
  get_animal(req.params.id).then((animal) => {
    if (animal[0] === undefined || animal[0] === null) {
      // The 0th element is undefined. This means there is no animal with this id
      res.status(404).json({ Error: "No boat with this animal id exists" });
    } else {
      // Return the 0th element which is the animal with this id
      res.status(200).json(animal[0]);
    }
  });
});

app.post("/animals", async (req, res) => {
  const { key, ...animalData } = req.body;
  const animalKey = datastore.key(["Animal"]);
  const entity = {
    key: animalKey,
    data: animalData,
  };
  await datastore.save(entity);
  res.json({ id: animalKey.id, ...animalData });
});

app.put("/animals/:id", async (req, res) => {
  const animalKey = datastore.key(["Animal", parseInt(req.params.id, 10)]);
  const [animal] = await datastore.get(animalKey);
  if (!animal)
    return res.status(404).send("The animal with the given ID was not found.");

  const { key, ...updatedData } = req.body;
  const entity = {
    key: animalKey,
    data: { ...animal, ...updatedData },
  };
  await datastore.update(entity);
  res.json({ id: animalKey.id, ...animal, ...updatedData });
});

app.delete("/animals/:id", async (req, res) => {
  const animalKey = datastore.key(["Animal", parseInt(req.params.id, 10)]);
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
