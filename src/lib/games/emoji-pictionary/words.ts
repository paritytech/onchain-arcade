/** Word bank for Emoji Pictionary — common nouns and phrases easy to describe with emoji */
export const WORD_BANK = [
  'pizza', 'rocket', 'rainbow', 'castle', 'dragon', 'treasure', 'volcano',
  'sunset', 'snowman', 'fireworks', 'dinosaur', 'butterfly', 'unicorn',
  'pirate', 'mermaid', 'wizard', 'robot', 'alien', 'ghost', 'vampire',
  'surfing', 'camping', 'birthday', 'wedding', 'circus', 'carnival',
  'jungle', 'desert', 'ocean', 'mountain', 'island', 'waterfall',
  'thunder', 'tornado', 'earthquake', 'blizzard', 'hurricane',
  'football', 'basketball', 'swimming', 'skiing', 'skateboard',
  'guitar', 'piano', 'drums', 'violin', 'trumpet',
  'hospital', 'school', 'airport', 'library', 'museum',
  'breakfast', 'lunch', 'dinner', 'dessert', 'barbecue',
  'elephant', 'penguin', 'dolphin', 'tiger', 'monkey',
  'garden', 'forest', 'beach', 'cave', 'bridge',
  'spaceship', 'submarine', 'helicopter', 'bicycle', 'train',
  'diamond', 'crown', 'sword', 'shield', 'arrow',
  'painting', 'sculpture', 'photograph', 'movie', 'concert',
  'detective', 'superhero', 'princess', 'knight', 'cowboy',
  'popcorn', 'chocolate', 'icecream', 'hamburger', 'sushi',
  'rainbow', 'lightning', 'sunrise', 'moonlight', 'starfish',
  'camping', 'fishing', 'hiking', 'dancing', 'cooking',
  'snowflake', 'sunflower', 'cactus', 'mushroom', 'pumpkin',
  'penguin', 'flamingo', 'parrot', 'octopus', 'jellyfish',
  'treasure', 'compass', 'telescope', 'microscope', 'hourglass',
  'football', 'tennis', 'boxing', 'archery', 'fencing',
]

/** Deterministic word selection from gameId + round */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getWordForRound(gameId: string, round: number): string {
  const hash = simpleHash(`${gameId}-round-${round}`)
  return WORD_BANK[hash % WORD_BANK.length]
}
