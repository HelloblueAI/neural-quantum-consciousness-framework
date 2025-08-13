//! FFI Module - Foreign Function Interface for AGI
//! 
//! This module provides FFI capabilities for cross-language communication.

use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use tracing::info;

/// FFI error codes
#[repr(C)]
pub enum FFIError {
    Success = 0,
    NullPointer = -1,
    InvalidArgument = -2,
    MemoryAllocation = -3,
    InvalidOperation = -4,
}

/// FFI result wrapper
#[repr(C)]
pub struct FFIResult<T> {
    pub error_code: FFIError,
    pub data: T,
}

impl<T> FFIResult<T> {
    /// Create a successful result
    pub fn success(data: T) -> Self {
        Self {
            error_code: FFIError::Success,
            data,
        }
    }

    /// Create an error result
    pub fn error(error_code: FFIError, data: T) -> Self {
        Self {
            error_code,
            data,
        }
    }
}

/// Convert Rust string to C string
pub fn rust_string_to_c_string(s: &str) -> *mut c_char {
    match CString::new(s) {
        Ok(c_string) => c_string.into_raw(),
        Err(_) => std::ptr::null_mut(),
    }
}

/// Convert C string to Rust string
pub unsafe fn c_string_to_rust_string(c_string: *const c_char) -> Option<String> {
    if c_string.is_null() {
        return None;
    }
    
    CStr::from_ptr(c_string).to_str().ok().map(|s| s.to_string())
}

/// Free C string
pub unsafe fn free_c_string(c_string: *mut c_char) {
    if !c_string.is_null() {
        let _ = CString::from_raw(c_string);
    }
}

/// FFI initialization function
#[no_mangle]
pub extern "C" fn agi_ffi_init() -> FFIError {
    info!("AGI FFI module initialized");
    FFIError::Success
}

/// FFI cleanup function
#[no_mangle]
pub extern "C" fn agi_ffi_cleanup() -> FFIError {
    info!("AGI FFI module cleaned up");
    FFIError::Success
}
