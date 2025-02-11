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

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  PhoneBook.find({ _id: id })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      response.status(404).send("Person not found");
    });
});

app.post("/api/persons", (request, response) => {
  const requestPerson = request.body;
  const newPerson = {
    name: requestPerson.name,
    number: requestPerson.number,
  };

  if ("name" in requestPerson === false) {
    response.status(400).json({ error: "name is required" });
    return;
  }

  if ("number" in requestPerson === false) {
    response.status(400).json({ error: "number is required" });
    return;
  }

  const person = new PhoneBook({ ...newPerson });
  person.save().then((result) => {
    response.json(result);
  });

  /*
  const isPerson = phonebook.find(
    (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
  );

  if (isPerson !== undefined) {
    response.status(400).json({ error: "the person's name already exists" });
    return;
  }

  */
  //response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  PhoneBook.find({ _id: id })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      response.status(404).send("Person not found");
    });
  response.status(204).json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
