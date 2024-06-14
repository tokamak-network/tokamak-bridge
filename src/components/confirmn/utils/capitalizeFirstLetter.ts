/**
 * Converts the first letter to uppercase and the remaining letters to lowercase. @Robert
 * Handles the case where the input string is empty.
 */
export default function capitalizeFirstLetter(str: string) {
  if (!str) return str; // Handle the case where str is empty
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
