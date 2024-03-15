export function capitalizeFirstChar(inputString: string | undefined) {
  if (!inputString) return;
  if (inputString === "DARIUS") return "Titan Goerli";
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  );
}
