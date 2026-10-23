# Samarthya-Stat - AI Skill Intelligence Platform (MoSPI / iGOT Karmayogi)

React + Vite UI with a server (`server.js`: Express + Google Gemini). An AI agent reads an officer's resume,
builds a competency profile, generates personalised quizzes and recommends iGOT courses. Officers' progress is saved,
and the **MoSPI admin portal** tracks every officer's profile, scores, quizzes and courses.

## Run
```bash
npm install
cp .env.example .env     # then edit .env (see below)
npm run build
npm start                # http://localhost:8787
```

## Settings in `.env`
| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Your Gemini key (server-side only) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | MoSPI admin login. Admin portal is disabled until both are set. Password: 8+ chars |
| `SESSION_SECRET` | Long random string (32+ chars) used to sign login sessions |
| `ALLOW_DEMO_LOGIN` | Set `false` in production to hide the one-click demo officers |
| `DATA_FILE` | Where officer data is stored (default `data/db.json`) |

**If a value contains `#` or spaces, wrap it in double quotes** (e.g. `ADMIN_PASSWORD="My#Pass123"`) — otherwise `.env` cuts it off at the `#`.

Generate a session secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Deploy (Render / Railway)
Build: `npm install && npm run build` · Start: `npm start` · Set the env vars above.
GitHub Pages cannot run the server — keep the code on GitHub and host on Render/Railway.

**Important:** officer data is stored in a file. On hosts with a temporary disk (Render free tier) it is erased on each
redeploy/restart. Attach a persistent disk and point `DATA_FILE` at it (e.g. `/var/data/db.json`), or move to a database.

Never commit `.env`.
