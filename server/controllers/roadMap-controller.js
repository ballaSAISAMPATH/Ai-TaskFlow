import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { configDotenv } from "dotenv";

configDotenv();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  apiKey: process.env.GEMINI_API,
  maxOutputTokens: 4096,
});

// Define the structured output schema as a JSON schema
const roadmapSchema = {
  type: "object",
  properties: {
    skill: {
      type: "string",
      description: "The skill being learned"
    },
    totalConcepts: {
      type: "integer",
      description: "Total number of concepts across all levels"
    },
    levels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          level: {
            type: "string",
            description: "The skill level name (e.g., Novice Level, Beginner Level)"
          },
          description: {
            type: "string",
            description: "Brief description of what this level covers"
          },
          duration: {
            type: "string",
            description: "Estimated time to complete this level"
          },
          concepts: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array of concepts/skills to learn at this level"
          }
        },
        required: ["level", "description", "duration", "concepts"]
      }
    },
    relatedSkills: {
      type: "object",
      properties: {
        complementary: {
          type: "array",
          items: { type: "string" },
          description: "Skills that complement this main skill"
        },
        nextLevel: {
          type: "array",
          items: { type: "string" },
          description: "Advanced skills to learn after mastering this one"
        },
        specializations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: {
                type: "string",
                description: "Job role or specialization"
              },
              averageSalary: {
                type: "object",
                properties: {
                  india: { type: "string" },
                  us: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  },
  required: ["skill", "totalConcepts", "levels", "relatedSkills"]
};

// Create the prompt template
const roadmapPrompt = PromptTemplate.fromTemplate(`
You are an expert educational content creator specializing in comprehensive learning roadmaps. Create a detailed, structured learning roadmap for the skill "{skill}" using the "{approachName}" approach.

Learning Approach: {approachDescription}
Roadmap Style: {roadmapStyle}

Create a comprehensive roadmap that includes:

1. 6 progressive skill levels: Novice, Beginner, Competent, Proficient, Expert, and Guru/Master
2. 8-10 specific, actionable concepts per level
3. Realistic duration estimates for each level
4. Related complementary skills and next-level skills
5. Career specializations with salary ranges for India and US

Focus the content based on the selected learning approach. Ensure concepts progress logically from fundamental to advanced.

Return your response as a valid JSON object that matches this exact structure:
{schemaExample}

Important: Return ONLY the JSON object, no additional text or formatting.
`);

export const generateRoadmapController = async (req, res) => {
  try {
    const { skill, approach } = req.body;
    
    if (!skill || !approach) {
      return res.status(400).json({ 
        error: "Missing required fields: skill and approach" 
      });
    }

    // Create the model with structured output
    const structuredModel = model.withStructuredOutput(roadmapSchema);

    // Format the prompt with the request data
    const formattedPrompt = await roadmapPrompt.format({
      skill: skill,
      approachName: approach.name,
      approachDescription: approach.description,
      roadmapStyle: approach.roadmapStyle,
      schemaExample: JSON.stringify({
        skill: "Example Skill",
        totalConcepts: 52,
        levels: [
          {
            level: "Novice Level",
            description: "Foundation concepts and basics",
            duration: "6-8 weeks",
            concepts: ["Concept 1", "Concept 2", "Concept 3"]
          }
        ],
        relatedSkills: {
          complementary: ["Skill A", "Skill B"],
          nextLevel: ["Advanced Skill"],
          specializations: [
            {
              role: "Role Name",
              averageSalary: {
                india: "₹4-25 LPA",
                us: "$85,000",
                description: "Role description"
              }
            }
          ]
        }
      }, null, 2)
    });

    // Generate the structured roadmap
    const roadmapResponse = await structuredModel.invoke(formattedPrompt);

    // Return the structured response
    res.status(200).json({
      success: true,
      roadmap: roadmapResponse
    });

  } catch (error) {
    console.error("Error generating roadmap:", error);
    
    // Handle specific LangChain/Gemini errors
    if (error.message?.includes('structured output')) {
      res.status(500).json({ 
        error: "Failed to generate structured roadmap. Please try again." 
      });
    } else {
      res.status(500).json({ 
        error: "Internal server error while generating roadmap" 
      });
    }
  }
};
