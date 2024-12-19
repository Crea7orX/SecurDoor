export function generateKey(length = 6) {
  let randomKey = "";
  for (let i = 0; i < length; i++) {
    randomKey += Math.floor(Math.random() * 10).toString();
  }
  return randomKey;
}
