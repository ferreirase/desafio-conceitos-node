const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// listar todos os repos
app.get('/repositories', (request, response) =>
  response.status(200).send(repositories)
);

//criar novo repo
app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = { id: uuid(), title, techs, url, likes: 0 };

  repositories.push(newRepo);

  return response.status(201).json(newRepo);
});

//atualizar repos
app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repoExists = repositories.findIndex((repo) => repo.id === id);

  if (repoExists < 0) {
    return response.status(400).json();
  }

  repositories[repoExists].title = title;
  repositories[repoExists].url = url;
  repositories[repoExists].techs = techs;

  return response.status(200).json(repositories[repoExists]);
});

//deletar um repositório
app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoExists = repositories.findIndex((repo) => repo.id === id);

  if (repoExists < 0) {
    return response.status(400).json();
  }

  repositories.splice(repoExists, 1);

  return response.status(204).json();
});

//adicionar like nos repos
app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoExists = repositories.findIndex((repo) => repo.id === id);

  if (repoExists < 0) {
    return response.status(400).json();
  }

  repositories[repoExists].likes = repositories[repoExists].likes + 1;

  return response.status(200).json({ likes: repositories[repoExists].likes });
});

module.exports = app;
