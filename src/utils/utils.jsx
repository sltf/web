export const getTrainDescription = (name, start, end) => {
  let displayName = `${start} → ${end}`;
  if (name) {
    displayName = `${name} (${displayName})`;
  }
  return displayName;
};
