# PatternBase-Fatec-AdonaiWU

CRUD educacional para gerenciamento de estampas, desenvolvido na disciplina de Programação Web da FATEC SJC.

## Stack

- Node.js, Express e Mongoose
- MongoDB em Docker
- React + Vite
- Tailwind CSS, Motion e GSAP
- Upload local de imagens para fins didáticos

## Estrutura

```text
backend/     API REST e modelo MongoDB
frontend/    Interface React
docs/        Planejamento do projeto
docker-compose.yml
```

## Como executar

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

API: `http://localhost:3333`  
Frontend: `http://localhost:5173`

## Portainer local

O Portainer não faz parte do repositório. Para fins didáticos, pode ser executado localmente:

```bash
docker volume create portainer_data
docker run -d --name portainer --restart=always \
  -p 8000:8000 -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data portainer/portainer-ce:lts
```

Acesse `https://localhost:9443`.

## Observação sobre imagens

O upload atual usa armazenamento local com Multer, adequado para estudo. Em produção, seria melhor utilizar armazenamento de objetos, como S3 ou Cloudinary, e salvar somente a URL no MongoDB.

