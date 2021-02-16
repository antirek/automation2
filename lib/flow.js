
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

    const startStep = this.steps.find(step => step.id === 'start');
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

  getNodes(){
    return this.steps.map(step => {
      return {
        id: step.id,
        type: 'server',
        label: step.worker,
      }
    })
  }

  getEdges(){
    const edges = [];
    this.steps.map(step => {
      if (step.next) {
        edges.push({
          source: step.id,
          target: step.next,
        });
      } else if (step.nextVariants) {
        for (const varq in step.nextVariants) {
          edges.push({
            source: step.id,
            target: step.nextVariants[varq],
          })
        }       
      }
    });
    return edges;
  }
}

module.exports = { Flow };