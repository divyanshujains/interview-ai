import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe"
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc."
          ),
      })
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them"
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc."
          ),
      })
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"
          ),
      })
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity"
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc."
          ),
      })
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated"
    ),
});




async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate. 
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

You MUST return ONLY a JSON object. Do not include markdown formatting like \`\`\`json. The JSON MUST EXACTLY follow this structure where arrays contain OBJECTS, not flat strings:

{
  "title": "string",
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": [
        "string"
      ]
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    },
  });
  
  let text = response.text;
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  console.log("AI Parsed Text:", text);

  let parsed = JSON.parse(text);

  // Helper function to brutally force an array into an array of objects
  const unflatten = (arr, keys) => {
    if (!Array.isArray(arr)) return [];
    if (arr.length === 0) return arr;
    
    // If it's already perfectly formed
    if (typeof arr[0] === 'object' && arr[0] !== null && !Array.isArray(arr[0])) {
      return arr;
    }

    let result = [];
    let currentObj = {};
    let keySet = new Set(keys.map(k => k.toLowerCase()));
    
    // Process the flat array by scanning for any key matches
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let itemStr = typeof item === 'string' ? item.toLowerCase() : '';
      
      if (keySet.has(itemStr)) {
        // We hit a key! The next item is its value.
        let actualKey = keys.find(k => k.toLowerCase() === itemStr);
        let val = arr[i + 1];
        
        // If this key already exists in currentObj, it means we started a new object
        if (currentObj[actualKey] !== undefined) {
          result.push(currentObj);
          currentObj = {};
        }
        
        currentObj[actualKey] = val !== undefined ? val : '';
        i++; // skip the value
      }
    }
    
    // Push the last object if it has keys
    if (Object.keys(currentObj).length > 0) {
      result.push(currentObj);
    }

    // Fallback: if scanning completely failed (no keys matched), chunk it sequentially
    if (result.length === 0) {
      for (let i = 0; i < arr.length; i += keys.length) {
        let obj = {};
        for (let j = 0; j < keys.length; j++) {
          obj[keys[j]] = arr[i + j] !== undefined ? arr[i + j] : '';
        }
        result.push(obj);
      }
    }

    return result;
  };

  // Normalize the arrays before passing to Mongoose to prevent CastError
  const getSafeArray = (key, expectedKeys) => {
    let arr = parsed[key] || parsed[key.toLowerCase()] || [];
    return unflatten(arr, expectedKeys);
  };

  parsed.technicalQuestions = getSafeArray("technicalQuestions", ["question", "intention", "answer"]);
  parsed.behavioralQuestions = getSafeArray("behavioralQuestions", ["question", "intention", "answer"]);
  parsed.skillGaps = getSafeArray("skillGaps", ["skill", "severity"]);
  parsed.preparationPlan = getSafeArray("preparationPlan", ["day", "focus", "tasks"]);

  return parsed;
  
}



export { generateInterviewReport };
