//! FFI Bindings for Tensor Operations
//! 
//! Provides C-compatible FFI interface for tensor operations from TypeScript/JavaScript

use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_double, c_int};
use std::ptr;
use crate::tensor_ops::{Tensor, tensor_and, tensor_or, tensor_not, tensor_implies, 
                        einstein_summation, tensor_similarity, unify_tensors, apply_kernel};

/// FFI-safe tensor structure
#[repr(C)]
pub struct CTensor {
    shape_ptr: *mut usize,
    shape_len: usize,
    data_ptr: *mut c_double,
    data_len: usize,
    rank: usize,
}

impl From<&Tensor> for CTensor {
    fn from(tensor: &Tensor) -> Self {
        let mut shape = tensor.shape.clone();
        let mut data = tensor.data.clone();
        
        shape.shrink_to_fit();
        data.shrink_to_fit();
        
        let shape_ptr = shape.as_mut_ptr();
        let data_ptr = data.as_mut_ptr();
        let shape_len = shape.len();
        let data_len = data.len();
        
        // Leak the vectors - caller must free them
        std::mem::forget(shape);
        std::mem::forget(data);
        
        Self {
            shape_ptr,
            shape_len,
            data_ptr,
            data_len,
            rank: tensor.rank,
        }
    }
}

impl CTensor {
    /// Convert to Rust Tensor (takes ownership)
    unsafe fn to_tensor(self) -> Tensor {
        let shape = Vec::from_raw_parts(self.shape_ptr, self.shape_len, self.shape_len);
        let data = Vec::from_raw_parts(
            self.data_ptr,
            self.data_len,
            self.data_len,
        );
        
        Tensor {
            shape,
            data: data.into_iter().map(|x| x as f64).collect(),
            rank: self.rank,
        }
    }
    
    /// Create from Rust Tensor (transfers ownership)
    fn from_tensor(tensor: Tensor) -> Self {
        let mut shape = tensor.shape;
        let mut data: Vec<c_double> = tensor.data.into_iter().map(|x| x as c_double).collect();
        
        shape.shrink_to_fit();
        data.shrink_to_fit();
        
        let shape_ptr = shape.as_mut_ptr();
        let data_ptr = data.as_mut_ptr();
        let shape_len = shape.len();
        let data_len = data.len();
        
        std::mem::forget(shape);
        std::mem::forget(data);
        
        Self {
            shape_ptr,
            shape_len,
            data_ptr,
            data_len,
            rank: tensor.rank,
        }
    }
}

/// Free a CTensor (must be called from C/TypeScript)
#[no_mangle]
pub extern "C" fn tensor_free(tensor: *mut CTensor) {
    if tensor.is_null() {
        return;
    }
    
    unsafe {
        let ct = Box::from_raw(tensor);
        // Free the vectors
        if !ct.shape_ptr.is_null() {
            let _ = Vec::from_raw_parts(ct.shape_ptr, ct.shape_len, ct.shape_len);
        }
        if !ct.data_ptr.is_null() {
            let _ = Vec::from_raw_parts(ct.data_ptr, ct.data_len, ct.data_len);
        }
    }
}

/// Create tensor from arrays
#[no_mangle]
pub extern "C" fn tensor_create(
    shape_ptr: *const usize,
    shape_len: usize,
    data_ptr: *const c_double,
    data_len: usize,
) -> *mut CTensor {
    if shape_ptr.is_null() || data_ptr.is_null() {
        return ptr::null_mut();
    }
    
    unsafe {
        let shape = std::slice::from_raw_parts(shape_ptr, shape_len).to_vec();
        let data: Vec<f64> = std::slice::from_raw_parts(data_ptr, data_len)
            .iter()
            .map(|&x| x as f64)
            .collect();
        
        let tensor = Tensor::new(shape, data);
        Box::into_raw(Box::new(CTensor::from_tensor(tensor)))
    }
}

/// Tensor AND operation
#[no_mangle]
pub extern "C" fn tensor_and_ffi(
    tensor_a: *const CTensor,
    tensor_b: *const CTensor,
    result: *mut *mut CTensor,
) -> c_int {
    if tensor_a.is_null() || tensor_b.is_null() || result.is_null() {
        return -1;
    }
    
    unsafe {
        let a = (*tensor_a).to_tensor();
        let b = (*tensor_b).to_tensor();
        
        match tensor_and(&a, &b) {
            Ok(t) => {
                *result = Box::into_raw(Box::new(CTensor::from_tensor(t)));
                0
            }
            Err(_) => -1,
        }
    }
}

/// Tensor OR operation
#[no_mangle]
pub extern "C" fn tensor_or_ffi(
    tensor_a: *const CTensor,
    tensor_b: *const CTensor,
    result: *mut *mut CTensor,
) -> c_int {
    if tensor_a.is_null() || tensor_b.is_null() || result.is_null() {
        return -1;
    }
    
    unsafe {
        let a = (*tensor_a).to_tensor();
        let b = (*tensor_b).to_tensor();
        
        match tensor_or(&a, &b) {
            Ok(t) => {
                *result = Box::into_raw(Box::new(CTensor::from_tensor(t)));
                0
            }
            Err(_) => -1,
        }
    }
}

/// Tensor NOT operation
#[no_mangle]
pub extern "C" fn tensor_not_ffi(
    tensor: *const CTensor,
    result: *mut *mut CTensor,
) -> c_int {
    if tensor.is_null() || result.is_null() {
        return -1;
    }
    
    unsafe {
        let t = (*tensor).to_tensor();
        let not_t = tensor_not(&t);
        *result = Box::into_raw(Box::new(CTensor::from_tensor(not_t)));
        0
    }
}

/// Tensor IMPLIES operation
#[no_mangle]
pub extern "C" fn tensor_implies_ffi(
    tensor_a: *const CTensor,
    tensor_b: *const CTensor,
    result: *mut *mut CTensor,
) -> c_int {
    if tensor_a.is_null() || tensor_b.is_null() || result.is_null() {
        return -1;
    }
    
    unsafe {
        let a = (*tensor_a).to_tensor();
        let b = (*tensor_b).to_tensor();
        
        match tensor_implies(&a, &b) {
            Ok(t) => {
                *result = Box::into_raw(Box::new(CTensor::from_tensor(t)));
                0
            }
            Err(_) => -1,
        }
    }
}

/// Compute tensor similarity
#[no_mangle]
pub extern "C" fn tensor_similarity_ffi(
    tensor_a: *const CTensor,
    tensor_b: *const CTensor,
) -> c_double {
    if tensor_a.is_null() || tensor_b.is_null() {
        return 0.0;
    }
    
    unsafe {
        let a = (*tensor_a).to_tensor();
        let b = (*tensor_b).to_tensor();
        tensor_similarity(&a, &b) as c_double
    }
}

/// Apply kernel function
#[no_mangle]
pub extern "C" fn tensor_apply_kernel_ffi(
    kernel_type: *const c_char,
    tensor_a: *const CTensor,
    tensor_b: *const CTensor,
) -> c_double {
    if kernel_type.is_null() || tensor_a.is_null() || tensor_b.is_null() {
        return 0.0;
    }
    
    unsafe {
        let kernel_str = CStr::from_ptr(kernel_type).to_string_lossy();
        let a = (*tensor_a).to_tensor();
        let b = (*tensor_b).to_tensor();
        
        match apply_kernel(&kernel_str, &a, &b) {
            Ok(value) => value as c_double,
            Err(_) => 0.0,
        }
    }
}

