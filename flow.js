class Flow {
  flowId;
  steps;

  constructor(flowDefinition) {
    this.id = flowDefinition.flowId;
    this.steps = flowDefinition.step;
  }

  getStepById(stepId) {
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

module.exports = {Flow};