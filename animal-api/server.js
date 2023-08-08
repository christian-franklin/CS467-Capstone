const express = require("express");
const { Datastore } = require("@google-cloud/datastore");
const bodyParser = require("body-parser");
const request = require("request");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");

require("dotenv").config();
const datastore = new Datastore({
  projectId: process.env.projectId,
});

const ANIMAL = "Animal";
const USER = "User";

const app = express();
const cors = require("cors");
const { post } = require("request");
app.use(
  cors({
    origin: "*",
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

app.use(express.json());

app.use(auth(config));
app.use("/", router);
app.use("/login", login);

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.headers.authorization;
  next();
});

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

const findJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  issuer: `https://${DOMAIN}/`,
  algorithms: ["RS256"],
  credentialsRequired: false,
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

/*
 ----- Model Functions -----
*/

// CREATE animal
function post_animal(
  name,
  animal,
  breed,
  age,
  description,
  image,
  disposition,
  date_created,
  availability,
  shelter_name,
  shelter_email
) {
  var key = datastore.key(ANIMAL);
  const new_animal = {
    name: name,
    animal: animal,
    breed: breed,
    age: age,
    description: description,
    image: image,
    disposition: disposition,
    date_created: date_created,
    availability: availability,
    shelter_name: shelter_name,
    shelter_email: shelter_email,
  };
  return datastore.save({ key: key, data: new_animal }).then(() => {
    console.log(new_animal);
    return {
      id: key.id,
      name: new_animal.name,
      animal: new_animal.animal,
      breed: new_animal.breed,
      age: new_animal.age,
      description: new_animal.description,
      image: new_animal.image,
      disposition: new_animal.disposition,
      date_created: new_animal.date_created,
      availability: new_animal.availability,
      shelter_name: new_animal.shelter_name,
      shelter_email: new_animal.shelter_name,
    };
  });
}

// READ animal(s)
function get_animals() {
  const query = datastore.createQuery(ANIMAL);
  return datastore.runQuery(query).then((entities) => {
    return entities[0].map(fromDatastore);
  });
}

function get_animal(animal_id) {
  const key = datastore.key([ANIMAL, parseInt(animal_id, 10)]);
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

// UPDATE animal
function patch_animal(
  animal_id,
  name,
  animal,
  breed,
  age,
  description,
  image,
  disposition,
  date_created,
  availability,
  shelter_name,
  shelter_email
) {
  const key = datastore.key([ANIMAL, parseInt(animal_id, 10)]);
  const updated_animal = {
    name: name,
    animal: animal,
    breed: breed,
    age: age,
    description: description,
    image: image,
    disposition: disposition,
    date_created: date_created,
    availability: availability,
    shelter_name: shelter_name,
    shelter_email: shelter_email,
  };
  return datastore.save({ key: key, data: updated_animal }).then(() => {
    return {
      id: key.id,
      name: updated_animal.name,
      animal: updated_animal.animal,
      breed: updated_animal.breed,
      age: updated_animal.age,
      description: updated_animal.description,
      image: updated_animal.image,
      disposition: updated_animal.disposition,
      date_created: updated_animal.date_created,
      availability: updated_animal.availability,
      shelter_name: updated_animal.shelter_name,
      shelter_email: updated_animal.shelter_email,
    };
  });
}

// DELETE animal
function delete_animal(animal_id) {
  const key = datastore.key([ANIMAL, parseInt(animal_id, 10)]);
  return datastore.delete(key);
}

/* ------------- Begin Users Model Functions ------ */

function get_users() {
  const q = datastore.createQuery(USER);
  return datastore.runQuery(q).then((entities) => {
    // Use Array.map to call the function fromDatastore. This function
    // adds id attribute to every element in the array at element 0 of
    // the variable entities
    return entities[0].map(fromDatastore);
  });
}

async function user_add_animal(animal_id, user_sub) {
  let user = await get_user_id(user_sub);

  if (!user) {
    throw new Error("User not found");
  }

  const user_id = user[datastore.KEY].id;
  const user_key = datastore.key([USER, parseInt(user_id, 10)]);

  console.log("Updating user", user_key);

  // Check if the animal_id already exists in the user's animals array
  if (user.animals && user.animals.includes(animal_id)) {
    console.log("Animal ID already exists for this user.");
    return null; // Or throw an error, or handle the case as needed
  }

  const user_update = {
    Admin: user.Admin,
    email: user.email,
    name: user.name,
    sub: user.sub,
    animals:
      user.animals === undefined ? [animal_id] : [...user.animals, animal_id],
  };

  // Update only the 'animals' property of the user entity
  const saveResult = await datastore.update({
    key: user_key,
    data: user_update,
  });

  const results = {
    id: user_id,
    admin: user_update.Admin,
    email: user_update.email,
    name: user_update.name,
    sub: user_update.sub,
    animals: user_update.animals,
  };
  console.log(results);
  return results;
}

async function get_user_id(sub) {
  console.log("Finding user");
  const query = datastore.createQuery(USER).filter("sub", "=", sub);
  const [entities] = await datastore.runQuery(query);

  if (!entities || entities.length === 0) {
    // If no user is found, return null
    return null;
  }

  const userEntity = entities[0];
  return userEntity;
}

async function user_remove_animal(animal_id, user_sub) {
  let user = await get_user_id(user_sub);

  if (!user) {
    throw new Error("User not found");
  }

  const user_id = user[datastore.KEY].id;
  const user_key = datastore.key([USER, parseInt(user_id, 10)]);

  console.log("Updating user", user_key);

  // Check if the animal_id exists in the user's animals array
  if (!user.animals || !user.animals.includes(animal_id)) {
    throw new Error("Animal ID not found for this user.");
  }

  // Remove the animal_id from the animals array
  const updatedAnimals = user.animals.filter((id) => id !== animal_id);

  const user_update = {
    Admin: user.Admin,
    email: user.email,
    name: user.name,
    sub: user.sub,
    animals: updatedAnimals,
  };

  const saveResult = await datastore.update({
    key: user_key,
    data: user_update,
  });

  const results = {
    id: user_id,
    admin: user_update.Admin,
    email: user_update.email,
    name: user_update.name,
    sub: user_update.sub,
    animals: user_update.animals,
  };

  console.log(results);
  return results;
}

/* ------------- End Users Model Functions ------------- */ 0;

/*
 ----- Controller Functions -----
*/
// GET user
router.get("/users", cors(), findJwt, async (req, res) => {
  let userSub = null;

  if (req.user) {
    const { sub, email, name } = req.user;
    userSub = sub; // Extract the user's sub from the oidc user object

    const users = await get_users();
    const result = { results: users };
    res.status(200).json(result);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// GET user by sub
router.get("/users/:sub", cors(), findJwt, async (req, res) => {
  let userSub = null;

  if (req.user) {
    const { sub, email, name } = req.user;
    userSub = sub; // Extract the user's sub from the oidc user object

    const users = await get_user_id(userSub);
    const result = { results: users };
    res.status(200).json(result);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// PATCH user - add animal to user
router.patch(
  "/users/:sub/animals/:animal_id",
  cors(),
  checkJwt,
  async function (req, res) {
    let userSub = null;
    console.log("Update request");

    if (req.user === undefined) {
      req.user = req.params.sub;
    }

    if (req.user) {
      const { sub, email, name } = req.user;
      userSub = sub; // Extract the user's sub from the oidc user object

      try {
        const updateSuccess = await user_add_animal(
          req.params.animal_id,
          userSub
        );

        if (updateSuccess) {
          res.status(200).json({
            message: "Animal added successfully.",
            results: updateSuccess,
          });
        } else {
          res.status(500).json({ error: "Failed to update user's animals." });
        }
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "An error occurred while updating." });
      }
    } else {
      res.status(400).json({ error: "Invalid user." });
    }
  }
);

// DELETE user - remove animal from user
router.delete(
  "/users/:sub/animals/:animal_id",
  cors(),
  checkJwt,
  async function (req, res) {
    let userSub = null;
    console.log("Update request");

    if (req.user === undefined) {
      req.user = req.params.sub;
    }

    if (req.user) {
      const { sub, email, name } = req.user;
      userSub = sub; // Extract the user's sub from the oidc user object

      try {
        const updateSuccess = await user_remove_animal(
          req.params.animal_id,
          userSub
        );

        if (updateSuccess) {
          res.status(200).json({
            message: "Animal removed successfully.",
            results: updateSuccess,
          });
        } else {
          res.status(500).json({ error: "Failed to update user's animals." });
        }
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "An error occurred while updating." });
      }
    } else {
      res.status(400).json({ error: "Invalid user." });
    }
  }
);

// POST animal
router.post("/animals", function (req, res) {
  if (
    (req.body.name === undefined || req.body.name === null,
    req.body.animal === undefined || req.body.animal === null,
    req.body.breed === undefined || req.body.breed === null,
    req.body.age === undefined || req.body.age === null,
    req.body.description === undefined || req.body.description === null,
    req.body.image === undefined || req.body.image === null,
    req.body.disposition === undefined || req.body.disposition === null,
    req.body.date_created === undefined || req.body.date_created === null,
    req.body.availability === undefined || req.body.availability === null,
    req.body.shelter_name === undefined || req.body.shelter_name === null,
    req.body.shelter_email === undefined || req.body.shelter_email === null)
  ) {
    res.status(400).json({
      Error:
        "The request object is missing at least one of the required attributes",
    });
  } else {
    post_animal(
      req.body.name,
      req.body.animal,
      req.body.breed,
      req.body.age,
      req.body.description,
      req.body.image,
      req.body.disposition,
      req.body.date_created,
      req.body.availability,
      req.body.shelter_name,
      req.body.shelter_email
    ).then((animal) => {
      res.status(201).json(animal);
    });
  }
});

// GET animal
router.get("/animals", cors(), findJwt, async (req, res) => {
  let userSub = null;

  if (req.user) {
    const { sub, email, name } = req.user;
    userSub = sub; // Extract the user's sub from the oidc user object

    try {
      // Use a transaction to check if the user already exists (prevents race conditions)
      const transaction = datastore.transaction();
      await transaction.run();

      const query = datastore.createQuery(USER).filter("sub", "=", userSub);
      const [existingUsers] = await transaction.runQuery(query);

      if (existingUsers.length > 0) {
        console.log("User already exists:", existingUsers[0]);
      } else {
        const key = datastore.key(USER);
        const user = {
          sub: userSub,
          name: name,
          email: email,
        };
        await transaction.save({ key: key, data: user });
        console.log("New user saved:", user);
      }

      await transaction.commit();

      const animals = await get_animals();
      const result = { results: animals };
      res.status(200).json(result);
    } catch (error) {
      console.error("Transaction failed:", error);
      res.status(500).json({ error: "Transaction failed" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.get("/animals/:animal_id", cors(), (req, res) => {
  get_animal(req.params.animal_id).then((animal) => {
    if (animal[0] === undefined || animal[0] === null) {
      // The 0th element is undefined. This means there is no animal with this id
      res.status(404).json({ Error: "No animal with this animal id exists" });
    } else {
      // Return the 0th element which is the animal with this id
      res.status(200).json(animal[0]);
    }
  });
});

// PATCH animal
router.patch("/animals/:animal_id", function (req, res) {
  if (
    (req.body.name === undefined || req.body.name === null,
    req.body.animal === undefined || req.body.animal === null,
    req.body.breed === undefined || req.body.breed === null,
    req.body.age === undefined || req.body.age === null,
    req.body.description === undefined || req.body.description === null,
    req.body.image === undefined || req.body.image === null,
    req.body.disposition === undefined || req.body.disposition === null,
    req.body.date_created === undefined || req.body.date_created === null,
    req.body.availability === undefined || req.body.availability === null,
    req.body.shelter_name === undefined || req.body.shelter_name === null,
    req.body.shelter_email === undefined || req.body.shelter_email == null)
  )
    res.status(400).json({
      Error:
        "The request object is missing at least one of the required attributes",
    });
  else {
    get_animal(req.params.animal_id).then((animal) => {
      console.log(animal);
      if (animal[0] === undefined || animal[0] === null) {
        res.status(404).json({ Error: "No animal with this animal_id exists" });
      } else {
        patch_animal(
          req.params.animal_id,
          req.body.name,
          req.body.animal,
          req.body.breed,
          req.body.age,
          req.body.description,
          req.body.image,
          req.body.disposition,
          req.body.date_created,
          req.body.availability,
          req.body.shelter_name,
          req.body.shelter_email
        ).then((key) => {
          console.log(key);
          res.status(200).json(key);
        });
      }
    });
  }
});

// DELETE animal
router.delete("/animals/:animal_id", function (req, res) {
  get_animal(req.params.animal_id).then((animal) => {
    if (animal[0] === undefined || animal[0] === null) {
      res.status(404).json({ Error: "No animal with this animal_id exists" });
    } else {
      delete_animal(req.params.animal_id).then(res.status(204).end());
    }
  });
});

app.get("/", async (req, res) => {
  console.log("Application entrance");
  res.json("success");
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
