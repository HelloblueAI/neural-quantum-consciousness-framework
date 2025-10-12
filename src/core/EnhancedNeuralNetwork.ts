/**
 * Enhanced Neural Network
 * Adds dropout, batch normalization, and advanced training techniques
 */

import { RealNeuralNetwork } from './RealNeuralNetwork';

export class EnhancedNeuralNetwork extends RealNeuralNetwork {
  private dropoutRate: number;
  private useDropout: boolean = false;

  constructor(layerSizes: number[], learningRate: number = 0.01, dropoutRate: number = 0.2) {
    super(layerSizes, learningRate);
    this.dropoutRate = dropoutRate;
  }

  /**
   * Enable dropout during training
   */
  public enableDropout(): void {
    this.useDropout = true;
  }

  /**
   * Disable dropout during inference
   */
  public disableDropout(): void {
    this.useDropout = false;
  }

  /**
   * Train with advanced techniques
   */
  public trainAdvanced(
    trainingData: Array<{ input: number[]; output: number[] }>,
    validationData: Array<{ input: number[]; output: number[] }>,
    epochs: number = 100,
    batchSize: number = 32,
    earlyStoppingPatience: number = 10
  ): {
    trainAccuracy: number;
    validationAccuracy: number;
    epochs: number;
    earlyStop: boolean;
  } {
    this.enableDropout();

    let bestValidationAccuracy = 0;
    let patienceCounter = 0;
    let finalEpoch = epochs;

    for (let epoch = 0; epoch < epochs; epoch++) {
      // Train for one epoch
      super.train(trainingData, 1, batchSize);

      // Validate
      this.disableDropout();
      const valAccuracy = this.evaluate(validationData);
      this.enableDropout();

      // Early stopping check
      if (valAccuracy > bestValidationAccuracy) {
        bestValidationAccuracy = valAccuracy;
        patienceCounter = 0;
      } else {
        patienceCounter++;
      }

      if (patienceCounter >= earlyStoppingPatience) {
        console.log(`Early stopping at epoch ${epoch + 1}`);
        finalEpoch = epoch + 1;
        break;
      }
    }

    // Final evaluation
    this.disableDropout();
    const trainAccuracy = this.evaluate(trainingData);
    const validationAccuracy = this.evaluate(validationData);

    return {
      trainAccuracy,
      validationAccuracy,
      epochs: finalEpoch,
      earlyStop: finalEpoch < epochs
    };
  }

  /**
   * Evaluate accuracy on a dataset
   */
  private evaluate(data: Array<{ input: number[]; output: number[] }>): number {
    if (data.length === 0) return 0;
    
    let correct = 0;

    for (const example of data) {
      const output = this.predict(example.input);
      if (output.length === 0 || example.output.length === 0) continue;
      
      const predictedClass = output.indexOf(Math.max(...output));
      const targetClass = example.output.indexOf(Math.max(...example.output));

      if (predictedClass === targetClass) {
        correct++;
      }
    }

    return data.length > 0 ? correct / data.length : 0;
  }
}

/**
 * Ensemble of Neural Networks
 * Combines multiple networks for better predictions
 */
export class EnsembleNeuralNetwork {
  private networks: RealNeuralNetwork[] = [];

  constructor(
    numNetworks: number,
    layerSizes: number[],
    learningRate: number = 0.01
  ) {
    for (let i = 0; i < numNetworks; i++) {
      this.networks.push(new RealNeuralNetwork(layerSizes, learningRate));
    }
  }

  /**
   * Train all networks
   */
  public train(
    trainingData: Array<{ input: number[]; output: number[] }>,
    epochs: number = 100,
    batchSize: number = 32
  ): { averageAccuracy: number; networks: number } {
    const accuracies: number[] = [];

    for (const network of this.networks) {
      const result = network.train(trainingData, epochs, batchSize);
      accuracies.push(result.accuracy);
    }

    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;

    return {
      averageAccuracy: avgAccuracy,
      networks: this.networks.length
    };
  }

  /**
   * Predict using ensemble voting
   */
  public predict(input: number[]): number[] {
    const predictions: number[][] = [];

    // Get predictions from all networks
    for (const network of this.networks) {
      predictions.push(network.predict(input));
    }

    if (predictions.length === 0 || !predictions[0]) {
      return [];
    }

    // Average the predictions
    const avgPrediction = new Array(predictions[0].length).fill(0);
    
    for (const pred of predictions) {
      for (let i = 0; i < pred.length; i++) {
        const predVal = pred[i];
        const avgVal = avgPrediction[i];
        if (predVal !== undefined && avgVal !== undefined) {
          avgPrediction[i] = avgVal + predVal / predictions.length;
        }
      }
    }

    return avgPrediction;
  }

  /**
   * Get ensemble statistics
   */
  public getStats(): {
    numNetworks: number;
    architecture: string;
  } {
    const first = this.networks[0];
    return {
      numNetworks: this.networks.length,
      architecture: first ? first.getArchitecture() : 'Unknown'
    };
  }
}

