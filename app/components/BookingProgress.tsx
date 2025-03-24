'use client';

interface BookingProgressProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  return (
    <div className="w-full py-6 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
          
          {/* Progress Bar */}
          <div 
            className="absolute left-0 top-1/2 h-0.5 bg-red-600 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${index <= currentStep
                    ? 'bg-red-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'
                  }
                  ${index < currentStep ? 'transform scale-95' : ''}
                  ${index === currentStep ? 'ring-4 ring-red-100 dark:ring-red-900/30 transform scale-110' : ''}
                `}>
                  <span className="text-lg">{step.icon}</span>
                </div>

                {/* Step Title */}
                <div className="mt-3 mb-1">
                  <h3 className={`text-sm font-medium text-center
                    ${index <= currentStep
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {step.title}
                  </h3>
                </div>

                {/* Step Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[120px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 