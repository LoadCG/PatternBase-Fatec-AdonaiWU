# PatternBase-Fatec-AdonaiWU

CRUD educacional para criação e organização de estampas, desenvolvido na disciplina de Programação Web da FATEC SJC.

## O que o projeto faz

- Cadastra, lista, edita e exclui estampas.
- Registra técnica, coleção, cores, tags e status.
- Permite upload local de uma imagem por estampa.
- Usa o padrão vertical 1080×1440 px (proporção 3:4) para as artes.
- Exibe feedback de carregamento, sucesso e erro.
- Usa MongoDB persistido em volume Docker.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Motion, GSAP |
| Backend | Node.js, Express, Mongoose, Multer |
| Banco | MongoDB 7 |
| Ambiente | Docker Compose e Portainer local |

## Executar localmente

Pré-requisitos: Node.js 20+, npm e Docker.

```bash
docker compose up -d mongodb
cd backend
npm install
npm run dev
```

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. Se o banco estiver vazio, a API cria automaticamente a estampa inicial “Eu fui Salvo”.

Endpoints: `GET /api/health`, `GET /api/prints`, `POST /api/prints`, `PUT /api/prints/:id` e `DELETE /api/prints/:id`.

## Portainer didático

O Portainer fica fora do repositório:

```bash
docker volume create portainer_data
docker run -d --name portainer --restart=always \
  -p 8000:8000 -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data portainer/portainer-ce:lts
```

Acesse `https://localhost:9443`.

## Imagens

O upload usa armazenamento local com Multer, adequado para estudo. Em produção, use armazenamento de objetos e salve apenas a URL no MongoDB.

## Documentação

- [Plano de desenvolvimento](docs/PLANO.md)
- [Heurísticas de Nielsen aplicadas](docs/HEURISTICAS-NIELSEN.md)
