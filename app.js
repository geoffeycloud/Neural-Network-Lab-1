// Logic Gates Data
const logicGates = {
  AND: {
    truthTable: [
      { input: [0, 0], output: 0 },
      { input: [0, 1], output: 0 },
      { input: [1, 0], output: 0 },
      { input: [1, 1], output: 1 }
    ],
    weights: { w1: 0.5, w2: 0.5, bias: -0.8 },
    description: "Output 1 only when both inputs are 1"
  },
  OR: {
    truthTable: [
      { input: [0, 0], output: 0 },
      { input: [0, 1], output: 1 },
      { input: [1, 0], output: 1 },
      { input: [1, 1], output: 1 }
    ],
    weights: { w1: 0.5, w2: 0.5, bias: -0.3 },
    description: "Output 1 when either or both inputs are 1"
  },
  NAND: {
    truthTable: [
      { input: [0, 0], output: 1 },
      { input: [0, 1], output: 1 },
      { input: [1, 0], output: 1 },
      { input: [1, 1], output: 0 }
    ],
    weights: { w1: -0.5, w2: -0.5, bias: 0.8 },
    description: "Output 0 only when both inputs are 1 (opposite of AND)"
  },
  XOR: {
    truthTable: [
      { input: [0, 0], output: 0 },
      { input: [0, 1], output: 1 },
      { input: [1, 0], output: 1 },
      { input: [1, 1], output: 0 }
    ],
    weights: null,
    description: "Output 1 when inputs differ. Cannot be solved with single-layer perceptron"
  }
};

// State management
const state = {
  simulator: {
    x1: 0.5,
    x2: 0.5,
    w1: 0.5,
    w2: 0.5,
    bias: -0.8,
    activation: 'step'
  },
  gates: {
    currentGate: 'AND',
    x1: 0,
    x2: 0
  }
};

// Tab Navigation
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Update active states
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      // Initialize visualizations when tabs are opened
      if (targetTab === 'activation') {
        drawActivationFunctions();
      }
      if (targetTab === 'xor') {
        drawXORVisualization();
      }
    });
  });
}

// Activation Functions
function stepFunction(z) {
  return z >= 0 ? 1 : 0;
}

function signFunction(z) {
  return z >= 0 ? 1 : -1;
}

function sigmoidFunction(z) {
  return 1 / (1 + Math.exp(-z));
}

function tanhFunction(z) {
  return Math.tanh(z);
}

function reluFunction(z) {
  return Math.max(0, z);
}

function leakyReluFunction(z) {
  return z > 0 ? z : 0.01 * z;
}

function swishFunction(z) {
  return z / (1 + Math.exp(-z));
}

function softmaxFunction(z) {
  return Math.exp(z);
}

// Warning zones configuration
const warningZones = {
  weights: { safe: [-2, 2], experimental: [-5, 5], dangerous: [-10, 10] },
  bias: { safe: [-2, 2], experimental: [-5, 5], dangerous: [-10, 10] },
  learningRate: { safe: [0.0001, 0.1], experimental: [0.1, 1.0], dangerous: [1.0, 5.0] },
  dropout: { safe: [0.2, 0.5], experimental: [0.5, 0.8], dangerous: [0.8, 0.95] },
  lambda: { safe: [0, 0.1], experimental: [0.1, 1.0], dangerous: [1.0, 10.0] },
  momentum: { safe: [0.8, 1.0], experimental: [0, 0.8], dangerous: [1.0, 1.5] },
  depth: { safe: [1, 10], experimental: [10, 20], dangerous: [20, 50] },
  weightScale: { safe: [0.1, 1.0], experimental: [1.0, 2.0], dangerous: [2.0, 10.0] }
};

function checkWarningZone(value, param) {
  const zones = warningZones[param];
  if (!zones) return 'safe';
  
  const absValue = Math.abs(value);
  if (param === 'momentum' && value > 1.0) return 'dangerous';
  if (param === 'learningRate' && value > 1.0) return 'dangerous';
  if (param === 'dropout' && value > 0.8) return 'dangerous';
  if (param === 'lambda' && value > 5.0) return 'dangerous';
  if (param === 'depth' && value > 20) return 'dangerous';
  if (param === 'weightScale' && value > 2.0) return 'dangerous';
  
  if (absValue > Math.abs(zones.experimental[1])) return 'experimental';
  if (absValue > Math.abs(zones.safe[1])) return 'experimental';
  return 'safe';
}

function updateWarningIndicator(elementId, value, param) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  const zone = checkWarningZone(value, param);
  el.className = 'range-warning ' + zone;
  
  const messages = {
    weights: {
      dangerous: '⚠️ EXTREME!',
      experimental: '💡 Experimental',
      safe: '✓ Safe'
    },
    bias: {
      dangerous: '⚠️ EXTREME!',
      experimental: '💡 Experimental',
      safe: '✓ Safe'
    },
    learningRate: {
      dangerous: '⚠️ DIVERGENCE RISK!',
      experimental: '⚠️ May oscillate',
      safe: '✓ Safe'
    },
    dropout: {
      dangerous: '⚠️ TOO HIGH!',
      experimental: '💡 High dropout',
      safe: '✓ Safe'
    },
    lambda: {
      dangerous: '⚠️ UNDERFIT RISK!',
      experimental: '💡 Strong regularization',
      safe: '✓ Safe'
    },
    momentum: {
      dangerous: '⚠️ UNSTABLE!',
      experimental: '💡 Low momentum',
      safe: '✓ Safe'
    },
    depth: {
      dangerous: '⚠️ VANISHING GRADIENTS!',
      experimental: '💡 Deep network',
      safe: '✓ Safe'
    },
    weightScale: {
      dangerous: '⚠️ EXPLOSION RISK!',
      experimental: '💡 Large weights',
      safe: '✓ Safe'
    }
  };
  
  const msg = messages[param] && messages[param][zone];
  if (msg) {
    el.textContent = msg;
    el.style.display = 'inline-block';
  } else {
    el.style.display = 'none';
  }
}

// Comprehensive Experiment Templates
const experimentTemplates = {
  'gradient-explosion': {
    name: 'Gradient Explosion',
    section: 'gradient-descent',
    params: {
      'learning-rate': 5.0
    },
    message: '💥 GRADIENT EXPLOSION: Learning rate is dangerously high (5.0). Watch optimization diverge!',
    explanation: 'Each gradient step overshoots the minimum, causing the loss to explode to infinity.'
  },
  'gradient-vanishing': {
    name: 'Gradient Vanishing',
    section: 'gradient-problems',
    params: {
      'grad-activation': 'sigmoid',
      'network-depth': 30,
      'weight-scale': 1.0
    },
    message: '📉 GRADIENT VANISHING: 30-layer network with sigmoid activation. Watch gradients disappear!',
    explanation: 'Sigmoid max derivative is 0.25. After 30 layers: 0.25^30 ≈ 0 (gradients vanish).'
  },
  'over-regularized': {
    name: 'Over-Regularized',
    section: 'overfitting',
    params: {
      'l2-lambda': 10.0,
      'dropout-rate': 90
    },
    message: '🔒 OVER-REGULARIZED: Lambda=10.0 and 90% dropout. Model is too constrained to learn!',
    explanation: 'Excessive regularization prevents the model from fitting even the training data (underfitting).'
  },
  'unstable-momentum': {
    name: 'Unstable Momentum',
    section: 'optimizers',
    params: {
      'tune-momentum': 1.2,
      'tune-lr': 0.5
    },
    message: '🌀 UNSTABLE MOMENTUM: Momentum > 1.0 amplifies velocity instead of dampening. Chaos ensues!',
    explanation: 'Momentum coefficient > 1.0 causes divergent oscillations in the optimization path.'
  },
  'sigmoid-saturation': {
    name: 'Sigmoid Saturation',
    section: 'simulator',
    params: {
      'activation-select': 'sigmoid',
      'w1-input': 10.0,
      'w2-input': 10.0,
      'bias-input': 5.0,
      'x1-input': 1.0,
      'x2-input': 1.0
    },
    message: '📊 SIGMOID SATURATION: Weighted sum = 25. Sigmoid(25) ≈ 1.0. Gradient ≈ 0!',
    explanation: 'When sigmoid output is near 1.0, the derivative approaches 0, stopping learning.'
  },
  'relu-dead': {
    name: 'Dead ReLU Neurons',
    section: 'simulator',
    params: {
      'activation-select': 'relu',
      'w1-input': -10.0,
      'w2-input': -10.0,
      'bias-input': -5.0,
      'x1-input': 1.0,
      'x2-input': 1.0
    },
    message: '💀 DEAD ReLU: Weighted sum = -25. ReLU(-25) = 0. Gradient = 0. Neurons cannot recover!',
    explanation: 'ReLU outputs 0 for negative inputs, with 0 gradient. Neurons get stuck in dead state.'
  },
  'extreme-dropout': {
    name: 'Extreme Dropout',
    section: 'overfitting',
    params: {
      'dropout-rate': 95
    },
    message: '🎲 EXTREME DROPOUT: 95% of neurons dropped! Only 5% active - learning is impossible.',
    explanation: 'With 95% dropout, the network has insufficient capacity to learn patterns.'
  },
  'glacial-learning': {
    name: 'Glacial Learning',
    section: 'gradient-descent',
    params: {
      'learning-rate': 0.00001
    },
    message: '🐌 GLACIAL LEARNING: Learning rate 0.00001 is tiny. Convergence takes thousands of iterations!',
    explanation: 'Extremely small learning rate means the optimizer takes microscopic steps toward the minimum.'
  },
  'overfitting-demo': {
    name: 'Overfitting Demo',
    section: 'overfitting',
    params: {
      'overfit-complexity': 15,
      'overfit-data': 50
    },
    message: '📈 OVERFITTING: Complex model (15 layers) with small dataset (50 samples). Perfect for overfitting!',
    explanation: 'High model complexity with insufficient data leads to memorization instead of generalization.'
  }
};

// Apply experiment template
function applyExperimentTemplate(templateId) {
  const template = experimentTemplates[templateId];
  if (!template) return;

  // Navigate to the section
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    if (btn.dataset.tab === template.section) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  tabContents.forEach(content => {
    if (content.id === template.section) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Apply parameters with slight delay to ensure DOM is ready
  setTimeout(() => {
    Object.keys(template.params).forEach(paramId => {
      const element = document.getElementById(paramId);
      if (element) {
        element.value = template.params[paramId];
        // Trigger input event to update displays
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Add highlight effect
        element.style.transition = 'all 0.3s ease';
        element.style.boxShadow = '0 0 20px var(--color-primary)';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }
    });
    
    // Show status message
    const statusEl = document.getElementById('template-status');
    const messageEl = document.getElementById('template-message');
    if (statusEl && messageEl) {
      messageEl.innerHTML = `<strong>${template.message}</strong><br><br>${template.explanation}`;
      statusEl.style.display = 'block';
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
}

// Old experiment template function for backward compatibility
function applyExperimentTemplate_OLD(template) {
  const x1Input = document.getElementById('x1-input');
  const x2Input = document.getElementById('x2-input');
  const w1Input = document.getElementById('w1-input');
  const w2Input = document.getElementById('w2-input');
  const biasInput = document.getElementById('bias-input');
  const activationSelect = document.getElementById('activation-select');
  
  if (!x1Input) return;
  
  const templates = {
    saturation: {
      x1: 1, x2: 1, w1: 10, w2: 10, bias: 5, activation: 'sigmoid',
      message: '🔥 Sigmoid completely saturated at 1.0! Notice how output barely changes.'
    },
    'dead-relu': {
      x1: 1, x2: 1, w1: -10, w2: -10, bias: -5, activation: 'relu',
      message: '☠️ All neurons dead! ReLU output is always 0 with large negative values.'
    },
    'extreme-weights': {
      x1: 0.5, x2: 0.5, w1: -8, w2: 8, bias: 0, activation: 'tanh',
      message: '🌀 Extreme opposing weights create interesting decision boundaries!'
    },
    'negative-inputs': {
      x1: -3, x2: -4, w1: 2, w2: 2, bias: 1, activation: 'leaky_relu',
      message: '➖ Testing with negative inputs - see how different activations respond!'
    },
    reset: {
      x1: 0.5, x2: 0.5, w1: 0.5, w2: 0.5, bias: -0.8, activation: 'step',
      message: '✓ Reset to safe default values'
    }
  };
  
  const t = templates[template];
  if (!t) return;
  
  x1Input.value = t.x1;
  x2Input.value = t.x2;
  w1Input.value = t.w1;
  w2Input.value = t.w2;
  biasInput.value = t.bias;
  activationSelect.value = t.activation;
  
  // Trigger update
  x1Input.dispatchEvent(new Event('input'));
  
  // Show message
  alert(t.message);
}

// Simulator Functions
function initSimulator() {
  // Input controls
  const x1Input = document.getElementById('x1-input');
  const x2Input = document.getElementById('x2-input');
  const w1Input = document.getElementById('w1-input');
  const w2Input = document.getElementById('w2-input');
  const biasInput = document.getElementById('bias-input');
  const activationSelect = document.getElementById('activation-select');

  const updateSimulator = () => {
    state.simulator.x1 = parseFloat(x1Input.value);
    state.simulator.x2 = parseFloat(x2Input.value);
    state.simulator.w1 = parseFloat(w1Input.value);
    state.simulator.w2 = parseFloat(w2Input.value);
    state.simulator.bias = parseFloat(biasInput.value);
    state.simulator.activation = activationSelect.value;

    // Update displays
    document.getElementById('x1-value').textContent = state.simulator.x1.toFixed(1);
    document.getElementById('x2-value').textContent = state.simulator.x2.toFixed(1);
    document.getElementById('w1-value').textContent = state.simulator.w1.toFixed(1);
    document.getElementById('w2-value').textContent = state.simulator.w2.toFixed(1);
    document.getElementById('bias-value').textContent = state.simulator.bias.toFixed(1);

    // Update warning indicators
    updateWarningIndicator('w1-warning', state.simulator.w1, 'weights');
    updateWarningIndicator('w2-warning', state.simulator.w2, 'weights');
    updateWarningIndicator('bias-warning', state.simulator.bias, 'bias');

    calculateOutput();
    drawDecisionBoundary();
  };

  x1Input.addEventListener('input', updateSimulator);
  x2Input.addEventListener('input', updateSimulator);
  w1Input.addEventListener('input', updateSimulator);
  w2Input.addEventListener('input', updateSimulator);
  biasInput.addEventListener('input', updateSimulator);
  activationSelect.addEventListener('change', updateSimulator);

  // Template buttons (old style)
  const templateBtns = document.querySelectorAll('.template-btn');
  templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const template = btn.dataset.template;
      applyExperimentTemplate_OLD(template);
    });
  });
  
  // New template cards
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const templateId = card.dataset.template;
      applyExperimentTemplate(templateId);
    });
  });
  
  // Reset template button
  const resetTemplateBtn = document.getElementById('reset-template');
  if (resetTemplateBtn) {
    resetTemplateBtn.addEventListener('click', () => {
      // Navigate back to experiments tab
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabBtns.forEach(btn => {
        if (btn.dataset.tab === 'experiments') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      
      tabContents.forEach(content => {
        if (content.id === 'experiments') {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
      
      // Hide status
      const statusEl = document.getElementById('template-status');
      if (statusEl) statusEl.style.display = 'none';
    });
  }

  // Initial calculation
  updateSimulator();
}

function calculateOutput() {
  const { x1, x2, w1, w2, bias, activation } = state.simulator;

  // Calculate weighted sum
  const z = w1 * x1 + w2 * x2 + bias;

  // Apply activation function
  let output;
  let activationName;
  let activationFormula;
  
  if (activation === 'step') {
    output = stepFunction(z);
    activationName = 'step';
    activationFormula = `f(z) = step(${z.toFixed(2)}) = ${output}`;
  } else if (activation === 'sign') {
    output = signFunction(z);
    activationName = 'sign';
    activationFormula = `f(z) = sign(${z.toFixed(2)}) = ${output}`;
  } else if (activation === 'sigmoid') {
    output = sigmoidFunction(z);
    activationName = 'sigmoid';
    activationFormula = `f(z) = 1/(1 + e^(-${z.toFixed(2)})) = ${output.toFixed(3)}`;
  } else if (activation === 'tanh') {
    output = tanhFunction(z);
    activationName = 'tanh';
    activationFormula = `f(z) = tanh(${z.toFixed(2)}) = ${output.toFixed(3)}`;
  } else if (activation === 'relu') {
    output = reluFunction(z);
    activationName = 'relu';
    activationFormula = `f(z) = max(0, ${z.toFixed(2)}) = ${output.toFixed(3)}`;
  } else if (activation === 'leaky_relu') {
    output = leakyReluFunction(z);
    activationName = 'leaky_relu';
    activationFormula = `f(z) = ${z > 0 ? z.toFixed(2) : '0.01×' + z.toFixed(2)} = ${output.toFixed(3)}`;
  } else if (activation === 'swish') {
    output = swishFunction(z);
    activationName = 'swish';
    activationFormula = `f(z) = ${z.toFixed(2)} × sigmoid(${z.toFixed(2)}) = ${output.toFixed(3)}`;
  } else if (activation === 'softmax') {
    output = softmaxFunction(z);
    activationName = 'softmax';
    activationFormula = `f(z) = e^(${z.toFixed(2)}) = ${output.toFixed(3)}`;
  }

  // Update display
  document.getElementById('calc-formula').textContent = 
    `z = ${w1.toFixed(1)} × ${x1} + ${w2.toFixed(1)} × ${x2} + (${bias.toFixed(1)}) = ${z.toFixed(2)}`;
  
  document.getElementById('activation-formula').textContent = activationFormula;
  
  // Format output based on activation type
  if (activation === 'step' || activation === 'sign') {
    document.getElementById('output-value').textContent = output;
  } else {
    document.getElementById('output-value').textContent = output.toFixed(3);
  }

  const neuronStatus = document.getElementById('neuron-status');
  const statusText = document.getElementById('status-text');

  // Handle activation status display
  if (activation === 'step' || activation === 'sign') {
    // Binary activation
    if ((activation === 'step' && output === 1) || (activation === 'sign' && output === 1)) {
      neuronStatus.className = 'neuron-status active';
      statusText.textContent = '✓ Neuron Activated';
    } else {
      neuronStatus.className = 'neuron-status inactive';
      statusText.textContent = '✗ Neuron NOT Activated';
    }
  } else if (activation === 'sigmoid') {
    // Sigmoid: 0 to 1
    if (output > 0.7) {
      neuronStatus.className = 'neuron-status active';
      statusText.textContent = `✓ Strong Activation (${(output * 100).toFixed(1)}%)`;
    } else if (output > 0.3) {
      neuronStatus.className = 'neuron-status partial';
      statusText.textContent = `~ Partial Activation (${(output * 100).toFixed(1)}%)`;
    } else {
      neuronStatus.className = 'neuron-status inactive';
      statusText.textContent = `✗ Low Activation (${(output * 100).toFixed(1)}%)`;
    }
  } else if (activation === 'tanh') {
    // Tanh: -1 to 1
    if (output > 0.5) {
      neuronStatus.className = 'neuron-status active';
      statusText.textContent = `✓ Positive Activation (${output.toFixed(3)})`;
    } else if (output > -0.5) {
      neuronStatus.className = 'neuron-status partial';
      statusText.textContent = `~ Near Zero (${output.toFixed(3)})`;
    } else {
      neuronStatus.className = 'neuron-status inactive';
      statusText.textContent = `✗ Negative Activation (${output.toFixed(3)})`;
    }
  } else if (activation === 'relu' || activation === 'leaky_relu') {
    // ReLU family
    if (output > 0.5) {
      neuronStatus.className = 'neuron-status active';
      statusText.textContent = `✓ Active (${output.toFixed(3)})`;
    } else if (output > 0) {
      neuronStatus.className = 'neuron-status partial';
      statusText.textContent = `~ Weakly Active (${output.toFixed(3)})`;
    } else {
      neuronStatus.className = 'neuron-status inactive';
      statusText.textContent = `✗ Inactive (${output.toFixed(3)})`;
    }
  } else if (activation === 'swish') {
    // Swish: can be negative or positive
    if (output > 0.3) {
      neuronStatus.className = 'neuron-status active';
      statusText.textContent = `✓ Positive Output (${output.toFixed(3)})`;
    } else if (output > -0.3) {
      neuronStatus.className = 'neuron-status partial';
      statusText.textContent = `~ Near Zero (${output.toFixed(3)})`;
    } else {
      neuronStatus.className = 'neuron-status inactive';
      statusText.textContent = `✗ Negative Output (${output.toFixed(3)})`;
    }
  } else if (activation === 'softmax') {
    // Softmax: always positive exponential
    if (output > 2) {
      neuronStatus.className = 'neuron-status active';
      statusText.textContent = `✓ High Probability (${output.toFixed(3)})`;
    } else if (output > 0.5) {
      neuronStatus.className = 'neuron-status partial';
      statusText.textContent = `~ Moderate (${output.toFixed(3)})`;
    } else {
      neuronStatus.className = 'neuron-status inactive';
      statusText.textContent = `✗ Low Probability (${output.toFixed(3)})`;
    }
  }
}

function drawDecisionBoundary() {
  const canvas = document.getElementById('decision-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Get background color from CSS
  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();
  const successColor = styles.getPropertyValue('--color-success').trim();

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.fillText('x₁', width - padding + 10, height - padding + 5);
  ctx.fillText('x₂', padding - 10, padding - 10);
  ctx.fillText('0', padding - 10, height - padding + 15);
  ctx.fillText('1', width - padding - 5, height - padding + 15);
  ctx.fillText('1', padding - 15, padding + 5);

  // Draw decision boundary
  const { w1, w2, bias } = state.simulator;
  
  if (w2 !== 0) {
    // Calculate line points: w1*x1 + w2*x2 + bias = 0
    // x2 = -(w1*x1 + bias) / w2
    const x1_start = 0;
    const x2_start = -(w1 * x1_start + bias) / w2;
    const x1_end = 1;
    const x2_end = -(w1 * x1_end + bias) / w2;

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      padding + x1_start * plotWidth,
      height - padding - x2_start * plotHeight
    );
    ctx.lineTo(
      padding + x1_end * plotWidth,
      height - padding - x2_end * plotHeight
    );
    ctx.stroke();
  }

  // Draw input points
  const points = [
    [0, 0], [0, 1], [1, 0], [1, 1]
  ];

  points.forEach(([x1, x2]) => {
    const z = w1 * x1 + w2 * x2 + bias;
    let output, isActive;
    
    if (state.simulator.activation === 'step') {
      output = stepFunction(z);
      isActive = output === 1;
    } else if (state.simulator.activation === 'sign') {
      output = signFunction(z);
      isActive = output === 1;
    } else if (state.simulator.activation === 'sigmoid') {
      output = sigmoidFunction(z);
      isActive = output > 0.5;
    } else if (state.simulator.activation === 'tanh') {
      output = tanhFunction(z);
      isActive = output > 0;
    } else if (state.simulator.activation === 'relu') {
      output = reluFunction(z);
      isActive = output > 0;
    } else if (state.simulator.activation === 'leaky_relu') {
      output = leakyReluFunction(z);
      isActive = output > 0;
    } else if (state.simulator.activation === 'swish') {
      output = swishFunction(z);
      isActive = output > 0;
    } else if (state.simulator.activation === 'softmax') {
      output = softmaxFunction(z);
      isActive = output > 1;
    }
    
    const px = padding + x1 * plotWidth;
    const py = height - padding - x2 * plotHeight;

    ctx.fillStyle = isActive ? successColor : errorColor;
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Highlight current input
    if (x1 === state.simulator.x1 && x2 === state.simulator.x2) {
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });
}

// Logic Gates Functions
function initLogicGates() {
  const gateBtns = document.querySelectorAll('.gate-btn');
  
  gateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const gate = btn.dataset.gate;
      
      gateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      state.gates.currentGate = gate;
      updateGateDisplay();
    });
  });

  // Test buttons
  const testBtns = document.querySelectorAll('.test-btn');
  testBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.dataset.input;
      const value = parseInt(btn.dataset.value);
      
      if (input === 'gate-x1') {
        state.gates.x1 = value;
        // Update button states
        document.querySelectorAll('[data-input="gate-x1"]').forEach(b => b.classList.remove('selected'));
      } else {
        state.gates.x2 = value;
        document.querySelectorAll('[data-input="gate-x2"]').forEach(b => b.classList.remove('selected'));
      }
      btn.classList.add('selected');
      
      calculateGateOutput();
    });
  });

  updateGateDisplay();
  calculateGateOutput();
}

function updateGateDisplay() {
  const gate = logicGates[state.gates.currentGate];
  
  document.getElementById('gate-title').textContent = `${state.gates.currentGate} Gate`;
  document.getElementById('gate-description').textContent = gate.description;
  
  if (gate.weights) {
    document.getElementById('gate-weights-display').textContent = 
      `w₁ = ${gate.weights.w1}, w₂ = ${gate.weights.w2}, bias = ${gate.weights.bias}`;
  } else {
    document.getElementById('gate-weights-display').textContent = 
      'Requires multi-layer perceptron (no simple weights)';
  }

  // Update truth table
  const tbody = document.getElementById('truth-table-body');
  tbody.innerHTML = '';
  
  gate.truthTable.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.input[0]}</td>
      <td>${row.input[1]}</td>
      <td><span class="output-badge output-${row.output}">${row.output}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateGateOutput() {
  const gate = logicGates[state.gates.currentGate];
  const { x1, x2 } = state.gates;
  
  let output;
  if (gate.weights) {
    const { w1, w2, bias } = gate.weights;
    const z = w1 * x1 + w2 * x2 + bias;
    output = stepFunction(z);
    
    document.getElementById('gate-calc').textContent = 
      `z = ${w1}×${x1} + ${w2}×${x2} + (${bias}) = ${z.toFixed(2)}`;
  } else {
    // XOR - lookup from truth table
    const row = gate.truthTable.find(r => r.input[0] === x1 && r.input[1] === x2);
    output = row ? row.output : 0;
    document.getElementById('gate-calc').textContent = 
      `XOR requires multi-layer network (see XOR Problem tab)`;
  }
  
  const outputBadge = document.getElementById('gate-output');
  outputBadge.textContent = output;
  outputBadge.className = `output-badge output-${output}`;
}

// Activation Function Visualizations
function drawActivationFunctions() {
  drawSignFunction();
  drawStepFunction();
  drawSigmoidFunction();
  drawTanhFunction();
  drawReluFunction();
  drawLeakyReluFunction();
  drawSwishFunction();
  drawSoftmaxFunction();
}

function drawSignFunction() {
  const canvas = document.getElementById('sign-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, signFunction, -1, 1, 'Sign Function');
}

function drawStepFunction() {
  const canvas = document.getElementById('step-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, stepFunction, 0, 1, 'Step Function');
}

function drawSigmoidFunction() {
  const canvas = document.getElementById('sigmoid-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, sigmoidFunction, 0, 1, 'Sigmoid Function');
}

function drawTanhFunction() {
  const canvas = document.getElementById('tanh-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, tanhFunction, -1, 1, 'Tanh Function');
}

function drawReluFunction() {
  const canvas = document.getElementById('relu-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, reluFunction, 0, 5, 'ReLU Function');
}

function drawLeakyReluFunction() {
  const canvas = document.getElementById('leaky-relu-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, leakyReluFunction, -0.5, 5, 'Leaky ReLU Function');
}

function drawSwishFunction() {
  const canvas = document.getElementById('swish-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, swishFunction, -1, 5, 'Swish Function');
}

function drawSoftmaxFunction() {
  const canvas = document.getElementById('softmax-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  drawActivationGraph(ctx, canvas, softmaxFunction, 0, 10, 'Softmax Function');
}

function drawActivationGraph(ctx, canvas, func, minY, maxY, title) {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 30;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();

  // Clear and fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  // X-axis
  const yZero = height - padding - ((0 - minY) / (maxY - minY)) * plotHeight;
  ctx.moveTo(padding, yZero);
  ctx.lineTo(width - padding, yZero);
  // Y-axis
  ctx.moveTo(width / 2, padding);
  ctx.lineTo(width / 2, height - padding);
  ctx.stroke();

  // Draw function
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  const xMin = -5;
  const xMax = 5;
  const step = 0.05;

  let firstPoint = true;
  for (let x = xMin; x <= xMax; x += step) {
    const y = func(x);
    // Clamp y values for display
    const clampedY = Math.max(minY, Math.min(maxY, y));
    const px = padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const py = height - padding - ((clampedY - minY) / (maxY - minY)) * plotHeight;

    if (firstPoint) {
      ctx.moveTo(px, py);
      firstPoint = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '10px sans-serif';
  ctx.fillText('0', width / 2 - 5, yZero + 15);
  ctx.fillText(minY.toString(), width / 2 - 15, height - padding + 5);
  ctx.fillText(maxY.toString(), width / 2 - 15, padding + 5);
}

// Interactive Activation Explorer
function initActivationExplorer() {
  const zInput = document.getElementById('act-z-input');
  if (!zInput) return;

  const updateActivation = () => {
    const z = parseFloat(zInput.value);
    document.getElementById('act-z-value').textContent = z.toFixed(1);

    const signResult = signFunction(z);
    const stepResult = stepFunction(z);
    const sigmoidResult = sigmoidFunction(z);
    const tanhResult = tanhFunction(z);
    const reluResult = reluFunction(z);
    const leakyReluResult = leakyReluFunction(z);
    const swishResult = swishFunction(z);
    const softmaxResult = softmaxFunction(z);

    document.getElementById('sign-result').textContent = signResult;
    document.getElementById('step-result').textContent = stepResult;
    document.getElementById('sigmoid-result').textContent = sigmoidResult.toFixed(3);
    document.getElementById('tanh-result').textContent = tanhResult.toFixed(3);
    document.getElementById('relu-result').textContent = reluResult.toFixed(3);
    document.getElementById('leaky-relu-result').textContent = leakyReluResult.toFixed(3);
    document.getElementById('swish-result').textContent = swishResult.toFixed(3);
    document.getElementById('softmax-result').textContent = softmaxResult.toFixed(3);
  };

  zInput.addEventListener('input', updateActivation);
  updateActivation();
}

// XOR Visualization
function drawXORVisualization() {
  const canvas = document.getElementById('xor-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();
  const successColor = styles.getPropertyValue('--color-success').trim();

  // Clear and fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '14px sans-serif';
  ctx.fillText('x₁', width - padding + 10, height - padding + 5);
  ctx.fillText('x₂', padding - 10, padding - 15);
  ctx.fillText('0', padding - 15, height - padding + 20);
  ctx.fillText('1', width - padding - 5, height - padding + 20);
  ctx.fillText('1', padding - 20, padding + 5);

  // Draw XOR points
  const xorPoints = [
    { x: 0, y: 0, output: 0 },
    { x: 0, y: 1, output: 1 },
    { x: 1, y: 0, output: 1 },
    { x: 1, y: 1, output: 0 }
  ];

  xorPoints.forEach(point => {
    const px = padding + point.x * plotWidth;
    const py = height - padding - point.y * plotHeight;

    ctx.fillStyle = point.output === 1 ? successColor : errorColor;
    ctx.beginPath();
    ctx.arc(px, py, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(point.output.toString(), px, py);
  });

  // Draw attempted separation lines (to show it can't be done)
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  // Try vertical line
  ctx.beginPath();
  ctx.moveTo(padding + plotWidth / 2, padding);
  ctx.lineTo(padding + plotWidth / 2, height - padding);
  ctx.stroke();

  // Try horizontal line
  ctx.beginPath();
  ctx.moveTo(padding, padding + plotHeight / 2);
  ctx.lineTo(width - padding, padding + plotHeight / 2);
  ctx.stroke();

  ctx.setLineDash([]);
}

// Loss Functions State
const lossState = {
  pred: [0.9, 0.2, 0.8],
  actual: [1.0, 0.0, 1.0]
};

// Gradient Descent State
const gdState = {
  algorithm: 'mbgd',
  learningRate: 0.1,
  position: [0, 0],
  path: [],
  isRunning: false,
  iteration: 0
};

// Backpropagation State
const backpropState = {
  stage: 0,
  values: {
    x: 1.0,
    w1: 0.5,
    b1: 0.2,
    z1: 0,
    a1: 0,
    w2: 0.8,
    b2: -0.3,
    z2: 0,
    a2: 0,
    target: 1.0,
    loss: 0
  }
};

// Gradient Problems State
const gradProblemState = {
  activation: 'sigmoid',
  depth: 5,
  weightScale: 1.0
};

// Loss Function Calculations
function calculateMSE(predictions, actuals) {
  let sum = 0;
  for (let i = 0; i < predictions.length; i++) {
    sum += Math.pow(predictions[i] - actuals[i], 2);
  }
  return sum / predictions.length;
}

function calculateCrossEntropy(predictions, actuals) {
  let sum = 0;
  const epsilon = 1e-10; // Prevent log(0)
  for (let i = 0; i < predictions.length; i++) {
    // Normalize predictions to [0, 1] range if outside
    let p = predictions[i];
    if (p < 0 || p > 1) {
      // Apply sigmoid to normalize
      p = 1 / (1 + Math.exp(-p));
    }
    p = Math.max(epsilon, Math.min(1 - epsilon, p));
    
    // Handle different actual values
    if (actuals[i] > 0.5) {
      sum += -Math.log(p);
    } else if (actuals[i] < -0.5) {
      sum += -Math.log(1 - p);
    } else {
      sum += -Math.log(1 - p);
    }
  }
  return sum;
}

// Initialize Loss Functions
function initLossFunctions() {
  const pred1 = document.getElementById('pred1');
  const pred2 = document.getElementById('pred2');
  const pred3 = document.getElementById('pred3');
  const actual1 = document.getElementById('actual1');
  const actual2 = document.getElementById('actual2');
  const actual3 = document.getElementById('actual3');

  if (!pred1) return;

  const updateLoss = () => {
    lossState.pred = [
      parseFloat(pred1.value),
      parseFloat(pred2.value),
      parseFloat(pred3.value)
    ];
    lossState.actual = [
      parseFloat(actual1.value),
      parseFloat(actual2.value),
      parseFloat(actual3.value)
    ];

    // Update displays
    document.getElementById('pred1-val').textContent = lossState.pred[0].toFixed(2);
    document.getElementById('pred2-val').textContent = lossState.pred[1].toFixed(2);
    document.getElementById('pred3-val').textContent = lossState.pred[2].toFixed(2);
    document.getElementById('actual1-val').textContent = lossState.actual[0].toFixed(2);
    document.getElementById('actual2-val').textContent = lossState.actual[1].toFixed(2);
    document.getElementById('actual3-val').textContent = lossState.actual[2].toFixed(2);

    // Calculate losses
    const mse = calculateMSE(lossState.pred, lossState.actual);
    const ce = calculateCrossEntropy(lossState.pred, lossState.actual);

    document.getElementById('mse-result').textContent = mse.toFixed(3);
    document.getElementById('ce-result').textContent = ce.toFixed(3);

    // Update formulas
    document.getElementById('mse-calc').textContent = 
      `MSE = ((${lossState.pred[0].toFixed(2)}-${lossState.actual[0].toFixed(2)})² + (${lossState.pred[1].toFixed(2)}-${lossState.actual[1].toFixed(2)})² + (${lossState.pred[2].toFixed(2)}-${lossState.actual[2].toFixed(2)})²) / 3 = ${mse.toFixed(3)}`;
    
    const ceTerms = lossState.pred.map((p, i) => {
      if (lossState.actual[i] > 0.5) return `log(${p.toFixed(2)})`;
      return '';
    }).filter(t => t).join(' + ');
    document.getElementById('ce-calc').textContent = `CE = -(${ceTerms}) [normalized for extended range]`;

    drawLossVisualizations();
  };

  pred1.addEventListener('input', updateLoss);
  pred2.addEventListener('input', updateLoss);
  pred3.addEventListener('input', updateLoss);
  actual1.addEventListener('input', updateLoss);
  actual2.addEventListener('input', updateLoss);
  actual3.addEventListener('input', updateLoss);

  updateLoss();
}

function drawLossVisualizations() {
  drawMSEVisualization();
  drawCEVisualization();
}

function drawMSEVisualization() {
  const canvas = document.getElementById('mse-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw bars for each sample
  const barWidth = (width - 2 * padding) / 3 - 20;
  const maxHeight = height - 2 * padding;

  lossState.pred.forEach((pred, i) => {
    const actual = lossState.actual[i];
    const error = Math.abs(pred - actual);
    const squaredError = Math.pow(pred - actual, 2);
    
    const x = padding + i * (barWidth + 30);
    const barHeight = squaredError * maxHeight * 2;

    // Draw error bar
    ctx.fillStyle = errorColor;
    ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight);

    // Labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Sample ${i + 1}`, x + barWidth / 2, height - padding + 20);
    ctx.fillText(`Error: ${squaredError.toFixed(3)}`, x + barWidth / 2, height - padding - barHeight - 5);
  });

  // Title
  ctx.fillStyle = textColor;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Squared Errors per Sample', width / 2, 20);
}

function drawCEVisualization() {
  const canvas = document.getElementById('ce-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Draw cross-entropy curve
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i <= 100; i++) {
    const p = 0.01 + i * 0.98 / 100;
    const ce = -Math.log(p);
    const x = padding + (p * plotWidth);
    const y = height - padding - Math.min(ce * plotHeight / 5, plotHeight);
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.fillText('Predicted Probability', width / 2, height - 10);
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Cross-Entropy Loss', 0, 0);
  ctx.restore();
}

// Initialize Gradient Descent
function initGradientDescent() {
  const algoSelect = document.getElementById('gd-algorithm');
  const lrInput = document.getElementById('learning-rate');
  const runBtn = document.getElementById('run-gd');
  const resetBtn = document.getElementById('reset-gd');

  if (!algoSelect) return;

  lrInput.addEventListener('input', () => {
    gdState.learningRate = parseFloat(lrInput.value);
    document.getElementById('lr-value').textContent = gdState.learningRate.toFixed(4);
    updateWarningIndicator('lr-warning', gdState.learningRate, 'learningRate');
  });

  algoSelect.addEventListener('change', () => {
    gdState.algorithm = algoSelect.value;
  });

  runBtn.addEventListener('click', runGradientDescent);
  resetBtn.addEventListener('click', resetGradientDescent);

  resetGradientDescent();
}

function resetGradientDescent() {
  gdState.position = [-2, 2];
  gdState.path = [[...gdState.position]];
  gdState.iteration = 0;
  gdState.isRunning = false;
  document.getElementById('gd-iterations').textContent = '0';
  document.getElementById('gd-loss').textContent = '0.000';
  drawGradientDescentCanvas();
}

function runGradientDescent() {
  if (gdState.isRunning) return;
  gdState.isRunning = true;

  const maxIterations = gdState.algorithm === 'bgd' ? 50 : (gdState.algorithm === 'sgd' ? 100 : 75);
  let iteration = 0;

  const step = () => {
    if (iteration >= maxIterations) {
      gdState.isRunning = false;
      return;
    }

    // Simple 2D loss function: f(x,y) = x^2 + y^2
    const [x, y] = gdState.position;
    const gradX = 2 * x;
    const gradY = 2 * y;

    // Add noise for SGD
    let noise = 1.0;
    if (gdState.algorithm === 'sgd') {
      noise = 0.5 + Math.random();
    } else if (gdState.algorithm === 'mbgd') {
      noise = 0.8 + Math.random() * 0.4;
    }

    // Update position
    gdState.position[0] -= gdState.learningRate * gradX * noise;
    gdState.position[1] -= gdState.learningRate * gradY * noise;
    gdState.path.push([...gdState.position]);

    const loss = gdState.position[0] ** 2 + gdState.position[1] ** 2;
    gdState.iteration = iteration + 1;

    document.getElementById('gd-iterations').textContent = gdState.iteration;
    document.getElementById('gd-loss').textContent = loss.toFixed(3);

    drawGradientDescentCanvas();
    iteration++;

    setTimeout(step, 50);
  };

  step();
}

function drawGradientDescentCanvas() {
  const canvas = document.getElementById('gd-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw contour lines
  const levels = [0.5, 1, 2, 4, 8];
  levels.forEach((level, idx) => {
    ctx.strokeStyle = `rgba(100, 100, 100, ${0.3 - idx * 0.05})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const radius = Math.sqrt(level) * (plotWidth / 6);
    ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
  });

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height / 2);
  ctx.lineTo(width - padding, height / 2);
  ctx.moveTo(width / 2, padding);
  ctx.lineTo(width / 2, height - padding);
  ctx.stroke();

  // Draw optimization path
  if (gdState.path.length > 1) {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    gdState.path.forEach((pos, idx) => {
      const [x, y] = pos;
      const px = width / 2 + (x * plotWidth / 6);
      const py = height / 2 - (y * plotHeight / 6);
      
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Draw points
    gdState.path.forEach((pos, idx) => {
      const [x, y] = pos;
      const px = width / 2 + (x * plotWidth / 6);
      const py = height / 2 - (y * plotHeight / 6);
      
      ctx.fillStyle = idx === gdState.path.length - 1 ? primaryColor : 'rgba(100, 100, 100, 0.5)';
      ctx.beginPath();
      ctx.arc(px, py, idx === gdState.path.length - 1 ? 6 : 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.fillText('Loss Surface (contours)', width / 2 - 60, 25);
}

// Initialize Backpropagation
function initBackpropagation() {
  const forwardBtn = document.getElementById('step-forward');
  const backwardBtn = document.getElementById('step-backward');
  const resetBtn = document.getElementById('reset-backprop');

  if (!forwardBtn) return;

  forwardBtn.addEventListener('click', stepForward);
  backwardBtn.addEventListener('click', stepBackward);
  resetBtn.addEventListener('click', resetBackprop);

  resetBackprop();
}

function resetBackprop() {
  backpropState.stage = 0;
  updateBackpropDisplay();
}

function stepForward() {
  if (backpropState.stage < 5) {
    backpropState.stage++;
    calculateForwardPass();
    updateBackpropDisplay();
  }
}

function stepBackward() {
  if (backpropState.stage >= 5 && backpropState.stage < 9) {
    backpropState.stage++;
    updateBackpropDisplay();
  }
}

function calculateForwardPass() {
  const v = backpropState.values;
  if (backpropState.stage >= 2) {
    v.z1 = v.w1 * v.x + v.b1;
  }
  if (backpropState.stage >= 3) {
    v.a1 = sigmoidFunction(v.z1);
  }
  if (backpropState.stage >= 4) {
    v.z2 = v.w2 * v.a1 + v.b2;
  }
  if (backpropState.stage >= 5) {
    v.a2 = sigmoidFunction(v.z2);
    v.loss = 0.5 * Math.pow(v.target - v.a2, 2);
  }
}

function updateBackpropDisplay() {
  const stage = backpropState.stage;
  const v = backpropState.values;
  let stageText = '';
  let explanationText = '';
  let mathText = '';

  switch(stage) {
    case 0:
      stageText = 'Ready';
      explanationText = 'Click "Step Forward" to begin forward propagation';
      break;
    case 1:
      stageText = 'Input Layer';
      explanationText = 'Input x = ' + v.x.toFixed(2);
      mathText = `x = ${v.x.toFixed(2)}`;
      break;
    case 2:
      stageText = 'Hidden Layer - Linear';
      explanationText = 'Calculate weighted sum: z₁ = w₁ × x + b₁';
      mathText = `z₁ = ${v.w1} × ${v.x.toFixed(2)} + ${v.b1} = ${v.z1.toFixed(3)}`;
      break;
    case 3:
      stageText = 'Hidden Layer - Activation';
      explanationText = 'Apply sigmoid activation: a₁ = σ(z₁)';
      mathText = `a₁ = σ(${v.z1.toFixed(3)}) = ${v.a1.toFixed(3)}`;
      break;
    case 4:
      stageText = 'Output Layer - Linear';
      explanationText = 'Calculate output: z₂ = w₂ × a₁ + b₂';
      mathText = `z₂ = ${v.w2} × ${v.a1.toFixed(3)} + ${v.b2} = ${v.z2.toFixed(3)}`;
      break;
    case 5:
      stageText = 'Output &amp; Loss';
      explanationText = 'Final output and loss calculation';
      mathText = `a₂ = σ(${v.z2.toFixed(3)}) = ${v.a2.toFixed(3)}<br>Loss = ½(target - a₂)² = ½(${v.target} - ${v.a2.toFixed(3)})² = ${v.loss.toFixed(4)}`;
      break;
    case 6:
      stageText = 'Backprop - Output Gradient';
      explanationText = 'Calculate gradient at output';
      mathText = `∂C/∂a₂ = -(target - a₂) = -(${v.target} - ${v.a2.toFixed(3)}) = ${-(v.target - v.a2).toFixed(3)}`;
      break;
    case 7:
      stageText = 'Backprop - Hidden Layer';
      explanationText = 'Propagate gradient to hidden layer using chain rule';
      mathText = `∂C/∂a₁ = ∂C/∂a₂ × ∂a₂/∂z₂ × ∂z₂/∂a₁`;
      break;
    case 8:
      stageText = 'Backprop - Weight Updates';
      explanationText = 'Calculate weight gradients and update';
      mathText = `∂C/∂w₂ = ∂C/∂a₂ × ∂a₂/∂z₂ × ∂z₂/∂w₂<br>∂C/∂w₁ = ... (using chain rule)`;
      break;
  }

  document.getElementById('backprop-stage').innerHTML = 'Stage: ' + stageText;
  document.getElementById('backprop-text').innerHTML = explanationText;
  document.getElementById('backprop-math').innerHTML = mathText;

  drawBackpropCanvas();
}

function drawBackpropCanvas() {
  const canvas = document.getElementById('backprop-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const successColor = styles.getPropertyValue('--color-success').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw network
  const inputX = 100;
  const hiddenX = 350;
  const outputX = 600;
  const centerY = height / 2;

  // Connections
  ctx.strokeStyle = backpropState.stage >= 2 ? primaryColor : textColor;
  ctx.lineWidth = backpropState.stage >= 2 ? 3 : 1;
  ctx.beginPath();
  ctx.moveTo(inputX + 20, centerY);
  ctx.lineTo(hiddenX - 20, centerY);
  ctx.stroke();

  ctx.strokeStyle = backpropState.stage >= 4 ? primaryColor : textColor;
  ctx.lineWidth = backpropState.stage >= 4 ? 3 : 1;
  ctx.beginPath();
  ctx.moveTo(hiddenX + 20, centerY);
  ctx.lineTo(outputX - 20, centerY);
  ctx.stroke();

  // Neurons
  ctx.fillStyle = backpropState.stage >= 1 ? successColor : textColor;
  ctx.beginPath();
  ctx.arc(inputX, centerY, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('x', inputX, centerY);

  ctx.fillStyle = backpropState.stage >= 3 ? successColor : textColor;
  ctx.beginPath();
  ctx.arc(hiddenX, centerY, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.fillText('h', hiddenX, centerY);

  ctx.fillStyle = backpropState.stage >= 5 ? successColor : textColor;
  ctx.beginPath();
  ctx.arc(outputX, centerY, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.fillText('y', outputX, centerY);

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.fillText('Input', inputX, centerY + 40);
  ctx.fillText('Hidden', hiddenX, centerY + 40);
  ctx.fillText('Output', outputX, centerY + 40);
}

// Initialize Gradient Problems
function initGradientProblems() {
  const activationSelect = document.getElementById('grad-activation');
  const depthInput = document.getElementById('network-depth');
  const weightInput = document.getElementById('weight-scale');
  const computeBtn = document.getElementById('compute-gradients');
  const clipInput = document.getElementById('clip-threshold');

  if (!activationSelect) return;

  depthInput.addEventListener('input', () => {
    gradProblemState.depth = parseInt(depthInput.value);
    document.getElementById('depth-value').textContent = gradProblemState.depth;
    updateWarningIndicator('depth-warning', gradProblemState.depth, 'depth');
  });

  weightInput.addEventListener('input', () => {
    gradProblemState.weightScale = parseFloat(weightInput.value);
    document.getElementById('weight-scale-value').textContent = gradProblemState.weightScale.toFixed(1);
    updateWarningIndicator('weight-scale-warning', gradProblemState.weightScale, 'weightScale');
  });

  activationSelect.addEventListener('change', () => {
    gradProblemState.activation = activationSelect.value;
  });

  computeBtn.addEventListener('click', computeGradients);

  if (clipInput) {
    clipInput.addEventListener('input', () => {
      document.getElementById('clip-threshold-val').textContent = clipInput.value;
      drawClippingVisualization();
    });
  }

  drawDerivativeVisualizations();
}

function computeGradients() {
  const depth = gradProblemState.depth;
  const weightScale = gradProblemState.weightScale;
  const activation = gradProblemState.activation;

  // Simulate gradient computation through layers
  let gradient = 1.0;
  const gradients = [gradient];

  for (let i = 0; i < depth; i++) {
    let derivative;
    if (activation === 'sigmoid') {
      derivative = 0.25; // Max sigmoid derivative
    } else if (activation === 'relu') {
      derivative = 1.0;
    } else if (activation === 'tanh') {
      derivative = 0.4; // Approximate tanh derivative
    }
    
    gradient *= derivative * weightScale;
    gradients.push(gradient);
  }

  const firstGrad = gradients[0];
  const lastGrad = gradients[gradients.length - 1];
  const ratio = lastGrad / firstGrad;

  document.getElementById('first-grad').textContent = firstGrad.toFixed(6);
  document.getElementById('last-grad').textContent = lastGrad.toExponential(3);
  document.getElementById('grad-ratio').textContent = ratio.toExponential(3);

  drawGradientFlowCanvas(gradients);
}

function drawGradientFlowCanvas(gradients) {
  const canvas = document.getElementById('gradient-flow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();
  const successColor = styles.getPropertyValue('--color-success').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  if (!gradients || gradients.length === 0) return;

  // Draw gradient magnitude bars
  const barWidth = (width - 2 * padding) / gradients.length - 10;
  const maxHeight = height - 2 * padding;
  const maxGrad = Math.max(...gradients.map(g => Math.abs(g)));

  gradients.forEach((grad, idx) => {
    const x = padding + idx * (barWidth + 10);
    const normalizedGrad = Math.min(Math.abs(grad) / Math.max(maxGrad, 1), 1);
    const barHeight = normalizedGrad * maxHeight;

    // Color based on magnitude
    if (grad > 1) {
      ctx.fillStyle = errorColor;
    } else if (grad < 0.01) {
      ctx.fillStyle = errorColor;
    } else {
      ctx.fillStyle = successColor;
    }

    ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight);

    // Labels
    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`L${idx}`, x + barWidth / 2, height - padding + 15);
  });

  // Title
  ctx.fillStyle = textColor;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Gradient Magnitude by Layer (log scale)', width / 2, 25);
}

function drawClippingVisualization() {
  const canvas = document.getElementById('clipping-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 30;

  const threshold = parseFloat(document.getElementById('clip-threshold').value);

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height / 2);
  ctx.lineTo(width - padding, height / 2);
  ctx.stroke();

  // Draw threshold lines
  const threshY1 = height / 2 - threshold * (plotHeight / 8);
  const threshY2 = height / 2 + threshold * (plotHeight / 8);

  ctx.strokeStyle = errorColor;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding, threshY1);
  ctx.lineTo(width - padding, threshY1);
  ctx.moveTo(padding, threshY2);
  ctx.lineTo(width - padding, threshY2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw gradient curve (unclipped)
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = padding + (i / 100) * plotWidth;
    const grad = (i / 100 - 0.5) * 8;
    const y = height / 2 - grad * (plotHeight / 8);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Draw clipped gradient
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = padding + (i / 100) * plotWidth;
    let grad = (i / 100 - 0.5) * 8;
    grad = Math.max(-threshold, Math.min(threshold, grad)); // Clip
    const y = height / 2 - grad * (plotHeight / 8);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '11px sans-serif';
  ctx.fillText('Clipped', 10, 20);
  ctx.fillText('Original (faded)', 10, 35);
}

function drawDerivativeVisualizations() {
  drawSigmoidDerivative();
  drawReluDerivative();
  drawTanhDerivative();
}

function drawSigmoidDerivative() {
  const canvas = document.getElementById('sigmoid-derivative-canvas');
  if (!canvas) return;
  drawDerivativeGraph(canvas, (z) => {
    const sig = sigmoidFunction(z);
    return sig * (1 - sig);
  }, 'Sigmoid Derivative');
}

function drawReluDerivative() {
  const canvas = document.getElementById('relu-derivative-canvas');
  if (!canvas) return;
  drawDerivativeGraph(canvas, (z) => z > 0 ? 1 : 0, 'ReLU Derivative');
}

function drawTanhDerivative() {
  const canvas = document.getElementById('tanh-derivative-canvas');
  if (!canvas) return;
  drawDerivativeGraph(canvas, (z) => 1 - Math.pow(Math.tanh(z), 2), 'Tanh Derivative');
}

function drawDerivativeGraph(canvas, derivFunc, title) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 30;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Draw derivative curve
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  const xMin = -5;
  const xMax = 5;
  for (let i = 0; i <= 100; i++) {
    const z = xMin + (i / 100) * (xMax - xMin);
    const deriv = derivFunc(z);
    const x = padding + (i / 100) * plotWidth;
    const y = height - padding - Math.min(deriv, 1.5) * (plotHeight / 1.5);
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('0', padding + plotWidth / 2, height - padding + 15);
}

// Optimizer State
const optimizerState = {
  selected: ['sgd', 'momentum', 'adam'],
  lossFunction: 'beale',
  paths: {},
  isRunning: false,
  tuningOptimizer: 'adam',
  hyperparams: {
    momentum: { lr: 0.01, alpha: 0.9 },
    adam: { lr: 0.001, beta1: 0.9, beta2: 0.999 }
  }
};

// Loss Functions
function bealFunction(x, y) {
  const term1 = Math.pow(1.5 - x + x * y, 2);
  const term2 = Math.pow(2.25 - x + x * y * y, 2);
  const term3 = Math.pow(2.625 - x + x * y * y * y, 2);
  return term1 + term2 + term3;
}

function bealGradient(x, y) {
  const gx = 2 * (1.5 - x + x * y) * (y - 1) +
             2 * (2.25 - x + x * y * y) * (y * y - 1) +
             2 * (2.625 - x + x * y * y * y) * (y * y * y - 1);
  const gy = 2 * (1.5 - x + x * y) * x +
             2 * (2.25 - x + x * y * y) * 2 * x * y +
             2 * (2.625 - x + x * y * y * y) * 3 * x * y * y;
  return [gx, gy];
}

function rosenbrockFunction(x, y) {
  return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2);
}

function rosenbrockGradient(x, y) {
  const gx = -2 * (1 - x) - 400 * x * (y - x * x);
  const gy = 200 * (y - x * x);
  return [gx, gy];
}

function sphereFunction(x, y) {
  return x * x + y * y;
}

function sphereGradient(x, y) {
  return [2 * x, 2 * y];
}

function getLossFunction(name) {
  switch(name) {
    case 'beale': return { fn: bealFunction, grad: bealGradient, start: [3, 0.5], optimal: [3, 0.5], range: 4 };
    case 'rosenbrock': return { fn: rosenbrockFunction, grad: rosenbrockGradient, start: [-1, -1], optimal: [1, 1], range: 2 };
    case 'sphere': return { fn: sphereFunction, grad: sphereGradient, start: [2, 2], optimal: [0, 0], range: 3 };
    default: return { fn: sphereFunction, grad: sphereGradient, start: [2, 2], optimal: [0, 0], range: 3 };
  }
}

// Optimizer Implementations
class SGDOptimizer {
  constructor(lr = 0.01) {
    this.lr = lr;
  }
  
  step(position, gradient) {
    return [
      position[0] - this.lr * gradient[0],
      position[1] - this.lr * gradient[1]
    ];
  }
}

class MomentumOptimizer {
  constructor(lr = 0.01, alpha = 0.9) {
    this.lr = lr;
    this.alpha = alpha;
    this.velocity = [0, 0];
  }
  
  step(position, gradient) {
    this.velocity[0] = this.alpha * this.velocity[0] - this.lr * gradient[0];
    this.velocity[1] = this.alpha * this.velocity[1] - this.lr * gradient[1];
    return [
      position[0] + this.velocity[0],
      position[1] + this.velocity[1]
    ];
  }
}

class AdaGradOptimizer {
  constructor(lr = 0.1) {
    this.lr = lr;
    this.epsilon = 1e-7;
    this.cache = [0, 0];
  }
  
  step(position, gradient) {
    this.cache[0] += gradient[0] * gradient[0];
    this.cache[1] += gradient[1] * gradient[1];
    return [
      position[0] - (this.lr / (Math.sqrt(this.cache[0]) + this.epsilon)) * gradient[0],
      position[1] - (this.lr / (Math.sqrt(this.cache[1]) + this.epsilon)) * gradient[1]
    ];
  }
}

class RMSPropOptimizer {
  constructor(lr = 0.01, beta = 0.9) {
    this.lr = lr;
    this.beta = beta;
    this.epsilon = 1e-7;
    this.cache = [0, 0];
  }
  
  step(position, gradient) {
    this.cache[0] = this.beta * this.cache[0] + (1 - this.beta) * gradient[0] * gradient[0];
    this.cache[1] = this.beta * this.cache[1] + (1 - this.beta) * gradient[1] * gradient[1];
    return [
      position[0] - (this.lr / (Math.sqrt(this.cache[0]) + this.epsilon)) * gradient[0],
      position[1] - (this.lr / (Math.sqrt(this.cache[1]) + this.epsilon)) * gradient[1]
    ];
  }
}

class AdamOptimizer {
  constructor(lr = 0.001, beta1 = 0.9, beta2 = 0.999) {
    this.lr = lr;
    this.beta1 = beta1;
    this.beta2 = beta2;
    this.epsilon = 1e-8;
    this.m = [0, 0];
    this.v = [0, 0];
    this.t = 0;
  }
  
  step(position, gradient) {
    this.t += 1;
    
    // Update biased first moment estimate
    this.m[0] = this.beta1 * this.m[0] + (1 - this.beta1) * gradient[0];
    this.m[1] = this.beta1 * this.m[1] + (1 - this.beta1) * gradient[1];
    
    // Update biased second moment estimate
    this.v[0] = this.beta2 * this.v[0] + (1 - this.beta2) * gradient[0] * gradient[0];
    this.v[1] = this.beta2 * this.v[1] + (1 - this.beta2) * gradient[1] * gradient[1];
    
    // Bias correction
    const mHat0 = this.m[0] / (1 - Math.pow(this.beta1, this.t));
    const mHat1 = this.m[1] / (1 - Math.pow(this.beta1, this.t));
    const vHat0 = this.v[0] / (1 - Math.pow(this.beta2, this.t));
    const vHat1 = this.v[1] / (1 - Math.pow(this.beta2, this.t));
    
    return [
      position[0] - this.lr * mHat0 / (Math.sqrt(vHat0) + this.epsilon),
      position[1] - this.lr * mHat1 / (Math.sqrt(vHat1) + this.epsilon)
    ];
  }
}

function createOptimizer(name, params = {}) {
  switch(name) {
    case 'sgd': return new SGDOptimizer(0.01);
    case 'momentum': return new MomentumOptimizer(params.lr || 0.01, params.alpha || 0.9);
    case 'adagrad': return new AdaGradOptimizer(0.1);
    case 'rmsprop': return new RMSPropOptimizer(0.01, 0.9);
    case 'adam': return new AdamOptimizer(params.lr || 0.001, params.beta1 || 0.9, params.beta2 || 0.999);
    default: return new SGDOptimizer(0.01);
  }
}

// Initialize Optimizers
function initOptimizers() {
  const sgdCheck = document.getElementById('opt-sgd');
  const momentumCheck = document.getElementById('opt-momentum');
  const adagradCheck = document.getElementById('opt-adagrad');
  const rmspropCheck = document.getElementById('opt-rmsprop');
  const adamCheck = document.getElementById('opt-adam');
  const lossFnSelect = document.getElementById('loss-function');
  const runBtn = document.getElementById('run-optimizers');
  const resetBtn = document.getElementById('reset-optimizers');

  if (!runBtn) return;

  const updateSelected = () => {
    optimizerState.selected = [];
    if (sgdCheck.checked) optimizerState.selected.push('sgd');
    if (momentumCheck.checked) optimizerState.selected.push('momentum');
    if (adagradCheck.checked) optimizerState.selected.push('adagrad');
    if (rmspropCheck.checked) optimizerState.selected.push('rmsprop');
    if (adamCheck.checked) optimizerState.selected.push('adam');
  };

  sgdCheck.addEventListener('change', updateSelected);
  momentumCheck.addEventListener('change', updateSelected);
  adagradCheck.addEventListener('change', updateSelected);
  rmspropCheck.addEventListener('change', updateSelected);
  adamCheck.addEventListener('change', updateSelected);

  lossFnSelect.addEventListener('change', () => {
    optimizerState.lossFunction = lossFnSelect.value;
  });

  runBtn.addEventListener('click', runOptimizersComparison);
  resetBtn.addEventListener('click', resetOptimizersComparison);

  // Hyperparameter tuning
  const tuningOptimizerSelect = document.getElementById('tuning-optimizer');
  const tuneLr = document.getElementById('tune-lr');
  const tuneMomentum = document.getElementById('tune-momentum');
  const tuneAdamLr = document.getElementById('tune-adam-lr');
  const tuneBeta1 = document.getElementById('tune-beta1');
  const tuneBeta2 = document.getElementById('tune-beta2');
  const runTuningBtn = document.getElementById('run-tuning');

  if (tuningOptimizerSelect) {
    tuningOptimizerSelect.addEventListener('change', () => {
      optimizerState.tuningOptimizer = tuningOptimizerSelect.value;
      const momentumParams = document.getElementById('momentum-params');
      const adamParams = document.getElementById('adam-params');
      if (optimizerState.tuningOptimizer === 'momentum') {
        momentumParams.style.display = 'block';
        adamParams.style.display = 'none';
      } else {
        momentumParams.style.display = 'none';
        adamParams.style.display = 'block';
      }
    });
  }

  if (tuneLr) {
    tuneLr.addEventListener('input', () => {
      optimizerState.hyperparams.momentum.lr = parseFloat(tuneLr.value);
      document.getElementById('tune-lr-val').textContent = tuneLr.value;
    });
  }

  if (tuneMomentum) {
    tuneMomentum.addEventListener('input', () => {
      optimizerState.hyperparams.momentum.alpha = parseFloat(tuneMomentum.value);
      document.getElementById('tune-momentum-val').textContent = tuneMomentum.value;
      updateWarningIndicator('momentum-warning', parseFloat(tuneMomentum.value), 'momentum');
    });
  }

  if (tuneAdamLr) {
    tuneAdamLr.addEventListener('input', () => {
      optimizerState.hyperparams.adam.lr = parseFloat(tuneAdamLr.value);
      document.getElementById('tune-adam-lr-val').textContent = tuneAdamLr.value;
    });
  }

  if (tuneBeta1) {
    tuneBeta1.addEventListener('input', () => {
      optimizerState.hyperparams.adam.beta1 = parseFloat(tuneBeta1.value);
      document.getElementById('tune-beta1-val').textContent = tuneBeta1.value;
    });
  }

  if (tuneBeta2) {
    tuneBeta2.addEventListener('input', () => {
      optimizerState.hyperparams.adam.beta2 = parseFloat(tuneBeta2.value);
      document.getElementById('tune-beta2-val').textContent = tuneBeta2.value;
    });
  }

  if (runTuningBtn) {
    runTuningBtn.addEventListener('click', runHyperparameterTuning);
  }

  resetOptimizersComparison();
}

function resetOptimizersComparison() {
  optimizerState.paths = {};
  optimizerState.isRunning = false;
  
  // Hide all metric cards
  ['sgd', 'momentum', 'adagrad', 'rmsprop', 'adam'].forEach(opt => {
    const card = document.getElementById(`metric-${opt}`);
    if (card) card.style.display = 'none';
  });
  
  drawOptimizerCanvas();
}

function runOptimizersComparison() {
  if (optimizerState.isRunning) return;
  if (optimizerState.selected.length === 0) {
    alert('Please select at least one optimizer');
    return;
  }

  optimizerState.isRunning = true;
  optimizerState.paths = {};

  const lossFn = getLossFunction(optimizerState.lossFunction);
  const maxIterations = 100;

  // Initialize optimizers
  const optimizers = {};
  optimizerState.selected.forEach(name => {
    optimizers[name] = createOptimizer(name);
    optimizerState.paths[name] = [lossFn.start.slice()];
  });

  // Run optimization
  let iteration = 0;
  const step = () => {
    if (iteration >= maxIterations) {
      optimizerState.isRunning = false;
      updateOptimizerMetrics(lossFn);
      return;
    }

    optimizerState.selected.forEach(name => {
      const path = optimizerState.paths[name];
      const currentPos = path[path.length - 1];
      const gradient = lossFn.grad(currentPos[0], currentPos[1]);
      const newPos = optimizers[name].step(currentPos, gradient);
      path.push(newPos);
    });

    drawOptimizerCanvas();
    iteration++;
    setTimeout(step, 20);
  };

  step();
}

function updateOptimizerMetrics(lossFn) {
  optimizerState.selected.forEach(name => {
    const card = document.getElementById(`metric-${name}`);
    if (!card) return;
    
    card.style.display = 'block';
    const path = optimizerState.paths[name];
    const lastPos = path[path.length - 1];
    const loss = lossFn.fn(lastPos[0], lastPos[1]);
    
    const values = card.querySelectorAll('.metric-value');
    values[0].textContent = path.length;
    values[1].textContent = loss.toFixed(4);
  });
}

function drawOptimizerCanvas() {
  const canvas = document.getElementById('optimizer-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const lossFn = getLossFunction(optimizerState.lossFunction);
  const range = lossFn.range;

  // Draw contour lines
  const levels = [0.5, 1, 2, 5, 10, 20, 50];
  levels.forEach((level, idx) => {
    ctx.strokeStyle = `rgba(100, 100, 100, ${0.2 - idx * 0.02})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * 2 * Math.PI;
      const testDist = Math.sqrt(level) * 0.5;
      const x = lossFn.optimal[0] + testDist * Math.cos(angle);
      const y = lossFn.optimal[1] + testDist * Math.sin(angle);
      const px = padding + ((x + range) / (2 * range)) * plotWidth;
      const py = height - padding - ((y + range) / (2 * range)) * plotHeight;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  });

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height / 2);
  ctx.lineTo(width - padding, height / 2);
  ctx.moveTo(width / 2, padding);
  ctx.lineTo(width / 2, height - padding);
  ctx.stroke();

  // Draw optimizer paths
  const colors = {
    sgd: '#FF6B6B',
    momentum: '#4ECDC4',
    adagrad: '#FFE66D',
    rmsprop: '#A8DADC',
    adam: '#95E1D3'
  };

  Object.keys(optimizerState.paths).forEach(name => {
    const path = optimizerState.paths[name];
    if (path.length < 2) return;

    ctx.strokeStyle = colors[name];
    ctx.lineWidth = 2;
    ctx.beginPath();

    path.forEach((pos, idx) => {
      const px = padding + ((pos[0] + range) / (2 * range)) * plotWidth;
      const py = height - padding - ((pos[1] + range) / (2 * range)) * plotHeight;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Draw end point
    const lastPos = path[path.length - 1];
    const px = padding + ((lastPos[0] + range) / (2 * range)) * plotWidth;
    const py = height - padding - ((lastPos[1] + range) / (2 * range)) * plotHeight;
    ctx.fillStyle = colors[name];
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw optimal point
  const optX = padding + ((lossFn.optimal[0] + range) / (2 * range)) * plotWidth;
  const optY = height - padding - ((lossFn.optimal[1] + range) / (2 * range)) * plotHeight;
  ctx.fillStyle = '#00FF00';
  ctx.beginPath();
  ctx.arc(optX, optY, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Loss Surface Contours', width / 2, 20);
}

function runHyperparameterTuning() {
  const optimizer = optimizerState.tuningOptimizer;
  const params = optimizerState.hyperparams[optimizer];
  
  const lossFn = getLossFunction('sphere'); // Use simple sphere function
  const maxIterations = 150;
  
  let opt;
  if (optimizer === 'momentum') {
    opt = new MomentumOptimizer(params.lr, params.alpha);
  } else {
    opt = new AdamOptimizer(params.lr, params.beta1, params.beta2);
  }
  
  const path = [lossFn.start.slice()];
  
  for (let i = 0; i < maxIterations; i++) {
    const currentPos = path[path.length - 1];
    const gradient = lossFn.grad(currentPos[0], currentPos[1]);
    const newPos = opt.step(currentPos, gradient);
    path.push(newPos);
    
    // Early stopping if converged
    const loss = lossFn.fn(newPos[0], newPos[1]);
    if (loss < 0.001) break;
  }
  
  drawTuningCanvas(path, lossFn);
  provideFeedback(path, lossFn, params, optimizer);
}

function drawTuningCanvas(path, lossFn) {
  const canvas = document.getElementById('tuning-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const range = 3;

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height / 2);
  ctx.lineTo(width - padding, height / 2);
  ctx.moveTo(width / 2, padding);
  ctx.lineTo(width / 2, height - padding);
  ctx.stroke();

  // Draw path
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  path.forEach((pos, idx) => {
    const px = padding + ((pos[0] + range) / (2 * range)) * plotWidth;
    const py = height - padding - ((pos[1] + range) / (2 * range)) * plotHeight;
    if (idx === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Draw points
  path.forEach((pos, idx) => {
    if (idx % 10 !== 0 && idx !== path.length - 1) return;
    const px = padding + ((pos[0] + range) / (2 * range)) * plotWidth;
    const py = height - padding - ((pos[1] + range) / (2 * range)) * plotHeight;
    ctx.fillStyle = idx === path.length - 1 ? primaryColor : 'rgba(100, 100, 100, 0.5)';
    ctx.beginPath();
    ctx.arc(px, py, idx === path.length - 1 ? 6 : 3, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Optimization Path (${path.length} iterations)`, width / 2, 20);
}

function provideFeedback(path, lossFn, params, optimizer) {
  const feedbackEl = document.getElementById('feedback-text');
  if (!feedbackEl) return;

  const finalPos = path[path.length - 1];
  const finalLoss = lossFn.fn(finalPos[0], finalPos[1]);
  const iterations = path.length;

  let feedback = '';

  if (optimizer === 'momentum') {
    const lr = params.lr;
    const alpha = params.alpha;

    if (finalLoss < 0.01 && iterations < 50) {
      feedback = `✅ Excellent! Converged quickly in ${iterations} iterations. These hyperparameters are well-tuned.`;
    } else if (finalLoss < 0.1 && iterations < 100) {
      feedback = `✓ Good convergence in ${iterations} iterations. Consider slightly increasing learning rate for faster convergence.`;
    } else if (finalLoss > 1.0) {
      feedback = `⚠️ Poor convergence. Learning rate (${lr.toFixed(3)}) may be too high, causing oscillations. Try decreasing it.`;
    } else if (iterations >= 150) {
      feedback = `⚠️ Slow convergence. Learning rate (${lr.toFixed(3)}) may be too low. Try increasing it, or increase momentum (${alpha.toFixed(2)}).`;
    } else {
      feedback = `~ Moderate performance. Final loss: ${finalLoss.toFixed(4)}. Try adjusting learning rate or momentum for better results.`;
    }
  } else {
    const lr = params.lr;
    const beta1 = params.beta1;
    const beta2 = params.beta2;

    if (finalLoss < 0.01 && iterations < 50) {
      feedback = `✅ Excellent! Adam converged quickly in ${iterations} iterations with lr=${lr.toFixed(4)}.`;
    } else if (finalLoss < 0.1 && iterations < 100) {
      feedback = `✓ Good convergence. Adam is performing well with current hyperparameters.`;
    } else if (finalLoss > 1.0) {
      feedback = `⚠️ Learning rate (${lr.toFixed(4)}) may be too high. Try decreasing to 0.0001-0.001 range.`;
    } else if (iterations >= 150) {
      feedback = `⚠️ Slow convergence. Try increasing learning rate from ${lr.toFixed(4)} to speed up.`;
    } else {
      feedback = `~ Moderate performance. Final loss: ${finalLoss.toFixed(4)}. Default Adam parameters usually work well.`;
    }
  }

  feedbackEl.textContent = feedback;
}

// Overfitting & Regularization State
const overfitState = {
  complexity: 5,
  dataSize: 100,
  l1Lambda: 0.01,
  l2Lambda: 0.01,
  dropoutRate: 0.5,
  patience: 10,
  weights: [0.8, 0.6, 0.9, 0.7, 0.5, 0.4, 0.3, 0.8, 0.6, 0.9]
};

// Initialize Overfitting Section
function initOverfitting() {
  const complexityInput = document.getElementById('overfit-complexity');
  const dataSizeInput = document.getElementById('overfit-data');
  const runBtn = document.getElementById('run-overfit-demo');

  if (!complexityInput) return;

  complexityInput.addEventListener('input', () => {
    overfitState.complexity = parseInt(complexityInput.value);
    document.getElementById('overfit-complexity-val').textContent = overfitState.complexity;
  });

  dataSizeInput.addEventListener('input', () => {
    overfitState.dataSize = parseInt(dataSizeInput.value);
    document.getElementById('overfit-data-val').textContent = overfitState.dataSize;
  });

  runBtn.addEventListener('click', runOverfitDemo);

  // Technique selector
  const techniqueBtns = document.querySelectorAll('.technique-btn');
  techniqueBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const technique = btn.dataset.technique;
      techniqueBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.technique-content').forEach(c => c.classList.remove('active'));
      const content = document.getElementById(`technique-${technique}`);
      if (content) content.classList.add('active');
    });
  });

  // L1 regularization
  const l1Lambda = document.getElementById('l1-lambda');
  const runL1 = document.getElementById('run-l1');
  if (l1Lambda) {
    l1Lambda.addEventListener('input', () => {
      overfitState.l1Lambda = parseFloat(l1Lambda.value);
      document.getElementById('l1-lambda-val').textContent = overfitState.l1Lambda.toFixed(3);
      updateWarningIndicator('l1-warning', overfitState.l1Lambda, 'lambda');
    });
  }
  if (runL1) runL1.addEventListener('click', runL1Demo);

  // L2 regularization
  const l2Lambda = document.getElementById('l2-lambda');
  const runL2 = document.getElementById('run-l2');
  if (l2Lambda) {
    l2Lambda.addEventListener('input', () => {
      overfitState.l2Lambda = parseFloat(l2Lambda.value);
      document.getElementById('l2-lambda-val').textContent = overfitState.l2Lambda.toFixed(3);
      updateWarningIndicator('l2-warning', overfitState.l2Lambda, 'lambda');
    });
  }
  if (runL2) runL2.addEventListener('click', runL2Demo);

  // Dropout
  const dropoutRate = document.getElementById('dropout-rate');
  const runDropout = document.getElementById('run-dropout');
  const resetDropout = document.getElementById('reset-dropout');
  if (dropoutRate) {
    dropoutRate.addEventListener('input', () => {
      overfitState.dropoutRate = parseFloat(dropoutRate.value) / 100;
      document.getElementById('dropout-rate-val').textContent = dropoutRate.value + '%';
      updateWarningIndicator('dropout-warning', overfitState.dropoutRate, 'dropout');
    });
  }
  if (runDropout) runDropout.addEventListener('click', runDropoutDemo);
  if (resetDropout) resetDropout.addEventListener('click', runDropoutDemo);

  // Early stopping
  const patienceInput = document.getElementById('patience-input');
  const runEarlyStop = document.getElementById('run-early-stop');
  if (patienceInput) {
    patienceInput.addEventListener('input', () => {
      overfitState.patience = parseInt(patienceInput.value);
      document.getElementById('patience-val').textContent = overfitState.patience;
    });
  }
  if (runEarlyStop) runEarlyStop.addEventListener('click', runEarlyStopDemo);
}

function runOverfitDemo() {
  const canvas = document.getElementById('overfitting-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Generate overfitting curves
  const epochs = 100;
  const trainLoss = [];
  const valLoss = [];

  // Complexity and data size affect overfitting
  const overfitFactor = overfitState.complexity / (overfitState.dataSize / 100);
  const overfitStart = Math.max(10, 40 - overfitFactor * 5);

  for (let i = 0; i < epochs; i++) {
    // Training loss decreases
    const trainL = 2 * Math.exp(-i / 20) + 0.1;
    trainLoss.push(trainL);

    // Validation loss decreases then increases (overfitting)
    let valL;
    if (i < overfitStart) {
      valL = 2.5 * Math.exp(-i / 25) + 0.3;
    } else {
      const overfit = (i - overfitStart) / 30;
      valL = 2.5 * Math.exp(-overfitStart / 25) + 0.3 + overfit * 0.5;
    }
    valLoss.push(valL);
  }

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Epochs', width / 2, height - 10);
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Loss', 0, 0);
  ctx.restore();

  // Find max loss for scaling
  const maxLoss = Math.max(...trainLoss, ...valLoss);

  // Draw training loss
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  trainLoss.forEach((loss, i) => {
    const x = padding + (i / epochs) * plotWidth;
    const y = height - padding - (loss / maxLoss) * plotHeight * 0.8;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw validation loss
  ctx.strokeStyle = errorColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  valLoss.forEach((loss, i) => {
    const x = padding + (i / epochs) * plotWidth;
    const y = height - padding - (loss / maxLoss) * plotHeight * 0.8;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Mark overfitting point
  const overfitX = padding + (overfitStart / epochs) * plotWidth;
  ctx.strokeStyle = errorColor;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(overfitX, padding);
  ctx.lineTo(overfitX, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);

  // Legend
  ctx.fillStyle = primaryColor;
  ctx.fillRect(width - 180, 30, 20, 3);
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Training Loss', width - 155, 35);

  ctx.fillStyle = errorColor;
  ctx.fillRect(width - 180, 50, 20, 3);
  ctx.fillStyle = textColor;
  ctx.fillText('Validation Loss', width - 155, 55);

  ctx.fillStyle = errorColor;
  ctx.fillText('↑ Overfitting starts', overfitX + 5, 70);

  // Update indicators
  const finalTrain = trainLoss[trainLoss.length - 1].toFixed(3);
  const finalVal = valLoss[valLoss.length - 1].toFixed(3);
  const gap = (valLoss[valLoss.length - 1] - trainLoss[trainLoss.length - 1]).toFixed(3);

  document.getElementById('train-loss-display').textContent = finalTrain;
  document.getElementById('val-loss-display').textContent = finalVal;
  document.getElementById('gap-display').textContent = gap;

  const statusEl = document.getElementById('overfit-status');
  if (parseFloat(gap) > 0.5) {
    statusEl.textContent = '⚠️ Severe overfitting detected! Large gap between training and validation loss.';
    statusEl.style.background = 'rgba(var(--color-error-rgb), 0.15)';
    statusEl.style.color = 'var(--color-error)';
  } else if (parseFloat(gap) > 0.2) {
    statusEl.textContent = '⚠️ Moderate overfitting. Consider regularization techniques.';
    statusEl.style.background = 'rgba(var(--color-warning-rgb), 0.15)';
    statusEl.style.color = 'var(--color-warning)';
  } else {
    statusEl.textContent = '✓ Good generalization. Training and validation losses are close.';
    statusEl.style.background = 'rgba(var(--color-success-rgb), 0.15)';
    statusEl.style.color = 'var(--color-success)';
  }
}

function runL1Demo() {
  const canvas = document.getElementById('l1-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const numWeights = 10;
  const barWidth = (width - 2 * padding) / numWeights - 10;
  const maxHeight = height - 2 * padding;

  // Apply L1 regularization
  const regularizedWeights = overfitState.weights.map(w => {
    const shrinkAmount = overfitState.l1Lambda;
    if (Math.abs(w) <= shrinkAmount) return 0;
    return w - Math.sign(w) * shrinkAmount;
  });

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw weights
  regularizedWeights.forEach((w, i) => {
    const x = padding + i * (barWidth + 10);
    const barHeight = Math.abs(w) * maxHeight * 0.8;
    
    // Color based on whether zeroed
    ctx.fillStyle = w === 0 ? errorColor : primaryColor;
    ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight);

    // Labels
    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`w${i + 1}`, x + barWidth / 2, height - padding + 15);
    ctx.fillText(w.toFixed(2), x + barWidth / 2, height - padding - barHeight - 5);
  });

  // Count zeros
  const zeroCount = regularizedWeights.filter(w => w === 0).length;
  const explEl = document.getElementById('l1-explanation');
  if (zeroCount > 0) {
    explEl.textContent = `L1 has driven ${zeroCount} out of ${numWeights} weights to exactly zero (sparse solution). Lambda = ${overfitState.l1Lambda.toFixed(3)}`;
  } else {
    explEl.textContent = `No weights zeroed yet. Increase lambda to see L1 drive weights to zero.`;
  }

  // Title
  ctx.fillStyle = textColor;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`L1 Regularization Effect (λ = ${overfitState.l1Lambda.toFixed(3)})`, width / 2, 25);
}

function runL2Demo() {
  const canvas = document.getElementById('l2-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const successColor = styles.getPropertyValue('--color-success').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const numWeights = 10;
  const barWidth = (width - 2 * padding) / numWeights - 10;
  const maxHeight = height - 2 * padding;

  // Apply L2 regularization (weight decay)
  const decayFactor = 1 / (1 + overfitState.l2Lambda * 10);
  const regularizedWeights = overfitState.weights.map(w => w * decayFactor);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw original weights (faded)
  ctx.globalAlpha = 0.3;
  overfitState.weights.forEach((w, i) => {
    const x = padding + i * (barWidth + 10);
    const barHeight = Math.abs(w) * maxHeight * 0.8;
    ctx.fillStyle = 'gray';
    ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight);
  });
  ctx.globalAlpha = 1.0;

  // Draw regularized weights
  regularizedWeights.forEach((w, i) => {
    const x = padding + i * (barWidth + 10);
    const barHeight = Math.abs(w) * maxHeight * 0.8;
    
    ctx.fillStyle = successColor;
    ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight);

    // Labels
    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`w${i + 1}`, x + barWidth / 2, height - padding + 15);
    ctx.fillText(w.toFixed(2), x + barWidth / 2, height - padding - barHeight - 5);
  });

  const explEl = document.getElementById('l2-explanation');
  explEl.textContent = `L2 has shrunk all weights by factor ${decayFactor.toFixed(3)}. No weights are exactly zero (dense solution). Lambda = ${overfitState.l2Lambda.toFixed(3)}`;

  // Title
  ctx.fillStyle = textColor;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`L2 Regularization Effect (λ = ${overfitState.l2Lambda.toFixed(3)})`, width / 2, 25);

  // Legend
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Gray (faded) = Original weights', padding, 45);
  ctx.fillStyle = successColor;
  ctx.fillText('Green = Regularized weights', padding, 60);
}

function runDropoutDemo() {
  const canvas = document.getElementById('dropout-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Network layout
  const layers = [3, 8, 8, 2]; // input, hidden1, hidden2, output
  const layerX = [100, 250, 400, 550];
  const neuronRadius = 12;

  let totalNeurons = 0;
  let activeNeurons = 0;
  let droppedNeurons = 0;

  // Draw network
  layers.forEach((numNeurons, layerIdx) => {
    const startY = (height - numNeurons * 40) / 2;
    
    for (let i = 0; i < numNeurons; i++) {
      const x = layerX[layerIdx];
      const y = startY + i * 40 + 20;

      // Determine if neuron is dropped
      let isDropped = false;
      // Input layer: 20% dropout, hidden: variable, output: no dropout
      if (layerIdx === 0) {
        isDropped = Math.random() < 0.2;
      } else if (layerIdx === 1 || layerIdx === 2) {
        isDropped = Math.random() < overfitState.dropoutRate;
      }
      // layerIdx === 3 (output): no dropout

      totalNeurons++;
      if (isDropped) {
        droppedNeurons++;
      } else {
        activeNeurons++;
      }

      // Draw neuron
      ctx.fillStyle = isDropped ? errorColor : primaryColor;
      ctx.globalAlpha = isDropped ? 0.3 : 1.0;
      ctx.beginPath();
      ctx.arc(x, y, neuronRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Draw connections to next layer
      if (layerIdx < layers.length - 1 && !isDropped) {
        const nextLayerNum = layers[layerIdx + 1];
        const nextStartY = (height - nextLayerNum * 40) / 2;
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 1;
        
        for (let j = 0; j < nextLayerNum; j++) {
          const nextX = layerX[layerIdx + 1];
          const nextY = nextStartY + j * 40 + 20;
          ctx.beginPath();
          ctx.moveTo(x + neuronRadius, y);
          ctx.lineTo(nextX - neuronRadius, nextY);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }
    }

    // Layer labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const layerNames = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];
    ctx.fillText(layerNames[layerIdx], layerX[layerIdx], height - 10);
  });

  // Update info
  document.getElementById('active-neurons').textContent = activeNeurons;
  document.getElementById('dropped-neurons').textContent = droppedNeurons;

  // Title
  ctx.fillStyle = textColor;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Dropout Rate: ${(overfitState.dropoutRate * 100).toFixed(0)}% (Random Sub-Network)`, width / 2, 25);
}

function runEarlyStopDemo() {
  const canvas = document.getElementById('early-stop-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--color-surface').trim();
  const textColor = styles.getPropertyValue('--color-text').trim();
  const primaryColor = styles.getPropertyValue('--color-primary').trim();
  const errorColor = styles.getPropertyValue('--color-error').trim();
  const successColor = styles.getPropertyValue('--color-success').trim();

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Generate training curves
  const maxEpochs = 100;
  const trainLoss = [];
  const valLoss = [];
  
  for (let i = 0; i < maxEpochs; i++) {
    trainLoss.push(2 * Math.exp(-i / 20) + 0.1);
    
    if (i < 30) {
      valLoss.push(2.5 * Math.exp(-i / 25) + 0.3);
    } else {
      const overfit = (i - 30) / 40;
      valLoss.push(2.5 * Math.exp(-30 / 25) + 0.3 + overfit * 0.6);
    }
  }

  // Find best epoch and stopping point
  let bestEpoch = 0;
  let bestLoss = valLoss[0];
  for (let i = 1; i < valLoss.length; i++) {
    if (valLoss[i] < bestLoss) {
      bestLoss = valLoss[i];
      bestEpoch = i;
    }
  }

  const stopEpoch = Math.min(bestEpoch + overfitState.patience, maxEpochs - 1);

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Labels
  ctx.fillStyle = textColor;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Epochs', width / 2, height - 10);
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Loss', 0, 0);
  ctx.restore();

  const maxLoss = Math.max(...trainLoss.slice(0, stopEpoch + 1), ...valLoss.slice(0, stopEpoch + 1));

  // Draw training loss
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= stopEpoch; i++) {
    const x = padding + (i / maxEpochs) * plotWidth;
    const y = height - padding - (trainLoss[i] / maxLoss) * plotHeight * 0.8;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw validation loss
  ctx.strokeStyle = errorColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= stopEpoch; i++) {
    const x = padding + (i / maxEpochs) * plotWidth;
    const y = height - padding - (valLoss[i] / maxLoss) * plotHeight * 0.8;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Mark best epoch (green line)
  const bestX = padding + (bestEpoch / maxEpochs) * plotWidth;
  ctx.strokeStyle = successColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(bestX, padding);
  ctx.lineTo(bestX, height - padding);
  ctx.stroke();

  // Mark stop epoch (red line)
  const stopX = padding + (stopEpoch / maxEpochs) * plotWidth;
  ctx.strokeStyle = errorColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(stopX, padding);
  ctx.lineTo(stopX, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);

  // Legend
  ctx.fillStyle = primaryColor;
  ctx.fillRect(width - 180, 30, 20, 3);
  ctx.fillStyle = textColor;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Training Loss', width - 155, 35);

  ctx.fillStyle = errorColor;
  ctx.fillRect(width - 180, 50, 20, 3);
  ctx.fillText('Validation Loss', width - 155, 55);

  ctx.fillStyle = successColor;
  ctx.fillText(`Best epoch: ${bestEpoch}`, width - 180, 75);
  ctx.fillStyle = errorColor;
  ctx.fillText(`Stopped at: ${stopEpoch}`, width - 180, 90);

  // Update info
  document.getElementById('stop-epoch').textContent = stopEpoch;
  document.getElementById('best-epoch').textContent = bestEpoch;
  document.getElementById('patience-counter').textContent = `${stopEpoch - bestEpoch} / ${overfitState.patience}`;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSimulator();
  initLogicGates();
  initActivationExplorer();
  drawActivationFunctions();
  initLossFunctions();
  initGradientDescent();
  initBackpropagation();
  initGradientProblems();
  initOptimizers();
  initOverfitting();
  
  // Show experiments tab by default
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    if (btn.dataset.tab === 'experiments') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  tabContents.forEach(content => {
    if (content.id === 'experiments') {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
});