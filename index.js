const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.static('dist'))

app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = phonebook.find((person) => person.id === Number(id));
  if (!person) {
    response.status(404).send("Person not found");
    return;
  }
  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  const id = getRandomInt(1000);
  const newPerson = {
    id: id,
    name: person.name,
    number: person.number,
  };

  if ("name" in person === false) {
    response.status(400).json({ error: "name is required" });
    return;
  }

  if ("number" in person === false) {
    response.status(400).json({ error: "number is required" });
    return;
  }

  const isPerson = phonebook.find(
    (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
  );

  if (isPerson !== undefined) {
    response.status(400).json({ error: "the person's name already exists" });
    return;
  }
  response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = phonebook.find((person) => person.id === Number(id));
  if (!person) {
    response.status(404).send("Person not found");
    return;
  }
  response.status(204).json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
