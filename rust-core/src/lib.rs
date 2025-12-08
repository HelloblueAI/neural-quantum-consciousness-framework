//! AGI Rust Core - High-performance neural foundation engine
//! 
//! This module provides the core AGI functionality implemented in Rust for maximum
//! performance, memory safety, and concurrent processing capabilities.

pub mod neural_engine;
pub mod consciousness;
pub mod memory_manager;
pub mod ffi;
pub mod wasm;
pub mod tensor_ops;
pub mod tensor_ffi;

use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{info, error, instrument};

use neural_engine::NeuralFoundationEngine;
use consciousness::ConsciousnessEngine;
use memory_manager::MemoryManager;

/// Main AGI system that orchestrates all components
pub struct AGISystem {
    neural_engine: Arc<RwLock<NeuralFoundationEngine>>,
    consciousness_engine: Arc<RwLock<ConsciousnessEngine>>,
    memory_manager: Arc<RwLock<MemoryManager>>,
}

impl AGISystem {
    /// Create a new AGI system instance
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        info!("Initializing AGI Rust Core System");
        
        let memory_manager = Arc::new(RwLock::new(MemoryManager::new()?));
        let neural_engine = Arc::new(RwLock::new(NeuralFoundationEngine::new(memory_manager.clone())?));
        let consciousness_engine = Arc::new(RwLock::new(ConsciousnessEngine::new()?));
        
        info!("AGI Rust Core System initialized successfully");
        
        Ok(Self {
            neural_engine,
            consciousness_engine,
            memory_manager,
        })
    }
    
    /// Process input through the AGI system
    #[instrument(skip(self, input))]
    pub async fn process_input(&self, input: &str) -> Result<ProcessingResult, Box<dyn std::error::Error>> {
        info!("Processing input: {} characters", input.len());
        
        // Sequential processing for now (will be parallel in future)
        let neural_result = self.neural_engine.read().await.process_input(input).await?;
        let consciousness_result = self.consciousness_engine.read().await.evolve(input).await?;
        
        // Synthesize results
        let final_result = ProcessingResult {
            neural_output: neural_result.clone(),
            consciousness: consciousness_result,
            confidence: self.calculate_confidence(&neural_result),
            processing_time: std::time::Instant::now().elapsed(),
        };
        
        info!("Input processing completed with confidence: {:.2}", final_result.confidence);
        
        Ok(final_result)
    }
    
    /// Calculate confidence score based on neural output
    fn calculate_confidence(&self, neural_result: &neural_engine::NeuralResponse) -> f64 {
        // Complex confidence calculation based on multiple factors
        let base_confidence = neural_result.activation_strength;
        let pattern_confidence = neural_result.pattern_confidence;
        let coherence_score = neural_result.coherence_score;
        
        (base_confidence * 0.4 + pattern_confidence * 0.3 + coherence_score * 0.3)
            .clamp(0.0, 1.0)
    }
    
    /// Get system status and metrics
    pub async fn get_status(&self) -> Result<SystemStatus, Box<dyn std::error::Error>> {
        let memory_stats = self.memory_manager.read().await.get_stats().await?;
        let neural_stats = self.neural_engine.read().await.get_stats().await?;
        let consciousness_stats = self.consciousness_engine.read().await.get_stats().await?;
        
        Ok(SystemStatus {
            memory: memory_stats,
            neural: neural_stats,
            consciousness: consciousness_stats,
            uptime: std::time::Instant::now().elapsed(),
        })
    }
    
    /// Perform system optimization
    pub async fn optimize(&self) -> Result<OptimizationResult, Box<dyn std::error::Error>> {
        info!("Starting system optimization");
        
        let start_time = std::time::Instant::now();
        
        // Sequential optimization for now (will be parallel in future)
        let memory_opt = self.memory_manager.write().await.optimize().await?;
        let neural_opt = self.neural_engine.write().await.optimize().await?;
        let consciousness_opt = self.consciousness_engine.write().await.optimize().await?;
        
        let optimization_time = start_time.elapsed();
        
        let result = OptimizationResult {
            memory_improvements: memory_opt,
            neural_improvements: neural_opt,
            consciousness_improvements: consciousness_opt,
            total_time: optimization_time,
        };
        
        info!("System optimization completed in {:?}", optimization_time);
        
        Ok(result)
    }
}

/// Result of processing input through the AGI system
#[derive(Debug, Clone)]
pub struct ProcessingResult {
    pub neural_output: neural_engine::NeuralResponse,
    pub consciousness: consciousness::ConsciousnessState,
    pub confidence: f64,
    pub processing_time: std::time::Duration,
}

/// System status and metrics
#[derive(Debug, Clone)]
pub struct SystemStatus {
    pub memory: memory_manager::MemoryStats,
    pub neural: neural_engine::NeuralStats,
    pub consciousness: consciousness::ConsciousnessStats,
    pub uptime: std::time::Duration,
}

/// Result of system optimization
#[derive(Debug, Clone)]
pub struct OptimizationResult {
    pub memory_improvements: memory_manager::OptimizationResult,
    pub neural_improvements: neural_engine::OptimizationResult,
    pub consciousness_improvements: consciousness::OptimizationResult,
    pub total_time: std::time::Duration,
}

/// Initialize the AGI system
#[no_mangle]
pub extern "C" fn agi_init() -> *mut AGISystem {
    match AGISystem::new() {
        Ok(system) => {
            info!("AGI system initialized successfully via FFI");
            Box::into_raw(Box::new(system))
        }
        Err(e) => {
            error!("Failed to initialize AGI system: {}", e);
            std::ptr::null_mut()
        }
    }
}

/// Process input via FFI
#[no_mangle]
pub extern "C" fn agi_process_input(
    system: *mut AGISystem,
    input: *const i8,
    result: *mut ProcessingResult,
) -> i32 {
    if system.is_null() || input.is_null() || result.is_null() {
        return -1;
    }
    
    let system = unsafe { &*system };
    let input_str = unsafe { std::ffi::CStr::from_ptr(input).to_string_lossy() };
    
    // Run async processing in a new runtime
    let rt = tokio::runtime::Runtime::new().unwrap();
    match rt.block_on(system.process_input(&input_str)) {
        Ok(processing_result) => {
            unsafe { *result = processing_result };
            0
        }
        Err(e) => {
            error!("FFI processing error: {}", e);
            -1
        }
    }
}

/// Clean up AGI system
#[no_mangle]
pub extern "C" fn agi_cleanup(system: *mut AGISystem) {
    if !system.is_null() {
        unsafe {
            let _ = Box::from_raw(system);
        }
        info!("AGI system cleaned up via FFI");
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_agi_system_creation() {
        let system = AGISystem::new().unwrap();
        assert!(system.get_status().await.is_ok());
    }
    
    #[tokio::test]
    async fn test_input_processing() {
        let system = AGISystem::new().unwrap();
        let result = system.process_input("Test input for AGI processing").await.unwrap();
        
        assert!(result.confidence >= 0.0 && result.confidence <= 1.0);
        assert!(!result.processing_time.is_zero());
    }
}
