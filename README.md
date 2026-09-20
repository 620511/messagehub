# MessageHub

Hub de mensagens e notificações em tempo real, multi-SaaS (PetDelivery-CE, Farma.APP, Prime Lanches e futuros projetos).

## Estrutura
- `backend/` — Node.js + Express + Prisma + Socket.IO + PostgreSQL (Supabase)
- `frontend/` — React + Vite (painel da loja)

## Como rodar o backend
1. `cd backend`
2. `npm install`
3. Copie `.env.example` para `.env` e preencha com seus dados (Supabase, ADMIN_SECRET, JWT_SECRET)
4. Gere as chaves push: `npx web-push generate-vapid-keys` e cole em `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` no `.env`
5. `npx prisma migrate dev --name init`
6. `npm run dev`

## Como rodar o frontend
1. `cd frontend`
2. `npm install`
3. Copie `.env.example` para `.env`, ajuste `VITE_MESSAGEHUB_URL` e cole a mesma `VAPID_PUBLIC_KEY` em `VITE_VAPID_PUBLIC_KEY`
4. `npm run dev`

## Fluxo principal
1. Cadastre uma plataforma: `POST /apps` (com `x-admin-secret`) → recebe `api_key`
2. Cadastre a loja com login: `POST /stores` (com `x-api-key` da plataforma) → email/senha
3. A plataforma dispara pedidos: `POST /messages/order-notification` (com `x-api-key`)
4. A loja loga no painel (`frontend`) e recebe os pedidos em tempo real via Socket.IO
5. A loja aceita/recusa: `POST /store/orders/:messageId/status`
6. A loja recebe push mesmo com o painel fechado (PWA + Web Push, via `/store/push-subscribe`)

## Deploy
- Backend: Render/Railway (build: `npm install && npx prisma generate`, start: `npm start`, rodar `npx prisma migrate deploy` uma vez)
- Frontend: Vercel (variável `VITE_MESSAGEHUB_URL` apontando pro backend em produção)
