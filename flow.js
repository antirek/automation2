const flowDefinitions = require("./flowDefinitions");

class Flow {
  flowId;
  steps;

  constructor(flowDefinition) {
    this.flowId = flowDefinition.id;
    this.steps = flowDefinition.steps;
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

/*
class StepTask {
  flowDefinition;
  stepTaskId;
  taskId;
  input;
  result;
  step;
  _next;

  constructor({flowDefinition, taskId, step, input}) {
    this.flowDefinition = flowDefinition;
    this.taskId = taskId;
    this.step = step;
    this.input = input;
  }

  setNext(next) {
    if (this.step.type === 'selector') {
      this._next = next;
    } else {
      throw Error('cant change next');
    }
  }

  getNext() {
    if (this.step.type === 'selector') {
      return this._next;
    } else {
      return this.step.next;
    }
  }
}

*/

module.exports = { Flow };