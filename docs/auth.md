# Authentication Schema

There are four authentication privilege levels, expressed as `P0`-`P3`, where
the highest privilege level (administrator) is `P3` and someone who isn't logged
in has the lowest privilege level, `P0`.

The privilege levels are handled by the `/auth` API routes, described below,
which are responsible for exchanging ScottyLabs JWT for Events JWT.  For a
development server, the client will happily give out tokens for any privilege
level, which we can arbitrarily switch between.  Then, all other routes should
check the Authorization header for requests signed with tokens.  The field in
particular in the JWT is `privilege: [1-3]` (there are no tokens for `P0`).

## The `/auth` API Routes

### GET `/auth/login`
This is where you would exchange a ScottyLabs JWT in the header for an Events
JWT.

### GET `/auth/dummy/:level`
In a debugging environment, exchanges the ScottyLabs JWT for the same token, but
with the `privilege` parameter set to `:level`.

## The `auth` Client Side Library
The `auth` client side library should be used in order to wrap API requests to
`/auth` endpoints.  It caches the auth token so that the `data` client side
library can use it to sign requests.

It exports the following functions:

### `auth.getToken`
- Brief: Returns a cached version of the JWT that should be used to sign all API
  requests.
- Param: `None`
- Returns: The JWT that should be used to sign all API requests.

If we're not logged in, should return the empty object.

### `auth.currentPrivilegeLevel`
- Brief: Returns the current privilege level, as stored in the `JWT`.
- Param: `None`
- Returns: The the current privilege level, as a number in `{0, 1, 2, 3}`.

### `auth.login`
- Brief: Initialize a login sequence, using the user's privilege parameter.
- Param: `None`
- Returns: A promise, which resolves when a new privilege level is loaded, or
  throws an error if the request is denied.

### `auth.requestDummyPrivilege(level)`
- Brief: Performs a login request with the dummy privilege parameter.
- Param: `level`: The requested privilege level.
- Returns: A promise, which resolves when a new privilege level is loaded, or
  throws an error if the request is denied.

If we're not logged in, runs the login sequence.

### `auth.logout`
- Brief: Drops the cached auth state, effectively logging out the user and
  setting our privilege level to `P3`.
- Param: `None`
- Returns: `None`

### `auth.init(onPLChange)`
- Brief: Set the function to be called whenever the privilege level changes.
- Param: `onPLChange` The function to be called when the privilege level changes.
- Returns: `None`

Should be used by the `data` library to initialize a data refresh when the auth
level changes.  The function will receive one parameter: the new privilege
level.  Will likely just be `data.sync`.

## The `auth` Server Side Library
The `auth` server side library should be used to generate new JWT tokens and
validate existing tokens.

It exports the following functions:

### `auth.init(config, setUser, getUser)`
- Brief: Initializes the library on its first invocation.
- Param: `config` A general configuration object.
- Param: `setUser` A function that takes the user to set in the database and
  sets it.
- Param: `getUser` A function that takes a userID and returns its privilege
  level, if one is set.
- Return: A Promise that evaluates when the library successfully initializes.

### `auth.verify(token)`
- Brief: Verifies the token is a valid Events JWT.
- Param: `token` The token to validate.
- Return: `Number` The token's auth level.

### `auth.exchange(token)`
- Brief: Exchanges a valid SL auth token for an Events token.
- Param: `token` An SL auth token.
- Return: A promise that resolves with a single parameter, which is the new
  Events auth token.
