# JASON -> Fake api from JSON files

This is a fake api from JSON files. It's a fake api because it's not a real api, it's just a server that reads json files and returns them in response.

You can use it to test your frontend applications without having to create a backend.
Put json files with an array of objects in the `jason` folder and access them through the url `http://localhost:5555/<file_name>`

## How to use

1. Clone this repository
2. Add you json files in the `jason` folder
3. Install dependencies: `pnpm install`
4. Run the server: `pnpm run dev`
5. Open the browser at `http://localhost:5555`

## Endpoints

GET ALL:

- GET: `http://localhost:5555/<file_name>`: returns the json file content

GET BY ID:

- GET: `http://localhost:5555/<file_name>/id`: returns the json file content filtered by id

CREATE:

- POST: `http://localhost:5555/<file_name>`: creates a new object in the json file usin BODY as the new object

DELETE:

- DELETE: `http://localhost:5555/<file_name>/id`: deletes the object with the id passed in the url

## Examples

- `http://localhost:5555/users` returns the content of the `users.json` file
- `http://localhost:5555/users/1` returns the content of the `users.json` file filtered by id
- `http://localhost:5555/users` with a body of `{ "name": "John Doe" }` creates a new object in the `users.json` file
- `http://localhost:5555/users/1` deletes the object with the id `1` in the `users.json` file
