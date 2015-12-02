# Data Schema

The data schema is very lenient, and relies primarily on letting the front-end
do the mutation of data, and then registering validators to ensure that the
    internal state is not compromised when loading in the new data.

The data is handled by the `/data` API routes, described below, which are
responsible for receiving data requests from clients, filtering them based on
their access level, and serving out the data subsets.  They also ensure that the
data passed up is indeed a valid data state, and load it into the database.

## The `/data` API Routes

### GET `/data`
Returns the global dataset, filtered by the JWT auth level.

### POST `/data`
Updates the global dataset, filtered by the JWT auth level.

### GET `/data/hash`
Returns the hashed dataset, so that clients can decide whether to do a full data
refresh.

### GET `/data/event/:eventID`
Returns the dataset for a single event, filtered by the JWT auth level.

### POST `/data/event/:eventID`
Update the dataset for a single event, filtered by the JWT auth level.

### GET `/data/event/:eventID/hash`
Returns the hash for a single event's dataset, filtered by the JWT auth level.

## The `data` Client Side Library
The `data` client side library should be used in order to wrap API requests to
the server, as it handles things like caching and passively checking for data
updates.  It should check data isn't stale every time we sync up the data and
once every 2 seconds or so.

It exposes the following method:

### `data.init(updateUI, getToken))`
- Brief: Initialize the data library, with functions to update the UI, and to
  get the appropriate JWT to sign requests with.
- Param: `updateUI` Called whenever we prompt a UI update (on `data.sync` or new
  data.
- Param: `getToken` Called when we need a new JWT.
- Returns: `None`

### `data.sync`
- Brief: Pushes up a change in the data model.
- Param: `None`
- Returns: A Promise that resolves when the data model has been successfully
  synced up to the cloud.

  Should validate the data model, push it to the server, then pull down clean
  data and prompt a data refresh if necessary.
