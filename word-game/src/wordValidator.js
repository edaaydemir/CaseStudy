export default class WordValidator {
  constructor(validWords) {
    this.words = validWords.map((word) => ({
      word,
      used: false,
      ...(word === "GOLD" && { x: 0, y: 0, dir: "H" }),
      ...(word === "DOG" && { x: 0, y: 2, dir: "H" }),
      ...(word === "GOD" && { x: 0, y: 0, dir: "V" }),
      ...(word === "LOG" && { x: 2, y: 0, dir: "V" }),
    }));
  }

  isValid(word) {
    const entry = this.words.find((w) => w.word === word && !w.used);
    return !!entry;
  }

  isUsed(word) {
    return this.words.some((w) => w.word === word && w.used);
  }

  getWordData(word) {
    return this.words.find((w) => w.word === word);
  }

  markAsUsed(word) {
    const entry = this.words.find((w) => w.word === word);
    if (entry) entry.used = true;
  }

  isFinished() {
    return this.words.every((w) => w.used);
  }
}
