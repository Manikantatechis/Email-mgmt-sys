export default function truncateWithEllipsis(text, maxLength) {
  if (text?.length <= maxLength) {
    return text;
  }
  return text?.substr(0, maxLength - 3) + '      .........';
}
