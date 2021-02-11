
class Flow {
  flowId;
  steps;

  constructor(flowDefinition) {
    this.flowId = flowDefinition.id;
    this.steps = flowDefinition.steps;
  }

  getStepById(stepId) {
    if (!stepId) {return}
    if (!this.steps) {return}

    return this.steps.find(step => step.id === stepId);
  }

  getFirstStep() {
    if (!this.steps) {return}

    const startStep = this.steps.find(step => step.type === 'start');
    return this.getStepById(startStep.next);
  }

  getId(){
    return this.flowId;
  }
}

module.exports = { Flow };