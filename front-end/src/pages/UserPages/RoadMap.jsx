import Header from '@/components/User/Roadmap/Header';
import React, { useState } from 'react';

export default function RoadMap() {
  const [skill, setSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showExample, setShowExample] = useState(false);
  const [showReactExample, setShowReactExample] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  const popularSkills = [
    'React Development',
    'Full Stack Development',
    'Python Programming',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'DevOps Engineering',
    'Mobile App Development',
    'Cybersecurity',
    'Cloud Computing'
  ];

  const skillLevels = [
    { id: 'all', name: 'All Levels', description: 'Complete overview from basic to guru' },
    { id: 'novice', name: 'Novice', description: 'Just starting to learn the fundamentals' },
    { id: 'beginner', name: 'Beginner', description: 'Understanding basic concepts with guidance' },
    { id: 'competent', name: 'Competent', description: 'Applying knowledge in practical settings' },
    { id: 'proficient', name: 'Proficient', description: 'Understanding bigger picture and variations' },
    { id: 'expert', name: 'Expert', description: 'Intuitive understanding and adaptability' },
    { id: 'guru', name: 'Guru/Master', description: 'Effortless excellence and innovation' }
  ];

  // Comprehensive Python Programming Example
  const pythonRoadmap = {
    skill: 'Python Programming',
    totalConcepts: 47,
    levels: [
      {
        level: 'Novice Level',
        description: 'Learning basic syntax and fundamental concepts',
        duration: '4-6 weeks',
        concepts: [
          'Python Installation & Setup',
          'Variables and Data Types',
          'Basic Input/Output',
          'Comments and Documentation',
          'Numbers and Arithmetic Operations',
          'Strings and String Methods',
          'Boolean Logic'
        ]
      },
      {
        level: 'Beginner Level',
        description: 'Understanding control structures and basic programming logic',
        duration: '6-8 weeks',
        concepts: [
          'Conditional Statements (if/elif/else)',
          'Loops (for and while)',
          'Lists and List Methods',
          'Dictionaries and Dictionary Methods',
          'Tuples and Sets',
          'Basic Functions',
          'Function Parameters and Return Values',
          'Scope and Local/Global Variables'
        ]
      },
      {
        level: 'Competent Level',
        description: 'Applying knowledge in structured programming',
        duration: '8-10 weeks',
        concepts: [
          'File Input/Output Operations',
          'Error Handling (try/except)',
          'List Comprehensions',
          'Lambda Functions',
          'Modules and Packages',
          'Object-Oriented Programming Basics',
          'Classes and Objects',
          'Inheritance and Polymorphism',
          'Regular Expressions',
          'Working with APIs'
        ]
      },
      {
        level: 'Proficient Level',
        description: 'Understanding advanced concepts and best practices',
        duration: '10-12 weeks',
        concepts: [
          'Advanced OOP Concepts',
          'Decorators and Context Managers',
          'Generators and Iterators',
          'Threading and Multiprocessing',
          'Database Integration (SQLite/PostgreSQL)',
          'Web Scraping (BeautifulSoup, Scrapy)',
          'Data Analysis (Pandas, NumPy)',
          'Testing (unittest, pytest)',
          'Virtual Environments',
          'Package Management (pip, conda)'
        ]
      },
      {
        level: 'Expert Level',
        description: 'Mastering advanced patterns and system design',
        duration: '12-16 weeks',
        concepts: [
          'Metaclasses and Descriptors',
          'Asynchronous Programming (asyncio)',
          'Memory Management and Optimization',
          'Design Patterns Implementation',
          'Web Frameworks (Django/Flask)',
          'REST API Development',
          'Microservices Architecture',
          'Containerization (Docker)',
          'CI/CD Pipeline Integration',
          'Performance Profiling and Optimization'
        ]
      },
      {
        level: 'Guru/Master Level',
        description: 'Innovation, leadership, and cutting-edge applications',
        duration: 'Ongoing',
        concepts: [
          'Contributing to Open Source Projects',
          'Machine Learning Integration (scikit-learn, TensorFlow)',
          'Big Data Processing (PySpark)',
          'System Architecture Design',
          'Code Review and Mentoring',
          'Creating Python Packages/Libraries',
          'Advanced Security Practices',
          'Distributed Systems Development',
          'Technical Leadership and Strategy'
        ]
      }
    ],
    relatedSkills: {
      complementary: ['JavaScript', 'SQL', 'Git/GitHub', 'Linux/Unix', 'Docker'],
      nextLevel: ['Machine Learning', 'Data Science', 'Web Development', 'DevOps', 'Cloud Computing'],
      specializations: [
      {
        role: 'AI/ML Engineer',
        averageSalary: {
          india: '₹6-40 LPA',
          us: '$131,637',
          description: 'Build and deploy machine learning models and AI systems'
        }
      },
      {
        role: 'Backend Developer', 
        averageSalary: {
          india: '₹5-43 LPA',
          us: '$95,492',
          description: 'Develop server-side applications and APIs'
        }
      },
      {
        role: 'Data Scientist',
        averageSalary: {
          india: '₹9-30 LPA', 
          us: '$129,515',
          description: 'Analyze data to extract insights and build predictive models'
        }
      },
      {
        role: 'Automation Engineer',
        averageSalary: {
          india: '₹4-25 LPA',
          us: '$88,000',
          description: 'Design and implement automated testing and deployment systems'
        }
      },
      {
        role: 'Full Stack Developer',
        averageSalary: {
          india: '₹6-35 LPA',
          us: '$102,000', 
          description: 'Work on both frontend and backend development'
        }
      }
    ]
      
    }
  };

  // React Development Example
  const reactRoadmap = {
    skill: 'React Development',
    totalConcepts: 52,
    levels: [
      {
        level: 'Novice Level',
        description: 'Understanding web fundamentals and React basics',
        duration: '6-8 weeks',
        concepts: [
          'HTML5 Semantic Elements',
          'CSS3 and Flexbox/Grid',
          'JavaScript ES6+ Fundamentals',
          'DOM Manipulation',
          'React Installation and Setup',
          'JSX Syntax and Elements',
          'Components and Props',
          'Basic Event Handling'
        ]
      },
      {
        level: 'Beginner Level',  
        description: 'Building interactive components with state management',
        duration: '8-10 weeks',
        concepts: [
          'State and setState',
          'Event Handling Patterns',
          'Conditional Rendering',
          'Lists and Keys',
          'Form Handling and Controlled Components',
          'Component Lifecycle Methods',
          'React Developer Tools',
          'Basic Styling in React'
        ]
      },
      {
        level: 'Competent Level',
        description: 'Creating complete applications with routing and data flow',
        duration: '10-12 weeks',
        concepts: [
          'React Router and Navigation',
          'State Management Patterns',
          'HTTP Requests and APIs',
          'React Hooks (useState, useEffect)',
          'Custom Hooks Creation',
          'Error Boundaries',
          'Code Splitting and Lazy Loading',
          'PropTypes and Type Checking',
          'Testing with Jest and React Testing Library'
        ]
      },
      {
        level: 'Proficient Level',
        description: 'Advanced patterns and application architecture',
        duration: '12-14 weeks',
        concepts: [
          'Context API for Global State',
          'useReducer and Complex State Logic',
          'Advanced Hooks (useMemo, useCallback, useRef)',
          'Higher-Order Components (HOCs)',
          'Render Props Pattern',
          'Redux for State Management',
          'Middleware and Async Actions',
          'Server-Side Rendering (Next.js)',
          'Progressive Web Apps (PWA)',
          'Performance Optimization Techniques'
        ]
      },
      {
        level: 'Expert Level',
        description: 'Advanced architecture and enterprise-level applications',
        duration: '14-18 weeks',
        concepts: [
          'Micro-frontends Architecture',
          'Advanced Redux Patterns (Redux Toolkit)',
          'GraphQL Integration',
          'TypeScript with React',
          'Advanced Testing Strategies',
          'Bundle Optimization and Tree Shaking',
          'React Concurrent Features',
          'Custom Renderer Development',
          'React Native for Mobile',
          'Deployment and DevOps Integration'
        ]
      },
      {
        level: 'Guru/Master Level',
        description: 'Innovation, contribution, and technical leadership',
        duration: 'Ongoing',
        concepts: [
          'Contributing to React Ecosystem',
          'Creating Custom React Libraries',
          'Advanced Performance Monitoring',
          'Accessibility (a11y) Best Practices',
          'Internationalization (i18n)',
          'Technical Architecture Decisions',
          'Team Leadership and Code Reviews',
          'Open Source Contributions',
          'Conference Speaking and Content Creation',
          'Emerging React Patterns and Features'
        ]
      }
    ],
    relatedSkills: {
      complementary: ['TypeScript', 'Node.js', 'CSS-in-JS', 'Webpack', 'GraphQL'],
      nextLevel: ['Full Stack Development', 'React Native', 'Next.js', 'Vue.js', 'Angular'],
    specializations: [
      {
        role: 'Frontend Developer',
        averageSalary: {
          india: '₹4-25 LPA',
          us: '$85,000',
          description: 'Build user interfaces and client-side applications'
        }
      },
      {
        role: 'Full Stack Developer',
        averageSalary: {
          india: '₹6-35 LPA', 
          us: '$102,000',
          description: 'Work on both frontend and backend development'
        }
      },
      {
        role: 'React Native Developer',
        averageSalary: {
          india: '₹5-30 LPA',
          us: '$98,000',
          description: 'Build cross-platform mobile applications'
        }
      },
      {
        role: 'UI/UX Engineer',
        averageSalary: {
          india: '₹4-20 LPA',
          us: '$82,000', 
          description: 'Bridge design and development with user experience focus'
        }
      },
      {
        role: 'Technical Lead',
        averageSalary: {
          india: '₹15-50 LPA',
          us: '$145,000',
          description: 'Lead development teams and make technical decisions'
        }
      }
    ]    }
  };

  const handleSkillSelect = (selectedSkill) => {
    setSkill(selectedSkill);
  };

  const generateRoadmap = () => {
    if (!skill) {
      alert('Please enter a skill to generate comprehensive roadmap');
      return;
    }
    
    setGeneratedRoadmap({
      skill: skill,
      message: `Complete concept roadmap for ${skill} has been generated! This comprehensive overview covers all levels from novice to guru.`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Header/>
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Skill Input Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Enter the skill you want to master completely
            </label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., Python Programming, React Development, Data Science..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg transition-colors"
            />
          </div>

          {/* Popular Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Popular Skills
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {popularSkills.map((popularSkill, index) => (
                <button
                  key={index}
                  onClick={() => handleSkillSelect(popularSkill)}
                  className="px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-500 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {popularSkill}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Focus on Specific Level (Optional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {skillLevels.map((level) => (
                <label
                  key={level.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-500 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="skillLevel"
                    value={level.id}
                    checked={selectedLevel === level.id}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-800 text-sm">{level.name}</div>
                    <div className="text-xs text-gray-500">{level.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateRoadmap}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              🗺️ Generate Complete Concept Map
            </button>
          </div>

          {/* Generated Roadmap Display */}
          {generatedRoadmap && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Complete Concept Roadmap: {generatedRoadmap.skill}
              </h3>
              <p className="text-green-700">{generatedRoadmap.message}</p>
            </div>
          )}
        </div>

        {/* Example Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Python Programming Example */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Python Programming Complete Map
                </h2>
                <p className="text-sm text-gray-600">{pythonRoadmap.totalConcepts} total concepts</p>
              </div>
              <button
                onClick={() => setShowExample(!showExample)}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                {showExample ? 'Hide' : 'Show'}
              </button>
            </div>

            {showExample && (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {pythonRoadmap.levels.map((level, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-600">
                        {level.level}
                      </h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {level.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {level.concepts.map((concept, conceptIndex) => (
                        <div
                          key={conceptIndex}
                          className="flex items-center p-2 bg-green-50 rounded text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-gray-700">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Related Skills for Python */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">What's Next After Python?</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-blue-700">Complementary Skills: </span>
                      <span className="text-sm text-blue-600">{pythonRoadmap.relatedSkills.complementary.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-700">Next Level Skills: </span>
                      <span className="text-sm text-blue-600">{pythonRoadmap.relatedSkills.nextLevel.join(', ')}</span>
                    </div>
                    {/* Related Skills with Salaries */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">What's Next After Python?</h4>
                    <div className="space-y-4">
                        <div>
                        <span className="text-sm font-medium text-blue-700">Complementary Skills: </span>
                        <span className="text-sm text-blue-600">{pythonRoadmap.relatedSkills.complementary.join(', ')}</span>
                        </div>
                        <div>
                        <span className="text-sm font-medium text-blue-700">Next Level Skills: </span>
                        <span className="text-sm text-blue-600">{pythonRoadmap.relatedSkills.nextLevel.join(', ')}</span>
                        </div>
                        <div>
                        <span className="text-sm font-medium text-blue-700 block mb-2">Career Specializations:</span>
                        <div className="space-y-3">
                            {pythonRoadmap.relatedSkills.specializations.map((spec, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                                <div className="flex justify-between items-start mb-1">
                                <h5 className="font-medium text-gray-800 text-sm">{spec.role}</h5>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-green-600">India: {spec.averageSalary.india}</div>
                                    <div className="text-xs font-semibold text-blue-600">US: {spec.averageSalary.us}</div>
                                </div>
                                </div>
                                <p className="text-xs text-gray-600 leading-tight">{spec.averageSalary.description}</p>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* React Development Example */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  React Development Complete Map
                </h2>
                <p className="text-sm text-gray-600">{reactRoadmap.totalConcepts} total concepts</p>
              </div>
              <button
                onClick={() => setShowReactExample(!showReactExample)}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                {showReactExample ? 'Hide' : 'Show'}
              </button>
            </div>

            {showReactExample && (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {reactRoadmap.levels.map((level, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-600">
                        {level.level}
                      </h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {level.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {level.concepts.map((concept, conceptIndex) => (
                        <div
                          key={conceptIndex}
                          className="flex items-center p-2 bg-green-50 rounded text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-gray-700">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Related Skills for React */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">What's Next After React?</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-blue-700">Complementary Skills: </span>
                      <span className="text-sm text-blue-600">{reactRoadmap.relatedSkills.complementary.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-700">Next Level Skills: </span>
                      <span className="text-sm text-blue-600">{reactRoadmap.relatedSkills.nextLevel.join(', ')}</span>
                    </div>
                    {/* Related Skills for React */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">What's Next After React?</h4>
                    <div className="space-y-4">
                        <div>
                        <span className="text-sm font-medium text-blue-700">Complementary Skills: </span>
                        <span className="text-sm text-blue-600">{reactRoadmap.relatedSkills.complementary.join(', ')}</span>
                        </div>
                        <div>
                        <span className="text-sm font-medium text-blue-700">Next Level Skills: </span>
                        <span className="text-sm text-blue-600">{reactRoadmap.relatedSkills.nextLevel.join(', ')}</span>
                        </div>
                        <div>
                        <span className="text-sm font-medium text-blue-700 block mb-2">Career Specializations:</span>
                        <div className="space-y-3">
                            {reactRoadmap.relatedSkills.specializations.map((spec, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                                <div className="flex justify-between items-start mb-1">
                                <h5 className="font-medium text-gray-800 text-sm">{spec.role}</h5>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-green-600">India: {spec.averageSalary.india}</div>
                                    <div className="text-xs font-semibold text-blue-600">US: {spec.averageSalary.us}</div>
                                </div>
                                </div>
                                <p className="text-xs text-gray-600 leading-tight">{spec.averageSalary.description}</p>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}
