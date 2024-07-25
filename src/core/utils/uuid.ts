export function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;  // Generate a random number between 0 and 15
    const v = c === 'x' ? r : (r & 0x3) | 0x8;  // Use 0x8 to 0xB for 'y' position
    return v.toString(16);  // Convert to hexadecimal
  });
}
