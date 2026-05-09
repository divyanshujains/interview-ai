import mongoose from "mongoose";


const technicalquestionSchema = new mongoose.Schema({   
    question: {
        type: String,
        required: [true , "Question is required"] 

    },
    intention: {
        type: String,
        required: [true , "Intention is required"] 

    },
    answer: {
        type: String,
        required: [true , "Answer is required"] 

    },

},{
    _id : false
})



const behevioralquestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  }
);


const skillgapschema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true , "Skill is required"] 
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true , "Severity description is required"] 
    },
},{
    _id : false
})


  const preprationplanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true , "Day is required"] 
    },
    focus: {
        type: String,
        required: [true , "Focus is required"] 
    },
    tasks: {
        type: [String],
        required: [true , "Tasks are required"] 
    }
},{
_id : false
})

const interviewReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },

  title: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [technicalquestionSchema],
  behavioralQuestions: [behevioralquestionSchema],
  skillGaps: [skillgapschema],
  preparationPlan: [preprationplanSchema],
}, { timestamps: true });


const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReport;