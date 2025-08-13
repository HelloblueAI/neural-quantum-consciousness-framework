#include "agi_core.h"
#include <string.h>

agi_error_t agi_matrix_add(const double* a, const double* b, double* result, size_t size) {
    if (!a || !b || !result) return AGI_ERROR_NULL_POINTER;
    
    for (size_t i = 0; i < size; i++) {
        result[i] = a[i] + b[i];
    }
    return AGI_SUCCESS;
}

agi_error_t agi_matrix_subtract(const double* a, const double* b, double* result, size_t size) {
    if (!a || !b || !result) return AGI_ERROR_NULL_POINTER;
    
    for (size_t i = 0; i < size; i++) {
        result[i] = a[i] - b[i];
    }
    return AGI_SUCCESS;
}

agi_error_t agi_matrix_element_multiply(const double* a, const double* b, double* result, size_t size) {
    if (!a || !b || !result) return AGI_ERROR_NULL_POINTER;
    
    for (size_t i = 0; i < size; i++) {
        result[i] = a[i] * b[i];
    }
    return AGI_SUCCESS;
}
