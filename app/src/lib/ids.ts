enum IdPrefix {
  CARD = "card_",
  DEVICE = "dvc_",
}

export default IdPrefix;

export function generateId(prefix: IdPrefix, length = 32) {
  let randomId = "";
  for (let i = 0; i < length; i++) {
    randomId += Math.floor(Math.random() * 10).toString();
  }
  return `${prefix}${randomId}`;
}
