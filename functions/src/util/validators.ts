export function validateLoginData(data) {
  if (isEmpty(data.email)) return false;
  if (isEmpty(data.password)) return false;
  return true;
}

function isEmpty(string) {
  if (string.trim() === "") return true;
  else return false;
}
