# Quiz-Functions

Dieses Repository stellt das Backend bzw. die API des KT-Quiz dar.
Folgende Endpunkte stehen zur Verfügung:

| Method | Endpoint | Description |
| ----------- | ----------- | ----------- |
| GET | /questions | Get all questions from firestore |
| GET | /question/:questionID | Get one Question from firestore |
| GET | /questionFilter | Get one question from firestore with a certain filter |
| POST | /question | Route for creating questions |
| PUT | /question/:questionID | Route for updating questions |
| DELETE | /question/:questionID | Route for deleting questions |
| POST | /signup | Signup Route for user |
| POST | /login | Login Route for user |
| POST | /logout | Logout Route for user |
| GET | /users | Test Route for getting all Users in SQL Database |
| POST | /user | Route for creating a User |



