/**
 * @file memory_management.c
 * @brief Memory management implementation
 * @author AGI Team
 * @version 1.0.0
 */

#include "agi_core.h"
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#ifdef _OPENMP
#include <omp.h>
#endif

// Global memory statistics
static agi_memory_stats_t g_memory_stats = {0};

/**
 * @brief Allocate aligned memory
 */
void* agi_aligned_alloc(size_t size, size_t alignment) {
    void* ptr = aligned_alloc(alignment, size);
    if (ptr) {
        g_memory_stats.total_memory += size;
        g_memory_stats.used_memory += size;
        g_memory_stats.allocation_count++;
        
        if (g_memory_stats.used_memory > g_memory_stats.peak_memory) {
            g_memory_stats.peak_memory = g_memory_stats.used_memory;
        }
    }
    return ptr;
}

/**
 * @brief Free aligned memory
 */
agi_error_t agi_aligned_free(void* ptr) {
    if (!ptr) return AGI_ERROR_NULL_POINTER;
    
    // Note: We can't easily track the size of freed memory
    // In a production system, you'd want to use a custom allocator
    g_memory_stats.deallocation_count++;
    
    free(ptr);
    return AGI_SUCCESS;
}

/**
 * @brief Get memory statistics
 */
agi_error_t agi_get_memory_stats(agi_memory_stats_t* stats) {
    if (!stats) return AGI_ERROR_NULL_POINTER;
    
    *stats = g_memory_stats;
    
    // Calculate fragmentation ratio
    if (g_memory_stats.peak_memory > 0) {
        stats->fragmentation_ratio = (double)(g_memory_stats.peak_memory - g_memory_stats.used_memory) / g_memory_stats.peak_memory;
    } else {
        stats->fragmentation_ratio = 0.0;
    }
    
    return AGI_SUCCESS;
}

/**
 * @brief Optimize memory usage
 */
agi_error_t agi_optimize_memory(void) {
    // In a production system, this would:
    // 1. Defragment memory
    // 2. Return unused memory to the OS
    // 3. Optimize allocation patterns
    
    // For now, just return success
    return AGI_SUCCESS;
}
