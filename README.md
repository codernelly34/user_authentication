# User Authentication Server

This app (server) is built using [Node.js](https://nodejs.org/) and
[Express.js](http://expressjs.com/). It is designed to handle user
authentication with multiple methods. In addition to local authentication,
various OAuth strategies (e.g., Google OAuth, Facebook OAuth, GitHub OAuth) will
be implemented. As each method is added, instructions on how to authenticate
with them will be provided.

## Features

- Local Authentication (Username and Password)
- OAuth Integrations (Upcoming)
  - Google OAuth
  - Facebook OAuth
  - GitHub OAuth
  - More to be added

## Installation

To run the app locally on your PC, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/codernelly34/user_authentication.git
   ```

2. Navigate to the project directory:

   ```bash
   cd user_authentication
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file by copying the `.env.sample` file:

   ```bash
   cp .env.sample .env
   ```

5. Replace the placeholder values in the `.env` file with valid credentials.

6. Start the server:

   ```bash
   npm run start
   ```

   or

   ```bash
   npm run dev
   ```

   to start the server in development mode.

## Usage

Once the server is running locally, you can begin testing the authentication
methods that have been implemented. As more OAuth strategies are added, detailed
instructions will be provided on how to use them.

**Note:** This app has not been hosted yet. To see the app in action, you must
run it locally on your machine. Ensure that the `.env` file is properly
configured with the required information, as this is essential for starting the
server.

### API Endpoints

- **Get info about the app (server):**
  - To get information on how to use the server, make a `GET` request to `/info`
    or `/`.
- **Check server status:**
  - To check the server's status or performance, make a `GET` request to
    `/status`.

### Local Authentication Routes

- **Register Endpoint:**

  - **URL:** `/account/local/register`
  - **Method:** `POST`
  - **Description:** Allows users to register by providing their details.
  - **Request Body:** Should be in JSON or Urlencoded formate. example:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "SecurePassword123",
      "confirmPassword": "SecurePassword123"
    }
    ```
  - **Response:**

    - **On Success:** Will return the new user object that was just created.
    - **On Error:** Will return and error object describing what happen.

- **Login Endpoint:**

  - **URL:** `/account/local/login`
  - **Method:** `POST`
  - **Description:** Allows users to log in by providing their email and
    password.
  - **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "SecurePassword123"
    }
    ```
  - **Response:**
  - **On Success:** Will return the user object. and also set auth cookies
  - **On Error:** Will return and error object describing what happen.

- **Logout Endpoint:**

  - **URL:** `/account/local/logout`
  - **Method:** `GET`
  - **Description:** Logs out the authenticated user by clearing their access
    and refresh tokens.
  - **Response:**
    - **On Success:** Logout Successful
  - **On Error:** Will return and error object describing what happen.

  - **Notes:** This endpoint clears cookies and invalidates the refresh token in
    the database if provided.

- **Get User Info Endpoint:**

  - **URL:** `/privet/get-user-info`
  - **Method:** `GET`
  - **Description:** Retrieves the authenticated user's information.
  - **Headers:**
    - `Cookie`: Must include a valid `accessToken`.
  - **Response:**
    - **On Success:** Will return the user object
    - **On Error:** Will return and error object describing what happen.
  - **Notes:** This endpoint is protected and requires authentication.

- **Update User Info Endpoint:**

  - **URL:** `/privet/update-user-info`
  - **Method:** `PUT`
  - **Description:** Updates the authenticated user's information.
  - **Request Body:** Should include the fields to be updated. Example:
    ```json
    {
      "firstName": "Jane",
      "lastName": "Smith"
    }
    ```
  - **Response:**

    - **On Success:** Will return the user object
    - **On Error:** Will return and error object describing what happen.

  - **Notes:** This endpoint is protected and requires authentication.

- **Refresh Access Token Endpoint:**
  - **URL:** `/account/local/refresh-access`
  - **Method:** `GET`
  - **Description:** Refreshes the user's access token using a valid refresh
    token.
  - **Response:**
    - **On Success:** Access refreshed
    - **On Error:** Will return an error object describing what happened.
  - **Notes:** This endpoint clears the old refresh token and sets new access
    and refresh tokens in cookies.

---

**More features are still under development and will be listed here as they are
added.**
