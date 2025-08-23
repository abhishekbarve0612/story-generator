const FORM_CACHE_KEY = "story-generator-forms";
const LORE_CACHE_KEY = "story-generator-lore";
const MESSAGE_CACHE_KEY = "story-generator-message";
const CHARACTER_CACHE_KEY = "story-generator-character";
const DIRECTION_CACHE_KEY = "story-generator-direction";
const INSTRUCTION_CACHE_KEY = "story-generator-instruction";
const STORY_PROGRESSION_CACHE_KEY = "story-generator-story-progression";
const CHARACTER_IDS_CACHE_KEY = "story-generator-character-ids";

interface FormData {
  content: string;
  timestamp: number;
}

const getCacheKey = (formType: string): string => {
  switch (formType) {
    case 'character': return CHARACTER_CACHE_KEY;
    case 'lore': return LORE_CACHE_KEY;
    case 'message': return MESSAGE_CACHE_KEY;
    case 'direction': return DIRECTION_CACHE_KEY;
    case 'instruction': return INSTRUCTION_CACHE_KEY;
    case 'story-progression': return STORY_PROGRESSION_CACHE_KEY;
    default: return FORM_CACHE_KEY;
  }
};

export const saveFormData = (formType: string, content: string) => {
  try {
    const cacheKey = getCacheKey(formType);
    const formData: FormData = { content, timestamp: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(formData));
  } catch (error) {
    console.warn(`Failed to save ${formType} form data:`, error);
  }
};

export const loadFormData = (formType: string): string => {
  try {
    const cacheKey = getCacheKey(formType);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const formData: FormData = JSON.parse(cached);
      return formData.content || "";
    }
    return "";
  } catch (error) {
    console.warn(`Failed to load ${formType} form data:`, error);
    return "";
  }
};

export const loadAllForms = (): Record<string, FormData> => {
  const allForms: Record<string, FormData> = {};
  const formTypes = ['character', 'lore', 'message', 'direction', 'instruction', 'story-progression'];
  
  formTypes.forEach(formType => {
    try {
      const cacheKey = getCacheKey(formType);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        allForms[formType] = JSON.parse(cached);
      }
    } catch (error) {
      console.warn(`Failed to load ${formType} form:`, error);
    }
  });
  
  return allForms;
};

export const clearFormData = (formType: string) => {
  try {
    const cacheKey = getCacheKey(formType);
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.warn(`Failed to clear ${formType} form data:`, error);
  }
};

// Character IDs management
export const saveCharacterId = (characterId: string) => {
  try {
    const existingIds = getCharacterIds();
    if (!existingIds.includes(characterId)) {
      existingIds.push(characterId);
      localStorage.setItem(CHARACTER_IDS_CACHE_KEY, JSON.stringify(existingIds));
    }
  } catch (error) {
    console.warn("Failed to save character ID:", error);
  }
};

export const getCharacterIds = (): string[] => {
  try {
    const cached = localStorage.getItem(CHARACTER_IDS_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.warn("Failed to load character IDs:", error);
    return [];
  }
};

export const removeCharacterId = (characterId: string) => {
  try {
    const existingIds = getCharacterIds();
    const filteredIds = existingIds.filter(id => id !== characterId);
    localStorage.setItem(CHARACTER_IDS_CACHE_KEY, JSON.stringify(filteredIds));
  } catch (error) {
    console.warn("Failed to remove character ID:", error);
  }
};

export const clearAllForms = () => {
  try {
    const cacheKeys = [
      CHARACTER_CACHE_KEY,
      LORE_CACHE_KEY,
      MESSAGE_CACHE_KEY,
      DIRECTION_CACHE_KEY,
      INSTRUCTION_CACHE_KEY,
      STORY_PROGRESSION_CACHE_KEY,
      CHARACTER_IDS_CACHE_KEY
    ];
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn("Failed to clear all forms:", error);
  }
};
