#include "agi_core.h"
#include <math.h>
#include <string.h>

agi_error_t agi_apply_activation(const double* input, double* output, size_t size, agi_activation_type_t activation_type) {
    if (!input || !output) return AGI_ERROR_NULL_POINTER;
    
    for (size_t i = 0; i < size; i++) {
        switch (activation_type) {
            case AGI_ACTIVATION_SIGMOID:
                output[i] = 1.0 / (1.0 + exp(-input[i]));
                break;
            case AGI_ACTIVATION_TANH:
                output[i] = tanh(input[i]);
                break;
            case AGI_ACTIVATION_RELU:
                output[i] = input[i] > 0.0 ? input[i] : 0.0;
                break;
            case AGI_ACTIVATION_LEAKY_RELU:
                output[i] = input[i] > 0.0 ? input[i] : 0.01 * input[i];
                break;
            case AGI_ACTIVATION_SWISH:
                output[i] = input[i] / (1.0 + exp(-input[i]));
                break;
            case AGI_ACTIVATION_GELU:
                output[i] = 0.5 * input[i] * (1.0 + tanh(sqrt(2.0 / M_PI) * (input[i] + 0.044715 * pow(input[i], 3))));
                break;
            case AGI_ACTIVATION_SOFTMAX:
                output[i] = exp(input[i]); // Will be normalized later
                break;
            default:
                output[i] = input[i];
                break;
        }
    }
    
    // Normalize softmax if needed
    if (activation_type == AGI_ACTIVATION_SOFTMAX) {
        double sum = 0.0;
        for (size_t i = 0; i < size; i++) {
            sum += output[i];
        }
        for (size_t i = 0; i < size; i++) {
            output[i] /= sum;
        }
    }
    
    return AGI_SUCCESS;
}

agi_error_t agi_apply_activation_derivative(const double* input, double* output, size_t size, agi_activation_type_t activation_type) {
    if (!input || !output) return AGI_ERROR_NULL_POINTER;
    
    for (size_t i = 0; i < size; i++) {
        switch (activation_type) {
            case AGI_ACTIVATION_SIGMOID:
                {
                    double sigmoid = 1.0 / (1.0 + exp(-input[i]));
                    output[i] = sigmoid * (1.0 - sigmoid);
                }
                break;
            case AGI_ACTIVATION_TANH:
                output[i] = 1.0 - tanh(input[i]) * tanh(input[i]);
                break;
            case AGI_ACTIVATION_RELU:
                output[i] = input[i] > 0.0 ? 1.0 : 0.0;
                break;
            case AGI_ACTIVATION_LEAKY_RELU:
                output[i] = input[i] > 0.0 ? 1.0 : 0.01;
                break;
            case AGI_ACTIVATION_SWISH:
                {
                    double sigmoid = 1.0 / (1.0 + exp(-input[i]));
                    output[i] = sigmoid + input[i] * sigmoid * (1.0 - sigmoid);
                }
                break;
            case AGI_ACTIVATION_GELU:
                // Simplified GELU derivative
                output[i] = 0.5 * (1.0 + tanh(sqrt(2.0 / M_PI) * (input[i] + 0.044715 * pow(input[i], 3))));
                break;
            default:
                output[i] = 1.0;
                break;
        }
    }
    
    return AGI_SUCCESS;
}
