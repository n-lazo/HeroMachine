import { readdirSync, readdir, readFile, writeFile } from "node:fs";

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function stringToUTF8Bytes(string) {
  return new TextEncoder().encode(string);
}

const filePathFinal = process.cwd() + "/twc-final";
// pero no hardcode
const filePath = process.cwd() + "/twc/" + readdirSync("./twc")[0];

(() => {
  console.log("Iniciando");
  // Cantidad de veces a repetir el ciclo
  let ciclo = 0;
  // Numero de id del personaje
  let numeroId = 0;
  // Contador para sumar al id
  let contador = 0;
  while (ciclo <= 20) {
    readdir("./twc", (err, files) => {
      if (err) throw err;

      // Separamos el id del personaje
      // del nombre del archivo .twc
      const characterId = files[0].replace(".twc", "");

      // Contamos cuantos digitos tiene desde el final hacia adelante
      // paramos cuando encontramos un caracter que no es un
      // numero
      let cantidadDigitos = 0;
      for (let i = characterId.length - 1; i >= 0; i--) {
        if (isNaN(characterId[i])) {
          break;
        }
        cantidadDigitos++;
      }
      let numero = characterId.substring(
        characterId.length - cantidadDigitos,
        characterId.length,
      );
      numeroId = parseInt(numero) + contador + 1;
      contador += 1;

      let newCharacterId = characterId.replace(numero, numeroId.toString());

      readFile(filePath, "hex", (err, data) => {
        if (err) throw err;
        const text = data.toString();
        const toSearch = bytesToHex(stringToUTF8Bytes(characterId));
        const returnedInfo = text.replace(
          toSearch,
          bytesToHex(stringToUTF8Bytes(newCharacterId.toString())),
        );
        writeFile(
          filePathFinal + `/${newCharacterId}.twc`,
          returnedInfo,
          "hex",
          (err) => {
            if (err) throw err;
          },
        );
      });
    });
    ciclo++;
  }
  console.log("Finalizado");
  console.log("Cantidad de personajes generados: ", contador);
  console.log("Revisa la carpeta twc-final");
})();
