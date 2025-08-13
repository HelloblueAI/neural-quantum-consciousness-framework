/**
 * @file neural_operations.c
 * @brief Neural network operations implementation
 * @author AGI Team
 * @version 1.0.0
 */

#include "agi_core.h"
#include <math.h>
#include <string.h>
#include <stdlib.h>

#ifdef AGI_AVX2_SUPPORT
#include <immintrin.h>
#endif

#ifdef _OPENMP
#include <omp.h>
#endif

/**
 * @brief Create a new neural network
 */
agi_neural_network_t* agi_create_neural_network(const agi_neural_config_t* config) {
    if (!config) return NULL;
    
    agi_neural_network_t* network = (agi_neural_network_t*)malloc(sizeof(agi_neural_network_t));
    if (!network) return NULL;
    
    network->config = *config;
    network->layer_count = config->hidden_layers_count + 2; // input + hidden + output
    network->layers = (agi_neural_layer_t*)malloc(network->layer_count * sizeof(agi_neural_layer_t));
    
    if (!network->layers) {
        free(network);
        return NULL;
    }
    
    // Initialize layers
    size_t current_size = config->input_size;
    for (size_t i = 0; i < network->layer_count; i++) {
        size_t output_size;
        if (i == 0) {
            output_size = config->hidden_layer_sizes[0];
        } else if (i == network->layer_count - 1) {
            output_size = config->output_size;
        } else {
            output_size = config->hidden_layer_sizes[i];
        }
        
        network->layers[i].input_size = current_size;
        network->layers[i].output_size = output_size;
        network->layers[i].is_training = true;
        
        // Allocate weights and biases
        size_t weights_size = current_size * output_size;
        size_t biases_size = output_size;
        
        network->layers[i].weights = (double*)calloc(weights_size, sizeof(double));
        network->layers[i].biases = (double*)calloc(biases_size, sizeof(double));
        
        if (!network->layers[i].weights || !network->layers[i].biases) {
            // Cleanup on error
            for (size_t j = 0; j <= i; j++) {
                free(network->layers[j].weights);
                free(network->layers[j].biases);
            }
            free(network->layers);
            free(network);
            return NULL;
        }
        
        // Initialize weights with Xavier/Glorot initialization
        double scale = sqrt(2.0 / (current_size + output_size));
        for (size_t j = 0; j < weights_size; j++) {
            network->layers[i].weights[j] = ((double)rand() / RAND_MAX - 0.5) * 2.0 * scale;
        }
        
        current_size = output_size;
    }
    
    // Allocate buffers
    network->input_buffer = (double*)calloc(config->input_size, sizeof(double));
    network->output_buffer = (double*)calloc(config->output_size, sizeof(double));
    network->gradient_buffer = (double*)calloc(config->output_size, sizeof(double));
    network->max_batch_size = 32;
    
    return network;
}

/**
 * @brief Destroy a neural network
 */
agi_error_t agi_destroy_neural_network(agi_neural_network_t* network) {
    if (!network) return AGI_ERROR_NULL_POINTER;
    
    for (size_t i = 0; i < network->layer_count; i++) {
        free(network->layers[i].weights);
        free(network->layers[i].biases);
    }
    
    free(network->layers);
    free(network->input_buffer);
    free(network->output_buffer);
    free(network->gradient_buffer);
    free(network);
    
    return AGI_SUCCESS;
}

/**
 * @brief Forward pass through the network
 */
agi_error_t agi_forward_pass(
    agi_neural_network_t* network,
    const double* input,
    double* output,
    size_t batch_size
) {
    if (!network || !input || !output) return AGI_ERROR_NULL_POINTER;
    
    // Copy input to buffer
    memcpy(network->input_buffer, input, network->config.input_size * sizeof(double));
    
    double* current_input = network->input_buffer;
    double* current_output = network->output_buffer;
    
    // Forward pass through all layers
    for (size_t layer_idx = 0; layer_idx < network->layer_count; layer_idx++) {
        agi_neural_layer_t* layer = &network->layers[layer_idx];
        
        // Matrix multiplication: output = weights * input + biases
        #ifdef AGI_AVX2_SUPPORT
        // Use AVX2 for vectorized operations
        for (size_t i = 0; i < layer->output_size; i += 4) {
            __m256d sum = _mm256_setzero_pd();
            for (size_t j = 0; j < layer->input_size; j++) {
                __m256d weight = _mm256_loadu_pd(&layer->weights[i * layer->input_size + j]);
                __m256d input_val = _mm256_set1_pd(current_input[j]);
                sum = _mm256_fmadd_pd(weight, input_val, sum);
            }
            _mm256_storeu_pd(&current_output[i], sum);
        }
        #else
        // Standard implementation
        for (size_t i = 0; i < layer->output_size; i++) {
            current_output[i] = 0.0;
            for (size_t j = 0; j < layer->input_size; j++) {
                current_output[i] += layer->weights[i * layer->input_size + j] * current_input[j];
            }
        }
        #endif
        
        // Add biases
        for (size_t i = 0; i < layer->output_size; i++) {
            current_output[i] += layer->biases[i];
        }
        
        // Apply activation function (ReLU for now)
        for (size_t i = 0; i < layer->output_size; i++) {
            current_output[i] = current_output[i] > 0.0 ? current_output[i] : 0.0;
        }
        
        // Swap buffers for next layer
        double* temp = current_input;
        current_input = current_output;
        current_output = temp;
    }
    
    // Copy final output
    memcpy(output, current_input, network->config.output_size * sizeof(double));
    
    return AGI_SUCCESS;
}

/**
 * @brief Backward pass for training
 */
agi_error_t agi_backward_pass(
    agi_neural_network_t* network,
    const double* input,
    const double* target,
    double* gradients,
    size_t batch_size
) {
    if (!network || !input || !target || !gradients) return AGI_ERROR_NULL_POINTER;
    
    // Simplified backward pass implementation
    // In a full implementation, this would compute gradients for all layers
    
    // For now, just compute output gradients
    for (size_t i = 0; i < network->config.output_size; i++) {
        gradients[i] = target[i] - input[i];
    }
    
    return AGI_SUCCESS;
}

/**
 * @brief Train the network on a batch
 */
double agi_train_batch(
    agi_neural_network_t* network,
    const double* input,
    const double* target,
    size_t batch_size
) {
    if (!network || !input || !target) return -1.0;
    
    double total_loss = 0.0;
    
    // Forward pass
    agi_forward_pass(network, input, network->output_buffer, batch_size);
    
    // Compute loss (mean squared error)
    for (size_t i = 0; i < network->config.output_size; i++) {
        double diff = target[i] - network->output_buffer[i];
        total_loss += diff * diff;
    }
    
    total_loss /= network->config.output_size;
    
    // Backward pass (simplified)
    agi_backward_pass(network, network->output_buffer, target, network->gradient_buffer, batch_size);
    
    return total_loss;
}
