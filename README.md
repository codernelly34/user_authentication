# User Authentication Server

A Node.js + Express.js authentication API that supports both:

- **Local auth** (email + password)
- **Google OAuth 2.0**

The project is organized so you can extend it with more auth providers and account features over time.

## Table of Contents

- [What this project does](#what-this-project-does)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [How authentication works](#how-authentication-works)
- [Environment variables](#environment-variables)
- [Getting started](#getting-started)
- [API overview](#api-overview)
- [Validation & error handling](#validation--error-handling)
- [Development notes](#development-notes)
- [Roadmap ideas](#roadmap-ideas)

## What this project does

This server provides endpoints for:

- Registering and logging in users with email/password
- Logging in with Google OAuth
- Refreshing short-lived access sessions using a refresh token
- Logging out and clearing auth cookies
- Reading/updating authenticated user profile data
- Checking server info/status

## Tech stack

- **Runtime:** Node.js (ES modules)
- **Web framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + secure HTTP-only cookies
- **Validation:** Joi
- **OAuth:** Passport + Google OAuth 2.0 strategy

## Project structure

```txt
src/
  app.js                         # Express app, middleware registration, route mounting
  server.js                      # Server startup + DB connection

  controllers/
    localAuth/
      registerUser.js            # Local registration logic
      loginUser.js               # Local login logic
    addPassword.js               # Add local password for OAuth-created account
    getUserInfo.js               # Get authenticated user profile
    logoutUser.js                # Logout + clear cookies
    refreshAccess.js             # Refresh access token
    serverStatus.controller.js   # Info/status endpoints
    updateEmail.js               # Update account email
    updatePassword.js            # Update account password
    updateUserInfo.js            # Update first/last name

  middlewares/
    errorHandler.js              # Global error formatter
    verifyAccess.js              # Access-token guard for protected routes
    verifyRequestBody.js         # Request body validation with Joi

  models/
    user.model.js                # User schema

  routes/
    accountRoutes.js             # /account/logout, /account/refresh-access
    googleOauthRoutes.js         # Google OAuth start + callback
    localAuth.routes.js          # /account/local/login + /register
    privetRoutes.js              # Protected /user routes
    serverStatus.routes.js       # /, /info, /status

  utils/
    AppError.js                  # Custom application error class
    connectDB.js                 # MongoDB connection helper
    issueAuthToken.js            # Token creation + cookie writing
    utilsFun.js                  # Small utility helpers
```

## How authentication works

### 1) Local login/register

1. User registers or logs in through `/account/local/...`
2. Server validates request body (Joi middleware)
3. On successful login, server issues:
   - `accessToken` (short-lived)
   - `refreshToken` (longer-lived)
4. Both tokens are sent as **HTTP-only cookies** and refresh token is stored on the user document.

### 2) Protected routes

Routes under `/user/*` require `accessToken` cookie.

- `verifyAccess` middleware verifies JWT
- On success, user ID is attached to `req.user`

### 3) Refresh flow

When access token expires, client calls `GET /account/refresh-access`.

- If refresh token is valid and matches DB token, new cookies are issued.
- If invalid/reused, session is denied and user should log in again.

### 4) Logout flow

`GET /account/logout` clears access/refresh cookies and clears stored refresh token if present.

## Environment variables

Create `.env` from `.env.sample` and provide values:

```env
PORT=3031
NODE_ENV=development
mongodbURI=<your_mongodb_connection_string>
accessTokenKey=<your_jwt_access_secret>
refreshTokenKey=<your_jwt_refresh_secret>

# Required for Google OAuth routes
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
GOOGLE_REDIRECT_URI=<redirect_uri_configured_in_google_console>
```

> Notes
>
> - Use strong random secrets for token keys.
> - OAuth callback URI must exactly match what you configured in Google Cloud.

## Getting started

1. **Clone project**

   ```bash
   git clone https://github.com/codernelly34/user_authentication.git
   cd user_authentication
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.sample .env
   # then edit .env
   ```

4. **Run server**

   ```bash
   npm run dev
   # or
   npm run start
   ```

## API overview

### Health/info

| Method | Endpoint  | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/`       | Basic server info             |
| GET    | `/info`   | Server/app info               |
| GET    | `/status` | Status payload (uptime, env)  |

### Account/session

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/account/logout`         | Logout and clear cookies       |
| GET    | `/account/refresh-access` | Rotate/refresh access session  |

### Local auth

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/account/local/register` | Create account with password   |
| POST   | `/account/local/login`    | Login with email/password      |

### Google OAuth

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/account/google/register` | Start OAuth consent flow      |
| GET    | `/account/google/redirect` | OAuth callback route          |

### Protected user routes (requires `accessToken` cookie)

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| GET    | `/user/get-user-info`        | Get current user profile               |
| PUT    | `/user/update-user-info`     | Update first/last name                 |
| PATCH  | `/user/update-user-email`    | Update email (with password check)     |
| PATCH  | `/user/update-user-password` | Update password                        |
| PUT    | `/user/add-password`         | Add password to OAuth-created account  |

## Validation & error handling

- Request body validation is done via Joi middleware.
- App errors are normalized through a global error handler.
- Unknown routes return a JSON 404 payload.

Typical error response shape:

```json
{
  "message": "Error description"
}
```

In development mode, stack traces may also be included.

## Development notes

- Cookies are set with `httpOnly`, `secure`, and `sameSite: "none"`.
  - In local HTTP environments, secure-cookie behavior may differ by client/tool.
- The project currently has no automated tests. Consider adding:
  - Integration tests for auth flows
  - Contract tests for key endpoints

## Roadmap ideas

- Add more OAuth providers (Facebook, GitHub, etc.)
- Email verification + password reset
- Rate limiting and abuse protection
- Better API docs with OpenAPI/Swagger
- CI checks (lint, tests, security scan)

---

If you’re new to this codebase, start by reading in this order:

1. `src/app.js` (routing + middleware)
2. `src/routes/*.js` (endpoint map)
3. `src/controllers/localAuth/*` + `src/utils/issueAuthToken.js` (core auth flow)
4. `src/middlewares/verifyAccess.js` (protected route guard)
5. `src/controllers/refreshAccess.js` + `logoutUser.js` (session lifecycle)
