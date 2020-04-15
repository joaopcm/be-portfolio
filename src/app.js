const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body
  if (!url || !title || !techs || !techs.length) {
    return response.status(400).json({ error: true, message: "To create a repository, you must provide an URL, title and repository's techs" })
  }

  const newRepository = { id: uuid(), url, title, techs, likes: 0 }
  repositories.push(newRepository)

  return response.json(newRepository)
});

app.put("/repositories/:id", (request, response) => {
  const existingRepository = repositories.find(repository => repository.id === request.params.id)
  if (!existingRepository) {
    return response.status(400).json({ error: true, message: 'Repositoy not found' })
  }

  const { url, title, techs } = request.body
  if (url) existingRepository.url = url
  if (title) existingRepository.title = title
  if (techs && techs.length) existingRepository.techs = techs

  return response.json(existingRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const existingRepository = repositories.find(repository => repository.id === request.params.id)
  if (!existingRepository) {
    return response.status(400).json({ error: true, message: 'Repositoy not found' })
  }

  const indexOf = repositories.indexOf(existingRepository)
  repositories.splice(indexOf, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const existingRepository = repositories.find(repository => repository.id === request.params.id)
  if (!existingRepository) {
    return response.status(400).json({ error: true, message: 'Repositoy not found' })
  }

  existingRepository.likes += 1
  return response.json(existingRepository)
});

module.exports = app;
