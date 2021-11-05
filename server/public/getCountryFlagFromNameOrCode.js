/**
 * 1
 * @param {string} nameOrCode country code passed in
 * @returns {string | void} emoji string generated from the country code
 */
 function getCountryFlagFromNameOrCode(nameOrCode) {
  if (typeof nameOrCode !== "string") return void 0;
  if (nameOrCode === undefined) return void 0;

  if (nameOrCode.length === 2) {
    //code logic to return flag from code
    for (const key in FLAGKEY_EMOJIVALUE) {
      if (key === nameOrCode.toUpperCase()) {
        return FLAGKEY_EMOJIVALUE[key].emoji;
      }
    }
  }
  if (nameOrCode.length > 2) {
    //code logic to return flag from name
    for (const key in FLAGKEY_EMOJIVALUE) {
      if (FLAGKEY_EMOJIVALUE[key].name === nameOrCode) {
        return FLAGKEY_EMOJIVALUE[key].emoji;
      }
    }
  }
}