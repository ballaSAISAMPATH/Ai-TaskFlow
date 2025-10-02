import mongoose from 'mongoose';

// Schema for salary information
const salarySchema = new mongoose.Schema({
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
}, { _id: false });

// Schema for career specializations
const specializationSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true
  },
  averageSalary: {
    type: salarySchema,
    required: true
  }
}, { _id: false });

// Schema for related skills
const relatedSkillsSchema = new mongoose.Schema({
  complementary: [{
    type: String,
    trim: true
  }],
  nextLevel: [{
    type: String,
    trim: true
  }],
  specializations: [specializationSchema]
}, { _id: false });

// Schema for individual skill levels
const levelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    trim: true,
    enum: ['Novice Level', 'Beginner Level', 'Competent Level', 'Proficient Level', 'Expert Level', 'Guru/Master Level']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  concepts: {
    type: [String],
    required: true,
    validate: {
      validator: function(concepts) {
        return concepts.length >= 6 && concepts.length <= 12;
      },
      message: 'Each level must have between 6-12 concepts'
    }
  }
}, { _id: false });

// Main Roadmap Schema
const roadmapSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  totalConcepts: {
    type: Number,
    required: true,
    min: 30,
    max: 100
  },
  levels: {
    type: [levelSchema],
    required: true,
    validate: {
      validator: function(levels) {
        return levels.length === 6;
      },
      message: 'Roadmap must have exactly 6 levels'
    }
  },
  relatedSkills: {
    type: relatedSkillsSchema,
    required: true
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
    }
  },
  // Updated userId field to handle string ObjectId and make it required
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid user ID format'
    }
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'roadmaps'
});

// Indexes - Updated to include userId for better performance
roadmapSchema.index({ skill: 1, 'approach.name': 1 });
roadmapSchema.index({ userId: 1, generatedAt: -1 });
roadmapSchema.index({ generatedAt: -1 });
roadmapSchema.index({ isPublic: 1 });

// Virtual for total duration
roadmapSchema.virtual('estimatedTotalDuration').get(function() {
  return `${this.levels.length * 8}-${this.levels.length * 12} weeks`;
});

// Instance methods
roadmapSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static methods
roadmapSchema.statics.findBySkill = function(skillName) {
  return this.find({ 
    skill: { $regex: skillName, $options: 'i' } 
  }).sort({ generatedAt: -1 });
};

roadmapSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// New static method to find roadmaps by user
roadmapSchema.statics.findByUser = function(userId, limit = 20) {
  return this.find({ userId: userId })
    .sort({ generatedAt: -1 })
    .limit(limit);
};

// Static method to check if user already has roadmap for specific skill and approach
roadmapSchema.statics.findUserRoadmap = function(userId, skill, approachName) {
  return this.findOne({
    userId: userId,
    skill: { $regex: `^${skill}$`, $options: 'i' },
    'approach.name': approachName
  });
};

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
