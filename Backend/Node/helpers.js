import fs from "fs";
import { config } from "./config.js";

export function readFile(filePath) {
  const buffer = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(buffer);
  return data;
}

export function saveJSONToFile(data, fileName, minified = false) {
  if (minified) {
    fs.writeFileSync(fileName, JSON.stringify(data, null));
    return;
  }

  fs.writeFileSync(fileName, JSON.stringify(data, null, "\t"));
}

export function replaceDiacritics(str) {
  const diacriticsReplacers = {
    // Uppercase
    À: "A",
    Á: "A",
    Ã: "A",
    Ç: "C",
    È: "E",
    É: "E",
    Ê: "E",
    Ë: "E",
    Ì: "I",
    Í: "I",
    Ò: "O",
    Ó: "O",
    Õ: "O",
    Ô: "O",
    Ù: "U",
    Ú: "U",

    // Lowercase
    à: "a",
    á: "a",
    ã: "a",
    ç: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ì: "i",
    í: "i",
    ò: "o",
    ó: "o",
    õ: "o",
    ô: "o",
    ù: "u",
    ú: "u",
  };

  let mountedStr = "";
  for (const char of str.split("")) {
    if (!diacriticsReplacers[char]) {
      mountedStr += char;
      continue;
    }

    mountedStr += diacriticsReplacers[char];
  }

  return mountedStr;
}
