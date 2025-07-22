import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReferencePanel = ({ subject, topic, isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState('formulas');

  // Mock reference data based on subject
  const referenceData = {
    formulas: [
      {
        id: 1,
        title: "Quadratic Formula",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        description: "Used to solve quadratic equations of the form ax² + bx + c = 0"
      },
      {
        id: 2,
        title: "Distance Formula",
        formula: "d = √((x₂ - x₁)² + (y₂ - y₁)²)",
        description: "Calculates the distance between two points in a coordinate plane"
      },
      {
        id: 3,
        title: "Slope Formula",
        formula: "m = (y₂ - y₁) / (x₂ - x₁)",
        description: "Determines the slope of a line passing through two points"
      },
      {
        id: 4,
        title: "Area of Circle",
        formula: "A = πr²",
        description: "Calculates the area of a circle with radius r"
      }
    ],
    definitions: [
      {
        id: 1,
        term: "Linear Equation",
        definition: "An equation that makes a straight line when graphed. It has the form y = mx + b, where m is the slope and b is the y-intercept."
      },
      {
        id: 2,
        term: "Coefficient",
        definition: "A numerical factor in a term of an algebraic expression. In 3x², the coefficient is 3."
      },
      {
        id: 3,
        term: "Variable",
        definition: "A symbol (usually a letter) that represents an unknown number or value that can change."
      },
      {
        id: 4,
        term: "Constant",
        definition: "A fixed value that does not change. In the equation y = 2x + 5, the number 5 is a constant."
      }
    ],
    examples: [
      {
        id: 1,
        title: "Solving Linear Equations",
        problem: "Solve for x: 2x + 5 = 13",
        solution: `Step 1: Subtract 5 from both sides\n2x + 5 - 5 = 13 - 5\n2x = 8\n\nStep 2: Divide both sides by 2\n2x ÷ 2 = 8 ÷ 2\nx = 4`
      },
      {
        id: 2,
        title: "Finding Slope",
        problem: "Find the slope between points (2, 3) and (6, 11)",
        solution: `Using the slope formula: m = (y₂ - y₁) / (x₂ - x₁)\n\nm = (11 - 3) / (6 - 2)\nm = 8 / 4\nm = 2`
      }
    ]
  };

  const tabs = [
    { id: 'formulas', label: 'Formulas', icon: 'Calculator' },
    { id: 'definitions', label: 'Definitions', icon: 'BookOpen' },
    { id: 'examples', label: 'Examples', icon: 'FileText' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'formulas':
        return (
          <div className="space-y-4">
            {referenceData.formulas.map((item) => (
              <div key={item.id} className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                <div className="bg-background border rounded p-3 mb-2 font-mono text-sm">
                  {item.formula}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        );

      case 'definitions':
        return (
          <div className="space-y-4">
            {referenceData.definitions.map((item) => (
              <div key={item.id} className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">{item.term}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-4">
            {referenceData.examples.map((item) => (
              <div key={item.id} className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">{item.title}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Problem:</p>
                    <div className="bg-background border rounded p-2 text-sm">
                      {item.problem}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Solution:</p>
                    <div className="bg-background border rounded p-2 text-sm whitespace-pre-line">
                      {item.solution}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop Panel */}
      <div className={`hidden lg:block fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-card border-l border-border transform transition-transform duration-300 ease-in-out z-30 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Reference</h3>
            <p className="text-sm text-muted-foreground">{topic}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={onToggle}
          className="w-12 h-12 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200"
        >
          <Icon name="BookOpen" size={20} />
        </Button>
      </div>

      {/* Mobile Modal */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-card rounded-t-2xl shadow-elevation-3 animate-slide-in-up max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Reference</h3>
                <p className="text-sm text-muted-foreground">{topic}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Mobile Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderContent()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Toggle Button */}
      {!isVisible && (
        <div className="hidden lg:block fixed top-1/2 right-0 transform -translate-y-1/2 z-40">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggle}
            className="rounded-l-lg rounded-r-none shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200"
            iconName="ChevronLeft"
            iconSize={16}
          >
            Reference
          </Button>
        </div>
      )}
    </>
  );
};

export default ReferencePanel;