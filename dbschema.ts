// Lediglich für die Modellierung der einzelnen Komponenten
class UserSchema {
  userID: string = "ksdjfhsdjkfdjkshfds";
  email: string = "user@mail.com";
  name: string = "Tobias";
  surname: string = "Stiemer";
  role: string = "Admin";
  displayName: string = "Tobi";
  createdAt: string = "2019-03-15T10:59:52.798Z";
  nameOfOrga: string = "R+V Versicherung";
  adressOfOrgaStreet: string = "Raiffeisenplatz 1";
  adressOfOrgaCity: string = "Wiesbaden";
  adressOfOrgaPostalCode: number = 65189;
}

class QuestionSchema {
  questionBody: string = "Das ist der Fragentext";
  correctAnswer: string = "Richte Antwort";
  wrongAnswer1: string = "Falsche Antwortoption1";
  wrongAnswer2: string = "Falsche Antwortoption2";
  wrongAnswer3: string = "Falsche Antwortoption3";
  imageUrl: string = "image/something";
  videoUrl: string = "audio/something";
  audioUrl: string = "video/something";
  createdAt: string = "2020-12-31T11:46:01.018Z";
  displayName: string = "user der die Frage erstellt hat";
}

const userDetails = {
  // Redux data
  credentials: {
    userID: "ksdjfhsdjkfdjkshfds",
    email: "user@mail.com",
    name: "Tobias",
    surname: "Stiemer",
    role: "Admin",
    displayName: "Tobi",
    createdAt: "2019-03-15T10:59:52.798Z",
    nameOfOrga: "R+V Versicherung",
    adressOfOrgaStreet: "Raiffeisenplatz 1",
    adressOfOrgaCity: "Wiesbaden",
    adressOfOrgaPostalCode: 65189,
  },
};

// MySQL
// MySQL PW: ElnP5kHDqhN97zm2
