/**
 * Real Neural Network with Backpropagation
 * This is an ACTUAL neural network that learns through gradient descent
 */

export interface Layer {
  weights: number[][];
  biases: number[];
  activations?: number[];
  inputs?: number[];
  gradients?: number[];
}

export interface TrainingResult {
  accuracy: number;
  loss: number;
  epochs: number;
}

export class RealNeuralNetwork {
  private layers: Layer[] = [];
  private learningRate: number;

  constructor(layerSizes: number[], learningRate: number = 0.01) {
    this.learningRate = learningRate;
    
    // Initialize layers with Xavier initialization
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const inputSize = layerSizes[i];
      const outputSize = layerSizes[i + 1];
      
      if (inputSize === undefined || outputSize === undefined) {
        throw new Error('Invalid layer sizes');
      }
      
      // Xavier initialization for weights
      const scale = Math.sqrt(2.0 / (inputSize + outputSize));
      const weights: number[][] = [];
      
      for (let j = 0; j < outputSize; j++) {
        const row: number[] = [];
        for (let k = 0; k < inputSize; k++) {
          row.push((Math.random() * 2 - 1) * scale);
        }
        weights.push(row);
      }
      
      // Initialize biases to small values
      const biases = new Array(outputSize).fill(0).map(() => Math.random() * 0.01);
      
      this.layers.push({ weights, biases });
    }
  }

  /**
   * ReLU activation function
   */
  private relu(x: number): number {
    return Math.max(0, x);
  }

  /**
   * ReLU derivative
   */
  private reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;
  }

  /**
   * Softmax activation for output layer
   */
  private softmax(values: number[]): number[] {
    const maxVal = Math.max(...values);
    const exps = values.map(v => Math.exp(v - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sumExps);
  }

  /**
   * Forward pass through the network
   */
  public forward(input: number[]): number[] {
    let current = input;
    
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (!layer) continue;
      
      layer.inputs = current;
      
      const outputs: number[] = [];
      
      // Matrix multiplication: weights * inputs + biases
      for (let j = 0; j < layer.weights.length; j++) {
        const bias = layer.biases[j];
        if (bias === undefined) continue;
        
        let sum = bias;
        const weights = layer.weights[j];
        if (!weights) continue;
        
        for (let k = 0; k < current.length; k++) {
          const weight = weights[k];
          const inputVal = current[k];
          if (weight !== undefined && inputVal !== undefined) {
            sum += weight * inputVal;
          }
        }
        
        // Apply activation (ReLU for hidden layers, softmax for output)
        if (i < this.layers.length - 1) {
          outputs.push(this.relu(sum));
        } else {
          outputs.push(sum); // Will apply softmax to all outputs together
        }
      }
      
      // Apply softmax to output layer
      if (i === this.layers.length - 1) {
        layer.activations = this.softmax(outputs);
        current = layer.activations;
      } else {
        layer.activations = outputs;
        current = outputs;
      }
    }
    
    return current;
  }

  /**
   * Backward pass (backpropagation) to compute gradients
   */
  private backward(input: number[], target: number[]): void {
    // Compute output layer gradients
    const outputLayer = this.layers[this.layers.length - 1];
    if (!outputLayer) return;
    
    const outputGradients: number[] = [];
    
    if (!outputLayer.activations) return;
    
    // Cross-entropy loss derivative
    for (let i = 0; i < outputLayer.activations.length; i++) {
      const activation = outputLayer.activations[i];
      const targetVal = target[i];
      if (activation !== undefined && targetVal !== undefined) {
        outputGradients.push(activation - targetVal);
      }
    }
    
    outputLayer.gradients = outputGradients;
    
    // Backpropagate through hidden layers
    for (let i = this.layers.length - 2; i >= 0; i--) {
      const layer = this.layers[i];
      const nextLayer = this.layers[i + 1];
      if (!layer || !nextLayer) continue;
      
      const gradients: number[] = [];
      
      if (!layer.activations || !nextLayer.gradients) continue;
      
      // Compute gradients for this layer
      for (let j = 0; j < layer.activations.length; j++) {
        let gradient = 0;
        for (let k = 0; k < nextLayer.weights.length; k++) {
          const weights = nextLayer.weights[k];
          const grad = nextLayer.gradients[k];
          if (weights) {
            const weightVal = weights[j];
            if (weightVal !== undefined && grad !== undefined) {
              gradient += weightVal * grad;
            }
          }
        }
        // Apply ReLU derivative
        const activation = layer.activations[j];
        if (activation !== undefined) {
          gradient *= this.reluDerivative(activation);
        }
        gradients.push(gradient);
      }
      
      layer.gradients = gradients;
    }
  }

  /**
   * Update weights and biases using gradient descent
   */
  private updateWeights(): void {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (!layer) continue;
      
      if (!layer.gradients || !layer.inputs) continue;
      
      // Update weights
      for (let j = 0; j < layer.weights.length; j++) {
        const weights = layer.weights[j];
        const layerGrad = layer.gradients[j];
        if (!weights || layerGrad === undefined) continue;
        
        for (let k = 0; k < weights.length; k++) {
          const inputVal = layer.inputs[k];
          const currentWeight = weights[k];
          if (inputVal !== undefined && currentWeight !== undefined) {
            const gradient = layerGrad * inputVal;
            weights[k] = currentWeight - this.learningRate * gradient;
          }
        }
        
        // Update biases
        const bias = layer.biases[j];
        if (bias !== undefined) {
          layer.biases[j] = bias - this.learningRate * layerGrad;
        }
      }
    }
  }

  /**
   * Train the network on a dataset
   */
  public train(
    trainingData: Array<{ input: number[]; output: number[] }>,
    epochs: number = 100,
    batchSize: number = 32
  ): TrainingResult {
    let totalLoss = 0;
    let correct = 0;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      // Shuffle training data
      const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
      
      let epochLoss = 0;
      let epochCorrect = 0;
      
      // Mini-batch training
      for (let i = 0; i < shuffled.length; i += batchSize) {
        const batch = shuffled.slice(i, Math.min(i + batchSize, shuffled.length));
        
        for (const example of batch) {
          // Forward pass
          const output = this.forward(example.input);
          
          // Compute loss (cross-entropy)
          const loss = -example.output.reduce((sum, target, idx) => {
            const outputVal = output[idx];
            if (outputVal !== undefined) {
              return sum + target * Math.log(outputVal + 1e-10);
            }
            return sum;
          }, 0);
          
          epochLoss += loss;
          
          // Check if prediction is correct
          const predictedClass = output.indexOf(Math.max(...output));
          const targetClass = example.output.indexOf(Math.max(...example.output));
          if (predictedClass === targetClass) epochCorrect++;
          
          // Backward pass
          this.backward(example.input, example.output);
          
          // Update weights
          this.updateWeights();
        }
      }
      
      totalLoss = epochLoss / shuffled.length;
      correct = epochCorrect;
      
      // Log progress every 10 epochs
      if ((epoch + 1) % 10 === 0) {
        const accuracy = correct / trainingData.length;
        console.log(`Epoch ${epoch + 1}/${epochs} - Loss: ${totalLoss.toFixed(4)} - Accuracy: ${(accuracy * 100).toFixed(2)}%`);
      }
    }
    
    const accuracy = correct / trainingData.length;
    
    return {
      accuracy,
      loss: totalLoss,
      epochs
    };
  }

  /**
   * Make a prediction on new input
   */
  public predict(input: number[]): number[] {
    return this.forward(input);
  }

  /**
   * Get network architecture info
   */
  public getArchitecture(): string {
    const firstLayer = this.layers[0];
    if (!firstLayer || !firstLayer.weights[0]) {
      return 'Unknown architecture';
    }
    
    const layerSizes = [firstLayer.weights[0].length];
    for (const layer of this.layers) {
      layerSizes.push(layer.weights.length);
    }
    return layerSizes.join(' -> ');
  }
}

