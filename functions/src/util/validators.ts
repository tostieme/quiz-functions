export function validateLoginData(data) {
  if (isEmpty(data.email)) return false;
  if (isEmpty(data.password)) return false;
  return true;
}

export function isEmail(email) {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
}

export function isCorrectFileType(mimetype) {
  const filetype = mimetype.split("/")[0];
  console.log(filetype);
  if (filetype === "image" || filetype === "audio" || filetype === "video")
    return true;
  else return false;
}

function isEmpty(string) {
  if (string.trim() === "") return true;
  else return false;
}
