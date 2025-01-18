export function removeEmojisAndPattern(text: string) {
  // Replace '~' with a space
  const textNoTilde = text.replace("~", " ");

  // Replace '_' with a space
  const textNoUnderscore = textNoTilde.replace("_", " ");

  // Remove words enclosed by '*' (like *bold* or *italic* text)
  const textNoStarWords = textNoUnderscore.replace(/\*[^*]+?\*/g, "");

  // Replace other unwanted characters
  let textCleaned = textNoStarWords.replace("*", " ").replace("=", " ");
  textCleaned = textCleaned.replace("#", " ");

  // Remove any <em>HTML tags and content inside them
  textCleaned = textCleaned.replace(/<em>([^<]+)<\/em>/g, "");

  return textCleaned;
}
