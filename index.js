const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneBook = require("./models/phonebook");
const app = express();

app.use(cors());

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const currentDate = new Date();

  const formattedDate = currentDate.toString();
  response.send(
    `<p>Phonebook has info for ${phonebook.length} people</p><p>${formattedDate}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  PhoneBook.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  PhoneBook.findById(id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const requestPerson = request.body;
  const newPerson = {
    name: requestPerson.name.trim(),
    number: requestPerson.number.trim(),
  };

  const person = new PhoneBook({ ...newPerson });
  person
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const requestPerson = request.body;

  const newPerson = {
    name: requestPerson.name,
    number: requestPerson.number,
  };

  PhoneBook.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  PhoneBook.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (
    error.name === "ValidationError" ||
    error.number === "ValidationError"
  ) {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
