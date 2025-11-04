export const gerarCodigo = () => {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let digits = "0123456789"
  let code = "";

  for (let i = 0; i < 7; i++) {
    if (i % 2 == 0) {
      code += letters[Math.floor(Math.random() * 26)];
    } else {
      code += digits[Math.floor(Math.random() * 10)];
    }
  }
  return code;
};
