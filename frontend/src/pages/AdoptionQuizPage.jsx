import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiHome } from 'react-icons/hi';

const AdoptionQuizPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const totalSteps = 6;

  // Quiz questions data
  const questions = [
    {
      id: 1,
      question: 'What type of living space do you have?',
      options: [
        { value: 'apartment', label: 'Apartment/Condo', icon: <HiHome /> },
        { value: 'small_yard', label: 'House with small yard', icon: <HiHome /> },
        { value: 'large_yard', label: 'House with large yard', icon: <HiHome /> },
        { value: 'farm', label: 'Farm/Rural property', icon: <HiHome /> },
      ],
    },
    {
      id: 2,
      question: 'How much time can you dedicate to your pet daily?',
      options: [
        { value: '1-2_hours', label: '1-2 hours', icon: <HiHome /> },
        { value: '3-4_hours', label: '3-4 hours', icon: <HiHome /> },
        { value: '5-6_hours', label: '5-6 hours', icon: <HiHome /> },
        { value: 'full_time', label: 'Full time (work from home)', icon: <HiHome /> },
      ],
    },
    {
      id: 3,
      question: 'What is your activity level?',
      options: [
        { value: 'sedentary', label: 'Sedentary (prefer indoor activities)', icon: <HiHome /> },
        { value: 'moderate', label: 'Moderate (occasional walks)', icon: <HiHome /> },
        { value: 'active', label: 'Active (daily exercise)', icon: <HiHome /> },
        { value: 'very_active', label: 'Very active (outdoor enthusiast)', icon: <HiHome /> },
      ],
    },
    {
      id: 4,
      question: 'Do you have experience with pets?',
      options: [
        { value: 'no_experience', label: 'No experience', icon: <HiHome /> },
        { value: 'some_experience', label: 'Some experience', icon: <HiHome /> },
        { value: 'experienced', label: 'Experienced pet owner', icon: <HiHome /> },
        { value: 'very_experienced', label: 'Very experienced (multiple pets)', icon: <HiHome /> },
      ],
    },
    {
      id: 5,
      question: 'What size pet are you looking for?',
      options: [
        { value: 'small', label: 'Small (under 20 lbs)', icon: <HiHome /> },
        { value: 'medium', label: 'Medium (20-50 lbs)', icon: <HiHome /> },
        { value: 'large', label: 'Large (50-100 lbs)', icon: <HiHome /> },
        { value: 'any', label: 'No preference', icon: <HiHome /> },
      ],
    },
    {
      id: 6,
      question: 'What is your budget for pet care monthly?',
      options: [
        { value: 'under_50', label: 'Under $50', icon: <HiHome /> },
        { value: '50-100', label: '$50 - $100', icon: <HiHome /> },
        { value: '100-200', label: '$100 - $200', icon: <HiHome /> },
        { value: 'over_200', label: 'Over $200', icon: <HiHome /> },
      ],
    },
  ];

  const currentQuestion = questions[currentStep - 1];

  const handleSelectOption = (value) => {
    setAnswers({
      ...answers,
      [currentStep]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete - handle results
      console.log('Quiz completed!', answers);
      // You can navigate to results page or show results
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors duration-200 mb-6"
          >
            <HiArrowLeft className="text-xl" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Pet Compatibility Quiz
            </h1>
            <p className="text-gray-600">Question {currentStep} of {totalSteps}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-orange-50 rounded-2xl p-8 md:p-12">
          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  answers[currentStep] === option.value
                    ? 'border-orange-500 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <div className="text-orange-500 text-2xl">
                  {option.icon}
                </div>
                <span className="text-lg font-medium text-gray-900">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            <HiArrowLeft className="text-lg" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[currentStep]}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              answers[currentStep]
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Submit' : 'Next'}
            <HiArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptionQuizPage;
