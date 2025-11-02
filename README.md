# Neural Network Lab & Training Studio
## Welcome! 🧠

This guide will take you from zero to understanding neural networks through hands-on experimentation. Unlike traditional tutorials, you'll learn by **observing, experimenting, and building intuition** using the interactive lab.

**Time Investment**: ~4-6 hours for complete understanding
**Prerequisites**: Basic math (algebra, functions), curiosity
**Outcome**: Deep understanding of how neural networks learn

---

# Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Hands-On Labs](#hands-on-labs)
4. [Advanced Topics](#advanced-topics)
5. [Troubleshooting & Tips](#troubleshooting--tips)

---

# Getting Started

## What Are Neural Networks?

Think of a neural network like a **simplified brain**:
- A brain has billions of neurons connected together
- Each neuron receives signals from other neurons
- Signals are weighted (some more important than others)
- When enough signals arrive, the neuron "fires"
- The network learns by adjusting these weights

A neural network does the same thing, but with mathematics instead of biology.

## The Neural Network Lab

This lab lets you **build, train, and debug neural networks** interactively. You'll adjust parameters and instantly see how they affect learning. This hands-on approach builds intuition much better than memorizing formulas.

### Starting Your First Experiment

1. Open the Neural Network Lab
2. Go to **"Interactive Perceptron Simulator"**
3. You'll see sliders for inputs, weights, and bias
4. Adjust them and watch the output change in real-time

**Key insight**: A neural network is just math! Everything you see is a calculation.

---

# Core Concepts

## Part 1: Understanding Perceptrons (30 min)

### What is a Perceptron?

The **perceptron** is the simplest neural network. It:
- Takes 2 inputs (x₁, x₂)
- Multiplies each by a weight (w₁, w₂)
- Adds a bias (b)
- Applies an **activation function** to decide output

**Formula**: 
```
z = w₁·x₁ + w₂·x₂ + b
output = activation_function(z)
```

### Lab Experiment 1.1: Hello Perceptron!

**Goal**: Understand what each part does

**Steps**:
1. Open **"Interactive Perceptron Simulator"**
2. Set: x₁ = 0.5, x₂ = 0.5, w₁ = 1.0, w₂ = 1.0, bias = 0
3. Activation: **Step function**
4. Observe the output

**Now experiment:**
- Change x₁ to 1.0 → Does output change?
- Change w₁ to 5.0 → What happens now?
- Change bias to -2.0 → Can you prevent output?

**Understanding**: 
- **Inputs** are data you give the network (what it sees)
- **Weights** control how important each input is
- **Bias** makes it easier or harder to activate

### Lab Experiment 1.2: Weights Control Importance

**Goal**: See that weights determine how much each input matters

**Steps**:
1. Set: x₁ = 1.0, x₂ = 1.0
2. w₁ = 10.0, w₂ = 0.1, bias = 0
3. Keep this setup
4. Change only x₁ between 0 and 1

**Observation**: Big weight (10.0) on x₁ means changes to x₁ matter more!

**Now reverse it**: Set w₁ = 0.1, w₂ = 10.0. Now x₂ is more important.

**Key learning**: Weights tell the network "which inputs should I pay attention to?"

### Lab Experiment 1.3: Bias Makes It Easier to Fire

**Goal**: See bias as a "trigger threshold"

**Steps**:
1. Set: x₁ = 0, x₂ = 0, w₁ = 1.0, w₂ = 1.0
2. Change bias from -10 to 10
3. Watch when output changes

**Observation**: Positive bias = easier to activate. Negative bias = harder to activate.

**Real-world analogy**: 
- High bias = sensitive alarm (goes off easily)
- Negative bias = hard to trigger alarm

---

## Part 2: Activation Functions (25 min)

### What Are Activation Functions?

The **activation function** is the perceptron's decision-making rule. It takes the weighted sum and decides: "Should this neuron fire or not?"

Different activation functions = different decision styles.

### Lab Experiment 2.1: Step vs Sigmoid

**Goal**: See how different functions make different decisions

**Steps**:
1. Set up simulator: x₁ = 0.5, x₂ = 0.5, w₁ = 1.0, w₂ = 1.0, bias = 0
2. Set to **Step function** → Observe output
3. Change activation to **Sigmoid** → Observe output
4. Now change to **Tanh** → Observe output

**Key observations**:
- **Step**: Output is always 0 or 1 (hard decision)
- **Sigmoid**: Output is smooth between 0 and 1 (soft decision)
- **Tanh**: Output is smooth between -1 and 1

**Understanding**: Step is rigid, sigmoid is flexible. Modern networks use flexible functions.

### Lab Experiment 2.2: Sigmoid S-Curve

**Goal**: See the S-shape that makes sigmoid powerful

**Steps**:
1. Go to **"Activation Functions"** section
2. Look at the Sigmoid graph
3. Set z values from -5 to 5
4. Watch the smooth S-shape

**What you're seeing**: Sigmoid transitions smoothly from 0 (left) to 1 (right). This smoothness is crucial for learning!

### Lab Experiment 2.3: ReLU Simplicity

**Goal**: See why modern networks use ReLU

**Steps**:
1. Go to **"Interactive Perceptron Simulator"**
2. Set activation to **ReLU**
3. Set weights and inputs to various values
4. Observe ReLU always outputs positive (or 0)

**Key insight**: ReLU is simple (just max(0, z)) but very effective. It's the most popular activation function today.

### Lab Experiment 2.4: Understand 8 Activation Functions

Go through each of the 8 activation functions:
1. **Sign** - Original perceptron (-1 or 1)
2. **Step** - Binary (0 or 1)
3. **Sigmoid** - Smooth (0 to 1), S-shape
4. **Tanh** - Symmetric (-1 to 1), S-shape
5. **ReLU** - Simple, positive only
6. **Leaky ReLU** - ReLU with small negative slope
7. **Swish** - Modern, smooth, non-monotonic
8. **Softmax** - For multi-class problems

**For each function, ask yourself:**
- When would this be useful?
- What's its strength?
- What's its weakness?

---

## Part 3: Logic Gates (20 min)

### Why Logic Gates?

**Logic gates** are simple building blocks. By implementing them, you'll understand how neural networks **solve problems**.

### Lab Experiment 3.1: AND Gate

**Goal**: Make a network that implements AND logic

**Steps**:
1. Go to **"Logic Gates"** section
2. Select **AND**
3. You'll see a truth table:
   - (0,0) → 0
   - (0,1) → 0
   - (1,0) → 0
   - (1,1) → 1

**Understanding**: AND means "only output 1 when BOTH inputs are 1"

**Try it yourself**: Change weights and see if you can make AND work.

### Lab Experiment 3.2: OR vs XOR Mystery

**Goal**: See why OR is easy but XOR is hard

**Steps**:
1. Test **OR gate** with same weights as AND
   - Notice it works differently
2. Now test **XOR gate**
   - Notice the truth table is weird:
   - (0,0) → 0
   - (0,1) → 1
   - (1,0) → 1
   - (1,1) → 0

**The mystery**: Why is XOR harder?

Go to **"XOR Problem"** section to find out!

### Lab Experiment 3.3: The XOR Problem

**Goal**: Understand why single-layer networks fail

**Steps**:
1. Look at the XOR visualization
2. See the scatter plot showing XOR outputs
3. Try to draw a line separating 0s and 1s
4. **You can't!** No single line separates them

**Deep insight**: Some problems aren't linearly separable. You need multiple layers!

**This is why deep learning exists.**

---

## Part 4: Multi-Layer Networks (20 min)

### Why We Need Multiple Layers

A **single perceptron** can only solve linearly separable problems (AND, OR).
A **multi-layer network** can solve anything (XOR, facial recognition, natural language).

The key is **nonlinearity**: each layer adds complexity.

### Lab Experiment 4.1: Single vs Multi-Layer

**Goal**: See the difference visually

**Steps**:
1. Go to **"Single vs Multi-Layer Perceptron"** section
2. Look at single-layer: can draw straight line boundary
3. Look at multi-layer: can draw curved boundary
4. Understand: curves can separate XOR!

**Key insight**: Multiple layers let networks learn complex shapes and patterns.

---

## Part 5: How Networks Learn (30 min)

### The Learning Problem

A network has **thousands of weights**. How does it find the right values?

Answer: **Gradient Descent** - a clever algorithm that improves weights step-by-step.

### Lab Experiment 5.1: Understand Loss Functions

**Goal**: See what "error" means

**Steps**:
1. Go to **"Loss Functions"** section
2. Set: Predicted = 0.8, Actual = 1.0
3. See **Mean Squared Error** and **Cross-Entropy**
4. Both show error, but differently

**Understanding**: 
- **MSE (Mean Squared Error)** - for regression (continuous values)
- **Cross-Entropy** - for classification (categories)

### Lab Experiment 5.2: Gradient Descent in Action

**Goal**: See learning happen

**Steps**:
1. Go to **"Gradient Descent"** section
2. Select **Mini-batch Gradient Descent** (MBGD)
3. Set learning rate = 0.01
4. Watch the optimization path move downhill
5. The path shows how the algorithm improves

**Understanding**: Gradient descent finds the **valley** (minimum error) by taking small steps downhill.

### Lab Experiment 5.3: Learning Rate Matters

**Goal**: See how learning rate affects learning speed

**Steps**:
1. Same section, set learning rate = 0.001 (slow)
2. Watch convergence → takes many steps
3. Now set learning rate = 0.1 (fast)
4. Watch convergence → fewer steps but sometimes overshoots
5. Finally try 1.0 or higher → diverges (goes wrong!)

**Key learning**: 
- Too small = slow but stable
- Too large = fast but unstable
- Just right = best performance

### Lab Experiment 5.4: BGD vs SGD vs MBGD

**Goal**: Understand different training approaches

**Steps**:
1. Compare all three:
   - **BGD** (Batch): Uses all data, stable, slow
   - **SGD** (Stochastic): Uses one sample, fast, noisy
   - **MBGD** (Mini-batch): Balance of both, most popular

**Real-world insight**: MBGD is standard because it balances speed and stability.

---

## Part 6: Advanced Optimizers (25 min)

### Beyond Basic Gradient Descent

Modern networks use **optimizers** - smarter algorithms that adjust learning automatically.

### Lab Experiment 6.1: Momentum

**Goal**: See how momentum helps escape plateaus

**Steps**:
1. Go to **"Optimizers"** section
2. Select **Momentum**
3. Set momentum = 0.9 (default)
4. Watch optimization path
5. Now set momentum = 0 (just SGD)
6. Notice: momentum finds valley faster!

**Analogy**: Momentum is like a ball rolling downhill - it builds speed and momentum carries it through flat areas.

### Lab Experiment 6.2: Adaptive Learning Rates

**Goal**: See how algorithms adapt learning rate

**Steps**:
1. Try **AdaGrad** optimizer
2. Notice learning rate decreases over time
3. Fast at start, slow at end
4. Now try **RMSProp**
5. Better because decay factor prevents premature stopping
6. Finally try **Adam** - combines both!

**Understanding**: Modern optimizers don't use fixed learning rates. They adapt!

### Lab Experiment 6.3: Adam - The Default

**Goal**: Understand why Adam is most popular

**Steps**:
1. Go to **Optimizers → Adam**
2. See formula with β₁ and β₂
3. Try default values: β₁=0.9, β₂=0.999
4. Notice fastest convergence
5. Try extreme values to see what breaks it

**Key insight**: Adam usually works without tuning. It's the default for good reason!

---

# Hands-On Labs

## Lab 1: Master the Perceptron (45 min)

### Objective
Truly understand how perceptrons work by hands-on experimentation.

### Challenge 1: Create Your Own AND Gate
**Goal**: Find weights that implement AND

**Steps**:
1. Open Interactive Perceptron Simulator
2. Use truth table for AND:
   - (0,0) → 0
   - (0,1) → 0
   - (1,0) → 0
   - (1,1) → 1
3. Adjust w₁, w₂, bias until all four cases work
4. Write down the values you found

**Hint**: Try w₁=0.5, w₂=0.5, bias=-0.8

### Challenge 2: Understand Saturation
**Goal**: Make sigmoid completely saturated

**Steps**:
1. Use simulator with Sigmoid activation
2. Set weights very large (w₁=10, w₂=10)
3. Set bias=5, inputs=1,1
4. Output should be ≈1.0 (saturated)
5. Observe that gradient is ≈0
6. **Insight**: This is why deep networks with sigmoid have trouble!

### Challenge 3: Dead ReLU Problem
**Goal**: Create dead neurons

**Steps**:
1. Switch to ReLU activation
2. Set w₁=-10, w₂=-10, bias=-5
3. Set any positive inputs
4. Output will always be 0
5. **Insight**: This is "dying ReLU" - neurons stop learning!

---

## Lab 2: Solve XOR (1 hour)

### Objective
Build deep understanding of why multiple layers are needed.

### Challenge 1: Fail at Single Layer
**Goal**: Try and fail to implement XOR with one layer

**Steps**:
1. Go to XOR section
2. Try to find weights that work
3. You'll fail - impossible with one layer!

### Challenge 2: Understand Why
**Goal**: See geometrically why XOR is hard

**Steps**:
1. Look at XOR visualization
2. See scatter plot:
   - Blue points: (0,0)→0 and (1,1)→0
   - Red points: (0,1)→1 and (1,0)→1
3. Try drawing line through them
4. **You can't with one line!**

### Challenge 3: Use Multiple Layers
**Goal**: See how multi-layer solves it

**Steps**:
1. Look at multi-layer diagram
2. See how it uses AND, NAND, OR gates
3. Understand: XOR = (x₁ OR x₂) AND NOT(x₁ AND x₂)
4. **Insight**: Multiple layers create curved boundaries!

---

## Lab 3: Overfitting & Regularization (1 hour)

### Objective
Deeply understand the overfitting problem and solutions.

### Challenge 1: Observe Overfitting
**Goal**: See training vs validation loss diverge

**Steps**:
1. Go to **"Overfitting & Regularization"** section
2. Look at learning curves
3. Training loss: keeps decreasing ✓
4. Validation loss: starts increasing ✗
5. **This gap is overfitting!**

### Challenge 2: Try Experiment Templates
**Goal**: See extreme regularization

**Steps**:
1. Go to **"⚡ Experiment Templates"**
2. Click **"🔒 Over-Regularized"**
3. Apply template
4. λ=10, dropout=0.9
5. Observe: High loss on both train and validation
6. **Insight**: Too much regularization = underfitting!

### Challenge 3: L1 vs L2 Comparison
**Goal**: See sparse vs dense solutions

**Steps**:
1. In Regularization section
2. Try L1 with λ=0.1
3. Many weights go exactly to zero
4. Now try L2 with same λ
5. All weights small but non-zero
6. **Insight**: L1 for feature selection, L2 for weight decay

### Challenge 4: Dropout Learning
**Goal**: See ensemble effect of dropout

**Steps**:
1. Set dropout to 0% → overfits
2. Set to 50% → validation better
3. Set to 95% → can't learn
4. **Insight**: Dropout balances preventing memorization with allowing learning

---

## Lab 4: Extreme Experimentation (45 min)

### Objective
Build deep intuition through extreme values.

### Challenge 1: Gradient Explosion
**Goal**: Watch optimization diverge

**Steps**:
1. Click **Experiment Template**
2. Select **"💥 Gradient Explosion"**
3. Learning rate set to 5.0 (huge!)
4. Watch loss shoot to infinity
5. **Why**: Each step is too big, overshoots minimum

### Challenge 2: Gradient Vanishing
**Goal**: See gradients disappear

**Steps**:
1. Select **"📉 Gradient Vanishing"** template
2. 30 layers + sigmoid
3. Watch gradient magnitude near zero
4. **Why**: Chain rule multiplies 0.25 thirty times ≈ 0

### Challenge 3: Sigmoid Saturation
**Goal**: Watch learning stop

**Steps**:
1. Select **"📊 Sigmoid Saturation"** template
2. Large weights force sigmoid to 1.0
3. Gradient ≈ 0 → can't learn
4. **Why**: Sigmoid derivatives max at 0.25, and saturated regions have 0 derivative

### Challenge 4: Dead ReLU
**Goal**: Kill all neurons

**Steps**:
1. Select **"💀 Dead ReLU Neurons"** template
2. Negative weighted sum with ReLU
3. ReLU(-anything) = 0
4. Gradient = 0 → can't recover
5. **Solution**: Use Leaky ReLU or careful initialization

---

# Advanced Topics

## Backpropagation: How Networks Learn

### What Is Backpropagation?

**Backpropagation** is the algorithm that computes gradients for learning.

**In simple terms**:
1. Forward pass: input → output → loss
2. Backward pass: error flows backward
3. Each layer learns how much to adjust
4. All weights update simultaneously

### Lab Experiment: Understand Backpropagation

**Steps**:
1. Go to **"Backpropagation"** section
2. See forward pass: calculations flow right → left
3. See backward pass: gradients flow left ← right
4. Understand: error "flows backward" to tell each weight how to change

**Key insight**: Backpropagation efficiently computes all gradients at once!

---

## Vanishing & Exploding Gradients

### The Problem

In **deep networks**, gradients either:
- **Vanish** (become too small) - layer near input barely learns
- **Explode** (become too large) - updates become unstable

### Lab Experiment: Cause & Effect

**Steps**:
1. Go to **"Gradient Problems"** section
2. Increase depth to 30 layers
3. Use sigmoid activation
4. Watch gradient magnitude: 0.0000000001 (vanishing!)
5. Switch to ReLU
6. Watch gradient stay stable (≈1)

**Understanding**: 
- Sigmoid has max derivative 0.25
- Multiply by 0.25 thirty times = 10^-10
- Early layers get no learning signal!

### Lab Experiment: Solutions

**Try each solution**:
1. Use ReLU (derivative = 1)
2. Add skip connections
3. Use gradient clipping
4. Batch normalization

Watch gradients stabilize!

---

## Regularization Deep Dive

### The Overfitting-Underfitting Tradeoff

Networks have competing goals:
- **Fit training data** (small training loss)
- **Generalize to new data** (small test loss)

Regularization balances these.

### Lab Experiment: Find the Sweet Spot

**Steps**:
1. Set λ (lambda) = 0 → overfits (low train loss, high test loss)
2. Gradually increase λ
3. Find sweet spot where both losses are low
4. Keep increasing λ → underfits (high both)

**Your job**: Find λ that minimizes test loss!

### Lab Experiment: Dropout vs Regularization

**Compare side-by-side**:
1. Use only L2: smooth improvement
2. Use only Dropout: noisier but effective
3. Use both: best result

**Insight**: Regularization techniques complement each other!

---

# Troubleshooting & Tips

## Common Mistakes

### Mistake 1: "My network isn't learning!"

**Likely causes**:
1. Learning rate too small (0.00001)
   - **Fix**: Increase to 0.01
2. Learning rate too large (5.0)
   - **Fix**: Decrease to 0.01
3. Network too small
   - **Fix**: Add more neurons/layers
4. Data not normalized (-1 to 1)
   - **Fix**: Normalize inputs

**Lab**: Use template **"🐌 Glacial Learning"** to see too-small learning rate

### Mistake 2: "Loss goes to NaN!"

**Causes**: Learning rate too high → gradient explosion

**Fix**: 
1. Reduce learning rate to 0.001
2. Use gradient clipping
3. Try Adam optimizer

**Lab**: Use template **"💥 Gradient Explosion"** to trigger this

### Mistake 3: "Training loss stays high"

**Causes**:
1. Model too simple (underfitting)
2. Regularization too strong
3. Bad initialization

**Fix**:
1. Add more layers/neurons
2. Reduce λ to 0.001
3. Change weight initialization

---

## Tips for Effective Learning

### Tip 1: Change ONE Thing at a Time
When experimenting, only adjust one parameter per trial. Otherwise you won't know what caused the change!

### Tip 2: Use the Experiment Templates First
Templates show you **pathological cases**. Learn what NOT to do before optimizing.

### Tip 3: Always Have Training & Validation Data Split
Watch both curves. The gap shows overfitting.

### Tip 4: Understand Intuition Before Mathematics
This lab is about building intuition. Once you understand intuitively, the math will click!

### Tip 5: Come Back to Basic Experiments
After learning advanced topics, revisit simple experiments. They'll make more sense now!

---

## Learning Path Recommendations

### Beginner (3 hours)
1. Perceptron basics (Experiments 1.1-1.3)
2. Activation functions (Experiments 2.1-2.4)
3. Logic gates (Experiments 3.1-3.3)
4. **Lab 1: Master the Perceptron**

### Intermediate (2 hours)
1. Multi-layer networks (Experiment 4.1)
2. **Lab 2: Solve XOR**
3. Loss functions (Experiment 5.1)
4. Gradient descent (Experiments 5.2-5.4)

### Advanced (1-2 hours)
1. Optimizers (Experiments 6.1-6.3)
2. **Lab 3: Overfitting & Regularization**
3. Backpropagation section
4. Gradient problems section
5. **Lab 4: Extreme Experimentation**

### Mastery
1. Go through all experiment templates
2. Try to explain each one to someone else
3. Predict what will happen before experimenting
4. Build your own scenarios

---

# Key Concepts Summary

## Conceptual Framework

```
Data → Perceptron → Output
         ↓
      Weights (learn these!)
         ↓
    Loss function (measure error)
         ↓
    Gradient Descent (improve weights)
         ↓
   Repeat until convergence
```

## The 5 Critical Ideas

1. **Perceptrons** are simple: weighted sum → activation function
2. **Activation functions** make networks nonlinear and powerful
3. **Multiple layers** solve impossible problems (XOR)
4. **Gradient descent** finds good weights automatically
5. **Regularization** prevents memorization and improves generalization

## The Learning Process

```
Initialize weights randomly
    ↓
Forward: compute output
    ↓
Backward: compute gradients
    ↓
Update: adjust weights
    ↓
Repeat thousands of times
    ↓
Network learns!
```

---

# Conclusion: What You Now Understand

After completing this guide and labs, you understand:

✓ How perceptrons work (weighted sum + activation)
✓ Why multiple layers are needed (nonlinearity)
✓ How networks learn (gradient descent)
✓ Why activation functions matter (nonlinearity, saturation)
✓ How to prevent overfitting (regularization)
✓ Why learning rate is critical (convergence vs divergence)
✓ How modern optimizers work (adaptive learning rates)
✓ Why deep learning is hard (vanishing gradients)
✓ How to solve problems (backpropagation)

**Most importantly**: You've built **intuition** through experimentation, not just memorized facts!

---

## Next Steps

1. **Share your learning**: Explain one concept to someone else
2. **Explore beyond**: Look at convolutional networks, recurrent networks
3. **Apply knowledge**: Try implementing a network from scratch
4. **Teach others**: Use this lab to help someone else learn

---

## Quick Reference: Experiment Templates

| Template | What Happens | Why | Solution |
|----------|-------------|-----|----------|
| 💥 Gradient Explosion | Loss → ∞ | LR too high | Reduce LR to 0.01 |
| 📉 Gradient Vanishing | Gradients → 0 | 30 sigmoid layers | Use ReLU |
| 🔒 Over-Regularized | High loss everywhere | Too much penalty | Reduce λ, dropout |
| 🌀 Unstable Momentum | Wild oscillations | α > 1.0 | Set α = 0.9 |
| 📊 Sigmoid Saturation | Gradient = 0 | Large weights | Use ReLU |
| 💀 Dead ReLU | Output always 0 | Negative z | Use Leaky ReLU |
| 🎲 Extreme Dropout | Can't learn | 95% dropped | Use 50% dropout |
| 🐌 Glacial Learning | Barely moves | LR too small | Increase LR |
| 📈 Overfitting Demo | Gap between train/test | No regularization | Add L2 + dropout |

---

## Understanding Checklist

By the end of this guide, you should be able to:

- [ ] Explain what a perceptron does to a beginner
- [ ] Understand why weights and bias exist
- [ ] Compare all 8 activation functions
- [ ] Explain XOR and why it needs multiple layers
- [ ] Describe gradient descent in your own words
- [ ] Identify good vs bad learning rates
- [ ] Explain overfitting without looking at notes
- [ ] Describe 3 ways to prevent overfitting
- [ ] Understand why sigmoid causes vanishing gradients
- [ ] Explain how dropout works as ensemble
- [ ] Predict what happens with extreme parameters
- [ ] Describe Adam optimizer and why it's popular

If you can do all of these, **you understand neural networks!**

---

## Final Thoughts

Deep learning can seem mysterious, but it's actually quite elegant:
- Start with random weights
- Calculate error
- Adjust weights to reduce error
- Repeat millions of times
- Network learns!

The magic is in the details: careful optimization, good activation functions, and regularization.

By experimenting with this lab, you've seen all the pieces work together. This understanding is much deeper than memorizing equations.

**Happy learning! 🧠**

---

## Resources & Further Learning

### Within This Lab
- Experiment with extreme values to break things
- Revisit basic experiments after learning advanced topics
- Use templates to understand pathological cases

### General Resources
- Papers: Hinton et al. (2012) Dropout, LeCun et al. (1998) Backpropagation
- Books: "Deep Learning" by Goodfellow, Bengio, Courville
- Courses: Stanford CS231n, Fast.ai

### Practice
- Implement a network from scratch
- Apply to real datasets
- Teach others using this lab

---

**Remember**: Understanding comes from experimentation. Don't just read - **play with the lab!**
