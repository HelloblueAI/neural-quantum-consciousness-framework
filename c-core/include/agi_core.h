/**
 * @file agi_c_core.h
 * @brief AGI C Core - High-performance neural operations and memory management
 * @author AGI Team
 * @version 1.0.0
 * @date 2024
 * 
 * This header provides the core AGI functionality implemented in C for maximum
 * performance, direct hardware access, and optimized neural computations.
 */

#ifndef AGI_C_CORE_H
#define AGI_C_CORE_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

// Platform detection and SIMD support
#if defined(__x86_64__) || defined(_M_X64)
    #define AGI_X86_64 1
    #if defined(__AVX2__)
        #define AGI_AVX2_SUPPORT 1
    #endif
    #if defined(__FMA__)
        #define AGI_FMA_SUPPORT 1
    #endif
#elif defined(__aarch64__) || defined(_M_ARM64)
    #define AGI_ARM64 1
    #if defined(__ARM_NEON)
        #define AGI_NEON_SUPPORT 1
    #endif
#endif

// Error codes
typedef enum {
    AGI_SUCCESS = 0,
    AGI_ERROR_NULL_POINTER = -1,
    AGI_ERROR_INVALID_ARGUMENT = -2,
    AGI_ERROR_MEMORY_ALLOCATION = -3,
    AGI_ERROR_INVALID_OPERATION = -4,
    AGI_ERROR_NOT_IMPLEMENTED = -5,
    AGI_ERROR_SIMD_NOT_SUPPORTED = -6,
    AGI_ERROR_OPENMP_NOT_AVAILABLE = -7
} agi_error_t;

// Neural network configuration
typedef struct {
    size_t input_size;
    size_t hidden_layers_count;
    size_t* hidden_layer_sizes;
    size_t output_size;
    double learning_rate;
    double momentum;
    bool use_batch_normalization;
    bool use_dropout;
    double dropout_rate;
} agi_neural_config_t;

// Neural network layer
typedef struct {
    double* weights;
    double* biases;
    double* batch_norm_mean;
    double* batch_norm_variance;
    double* batch_norm_scale;
    double* batch_norm_shift;
    size_t input_size;
    size_t output_size;
    bool is_training;
} agi_neural_layer_t;

// Neural network
typedef struct {
    agi_neural_layer_t* layers;
    size_t layer_count;
    agi_neural_config_t config;
    double* input_buffer;
    double* output_buffer;
    double* gradient_buffer;
    size_t max_batch_size;
} agi_neural_network_t;

// Memory management
typedef struct {
    size_t total_memory;
    size_t used_memory;
    size_t peak_memory;
    size_t allocation_count;
    size_t deallocation_count;
    double fragmentation_ratio;
} agi_memory_stats_t;

// Performance metrics
typedef struct {
    double forward_pass_time;
    double backward_pass_time;
    double training_time;
    double inference_time;
    size_t operations_per_second;
    double memory_bandwidth_gbps;
    double cache_hit_ratio;
} agi_performance_metrics_t;

// Matrix operations result
typedef struct {
    double* data;
    size_t rows;
    size_t cols;
    bool transposed;
    size_t stride;
} agi_matrix_t;

// Vector operations result
typedef struct {
    double* data;
    size_t size;
    double norm;
    double sum;
    double mean;
    double variance;
} agi_vector_t;

// Activation function types
typedef enum {
    AGI_ACTIVATION_SIGMOID,
    AGI_ACTIVATION_TANH,
    AGI_ACTIVATION_RELU,
    AGI_ACTIVATION_LEAKY_RELU,
    AGI_ACTIVATION_SWISH,
    AGI_ACTIVATION_GELU,
    AGI_ACTIVATION_SOFTMAX
} agi_activation_type_t;

// Optimization configuration
typedef struct {
    bool use_simd;
    bool use_openmp;
    bool use_cache_optimization;
    bool use_memory_alignment;
    size_t cache_line_size;
    size_t memory_alignment;
    int openmp_threads;
} agi_optimization_config_t;

// ============================================================================
// Core AGI System Functions
// ============================================================================

/**
 * @brief Initialize the AGI C core system
 * @param config Optimization configuration
 * @return Error code
 */
agi_error_t agi_init_system(const agi_optimization_config_t* config);

/**
 * @brief Cleanup the AGI C core system
 * @return Error code
 */
agi_error_t agi_cleanup_system(void);

/**
 * @brief Get system information and capabilities
 * @return String containing system info (caller must free)
 */
char* agi_get_system_info(void);

// ============================================================================
// Neural Network Functions
// ============================================================================

/**
 * @brief Create a new neural network
 * @param config Network configuration
 * @return Pointer to neural network or NULL on error
 */
agi_neural_network_t* agi_create_neural_network(const agi_neural_config_t* config);

/**
 * @brief Destroy a neural network
 * @param network Network to destroy
 * @return Error code
 */
agi_error_t agi_destroy_neural_network(agi_neural_network_t* network);

/**
 * @brief Forward pass through the network
 * @param network Neural network
 * @param input Input data
 * @param output Output buffer
 * @param batch_size Batch size
 * @return Error code
 */
agi_error_t agi_forward_pass(
    agi_neural_network_t* network,
    const double* input,
    double* output,
    size_t batch_size
);

/**
 * @brief Backward pass for training
 * @param network Neural network
 * @param input Input data
 * @param target Target data
 * @param gradients Gradient buffer
 * @param batch_size Batch size
 * @return Error code
 */
agi_error_t agi_backward_pass(
    agi_neural_network_t* network,
    const double* input,
    const double* target,
    double* gradients,
    size_t batch_size
);

/**
 * @brief Train the network on a batch
 * @param network Neural network
 * @param input Input data
 * @param target Target data
 * @param batch_size Batch size
 * @return Loss value
 */
double agi_train_batch(
    agi_neural_network_t* network,
    const double* input,
    const double* target,
    size_t batch_size
);

// ============================================================================
// Matrix Operations
// ============================================================================

/**
 * @brief Matrix multiplication with SIMD optimization
 * @param a First matrix
 * @param b Second matrix
 * @param result Result matrix
 * @param m Rows of A
 * @param n Columns of B
 * @param k Columns of A / Rows of B
 * @return Error code
 */
agi_error_t agi_matrix_multiply_simd(
    const double* a,
    const double* b,
    double* result,
    size_t m,
    size_t n,
    size_t k
);

/**
 * @brief Matrix addition
 * @param a First matrix
 * @param b Second matrix
 * @param result Result matrix
 * @param size Total elements
 * @return Error code
 */
agi_error_t agi_matrix_add(
    const double* a,
    const double* b,
    double* result,
    size_t size
);

/**
 * @brief Matrix subtraction
 * @param a First matrix
 * @param b Second matrix
 * @param result Result matrix
 * @param size Total elements
 * @return Error code
 */
agi_error_t agi_matrix_subtract(
    const double* a,
    const double* b,
    double* result,
    size_t size
);

/**
 * @brief Element-wise matrix multiplication
 * @param a First matrix
 * @param b Second matrix
 * @param result Result matrix
 * @param size Total elements
 * @return Error code
 */
agi_error_t agi_matrix_element_multiply(
    const double* a,
    const double* b,
    double* result,
    size_t size
);

// ============================================================================
// Vector Operations
// ============================================================================

/**
 * @brief Vector dot product with SIMD
 * @param a First vector
 * @param b Second vector
 * @param size Vector size
 * @return Dot product result
 */
double agi_vector_dot_product_simd(
    const double* a,
    const double* b,
    size_t size
);

/**
 * @brief Vector addition
 * @param a First vector
 * @param b Second vector
 * @param result Result vector
 * @param size Vector size
 * @return Error code
 */
agi_error_t agi_vector_add(
    const double* a,
    const double* b,
    double* result,
    size_t size
);

/**
 * @brief Vector subtraction
 * @param a First vector
 * @param b Second vector
 * @param result Result vector
 * @param size Vector size
 * @return Error code
 */
agi_error_t agi_vector_subtract(
    const double* a,
    const double* b,
    double* result,
    size_t size
);

/**
 * @brief Vector scaling
 * @param vector Input vector
 * @param scalar Scaling factor
 * @param result Result vector
 * @param size Vector size
 * @return Error code
 */
agi_error_t agi_vector_scale(
    const double* vector,
    double scalar,
    double* result,
    size_t size
);

// ============================================================================
// Activation Functions
// ============================================================================

/**
 * @brief Apply activation function to vector
 * @param input Input vector
 * @param output Output vector
 * @param size Vector size
 * @param activation_type Activation function type
 * @return Error code
 */
agi_error_t agi_apply_activation(
    const double* input,
    double* output,
    size_t size,
    agi_activation_type_t activation_type
);

/**
 * @brief Apply activation function derivative
 * @param input Input vector
 * @param output Output vector
 * @param size Vector size
 * @param activation_type Activation function type
 * @return Error code
 */
agi_error_t agi_apply_activation_derivative(
    const double* input,
    double* output,
    size_t size,
    agi_activation_type_t activation_type
);

// ============================================================================
// Memory Management
// ============================================================================

/**
 * @brief Allocate aligned memory
 * @param size Size in bytes
 * @param alignment Alignment in bytes
 * @return Pointer to allocated memory or NULL on error
 */
void* agi_aligned_alloc(size_t size, size_t alignment);

/**
 * @brief Free aligned memory
 * @param ptr Pointer to memory to free
 * @return Error code
 */
agi_error_t agi_aligned_free(void* ptr);

/**
 * @brief Get memory statistics
 * @param stats Pointer to stats structure
 * @return Error code
 */
agi_error_t agi_get_memory_stats(agi_memory_stats_t* stats);

/**
 * @brief Optimize memory usage
 * @return Error code
 */
agi_error_t agi_optimize_memory(void);

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * @brief Start performance measurement
 * @param name Measurement name
 * @return Error code
 */
agi_error_t agi_performance_start(const char* name);

/**
 * @brief Stop performance measurement
 * @param name Measurement name
 * @return Elapsed time in seconds
 */
double agi_performance_stop(const char* name);

/**
 * @brief Get performance metrics
 * @param metrics Pointer to metrics structure
 * @return Error code
 */
agi_error_t agi_get_performance_metrics(agi_performance_metrics_t* metrics);

// ============================================================================
// Optimization Functions
// ============================================================================

/**
 * @brief Optimize neural network performance
 * @param network Neural network to optimize
 * @return Error code
 */
agi_error_t agi_optimize_neural_network(agi_neural_network_t* network);

/**
 * @brief Set optimization configuration
 * @param config Optimization configuration
 * @return Error code
 */
agi_error_t agi_set_optimization_config(const agi_optimization_config_t* config);

/**
 * @brief Get current optimization configuration
 * @param config Pointer to configuration structure
 * @return Error code
 */
agi_error_t agi_get_optimization_config(agi_optimization_config_t* config);

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * @brief Get last error message
 * @return Error message string
 */
const char* agi_get_last_error(void);

/**
 * @brief Clear error state
 */
void agi_clear_error(void);

/**
 * @brief Get version information
 * @return Version string
 */
const char* agi_get_version(void);

/**
 * @brief Check if SIMD is supported
 * @return true if SIMD is supported, false otherwise
 */
bool agi_is_simd_supported(void);

/**
 * @brief Check if OpenMP is available
 * @return true if OpenMP is available, false otherwise
 */
bool agi_is_openmp_available(void);

// ============================================================================
// Batch Processing
// ============================================================================

/**
 * @brief Process batch with parallel optimization
 * @param network Neural network
 * @param input_batch Input batch data
 * @param output_batch Output batch buffer
 * @param batch_size Batch size
 * @param num_threads Number of threads to use
 * @return Error code
 */
agi_error_t agi_process_batch_parallel(
    agi_neural_network_t* network,
    const double* input_batch,
    double* output_batch,
    size_t batch_size,
    int num_threads
);

/**
 * @brief Train batch with parallel optimization
 * @param network Neural network
 * @param input_batch Input batch data
 * @param target_batch Target batch data
 * @param batch_size Batch size
 * @param num_threads Number of threads to use
 * @return Average loss
 */
double agi_train_batch_parallel(
    agi_neural_network_t* network,
    const double* input_batch,
    const double* target_batch,
    size_t batch_size,
    int num_threads
);

// ============================================================================
// Advanced Features
// ============================================================================

/**
 * @brief Enable/disable batch normalization
 * @param network Neural network
 * @param enabled true to enable, false to disable
 * @return Error code
 */
agi_error_t agi_set_batch_normalization(
    agi_neural_network_t* network,
    bool enabled
);

/**
 * @brief Enable/disable dropout
 * @param network Neural network
 * @param enabled true to enable, false to disable
 * @param rate Dropout rate (0.0 to 1.0)
 * @return Error code
 */
agi_error_t agi_set_dropout(
    agi_neural_network_t* network,
    bool enabled,
    double rate
);

/**
 * @brief Save neural network to file
 * @param network Neural network
 * @param filename Output filename
 * @return Error code
 */
agi_error_t agi_save_neural_network(
    const agi_neural_network_t* network,
    const char* filename
);

/**
 * @brief Load neural network from file
 * @param filename Input filename
 * @return Pointer to loaded network or NULL on error
 */
agi_neural_network_t* agi_load_neural_network(const char* filename);

#ifdef __cplusplus
}
#endif

#endif // AGI_C_CORE_H
