const generateAlias = () => {
  const a = "abcdefghijklmnopqrstuvwxyz";
  const A = a.toUpperCase();
  const n = "0123456789";
  const characters = a + A + n;
  const length = 7;
  let alias = "";
  // a1b-2C3
  for (let i = 0; i < length; i++) {
    if (i === 3) {
      alias += "-";
      continue;
    }
    const randomIndex = Math.floor(Math.random() * characters.length);
    alias += characters[randomIndex];
  }

  return alias;
};

export default generateAlias;
