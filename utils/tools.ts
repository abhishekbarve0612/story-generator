// Tool schemas for OpenAI function calling

export const characterProfileTool = {
  type: "function" as const,
  function: {
    name: "get_character_profile",
    description: "Get detailed profile information for a specific character in the story",
    parameters: {
      type: "object",
      properties: {
        character_name: {
          type: "string",
          description: "The name of the character whose profile is needed"
        }
      },
      required: ["character_name"]
    }
  }
};

export const availableCharactersTool = {
  type: "function" as const,
  function: {
    name: "get_available_characters",
    description: "Get a list of all available character names in the story",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
};

// Export all available tools
export const storyTools = [
  characterProfileTool,
  availableCharactersTool
];

// Tool names for easy reference
export const TOOL_NAMES = {
  GET_CHARACTER_PROFILE: "get_character_profile",
  GET_AVAILABLE_CHARACTERS: "get_available_characters"
} as const;