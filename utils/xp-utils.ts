/**
 * Calculate XP required for the next level
 * Formula: level * 50
 */
export function calculateXpForNextLevel(level: number): number {
  return level * 50
}

/**
 * Calculate total XP earned so far
 */
export function calculateTotalXp(level: number, currentXp: number): number {
  let totalXp = currentXp

  // Add XP from previous levels
  for (let i = 1; i < level; i++) {
    totalXp += i * 50
  }

  return totalXp
}

/**
 * Get level based on total XP
 */
export function getLevelFromTotalXp(totalXp: number): number {
  let level = 1
  let xpRequired = calculateXpForNextLevel(level)

  while (totalXp >= xpRequired) {
    totalXp -= xpRequired
    level++
    xpRequired = calculateXpForNextLevel(level)
  }

  return level
}
