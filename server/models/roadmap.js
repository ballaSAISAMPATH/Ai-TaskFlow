import mongoose from 'mongoose';

// Simple Roadmap Schema - just for storing roadmaps
const roadmapSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    trim: true
  },
  totalConcepts: {
    type: Number,
    required: true
  },
  levels: [{
    level: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    concepts: {
      type: [String],
      required: true
    }
  }],
  relatedSkills: {
    complementary: [String],
    nextLevel: [String],
    specializations: [{
      role: {
        type: String,
        required: true,
        trim: true
      },
      averageSalary: {
        india: {
          type: String,
          required: true,
          trim: true
        },
        us: {
          type: String,
          required: true,
          trim: true
        },
        description: {
          type: String,
          required: true,
          trim: true
        }
      }
    }]
  },
  approach: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    roadmapStyle: {
      type: String,
      required: true,
      trim: true
    },
    id:{
      type: String,
      required: true,
      trim: true
    }
  },
  userId: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
  collection: 'roadmaps'
});

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
