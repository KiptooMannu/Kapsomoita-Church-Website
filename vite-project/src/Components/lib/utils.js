// src/lib/utils.js
export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
  }