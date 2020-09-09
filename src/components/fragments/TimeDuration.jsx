export const timeDuration = (duration) => {
  let hrs = (duration / 60) >> 0;
  let mins = duration % 60;
  let result = `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  return result;
}
