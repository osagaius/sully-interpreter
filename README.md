## Setup

1. Copy the `.env.template` file to `.env`.
2. Ensure you have postgres installed and create a database called `sully-onsite` matching you `.env`.
3. Once started, the database can be initialized with `yarn db:create` and `yarn db:migrate backend/db/migrations/init_db.sql`
4. You will need to install the FE modules under `/frontend` with `npm install`.
5. The root level modules can be installed with `npm install`
6. Start both FE and BE `npm run dev`
7. If needed, you can drop the db with `npm run db:drop`