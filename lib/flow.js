
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

  getStartStep() {
    if (!this.steps) {return}

    const startStep = this.steps.find(step => step.type === 'start');
    return startStep;
  }

  getFirstStepVarsIn() {
    const startStep = this.getFirstStep();
    if (startStep.vars && startStep.vars.in) {
      return startStep.vars.in;
    }
  }

  getFirstStep() {
    const startStep = this.getStartStep();
    return this.getStepById(startStep.next);
  }

  getId(){
    return this.flowId;
  }
}

module.exports = { Flow };