/**
 * Type declarations for native bindings
 */

declare module 'ffi-napi' {
  export interface Library {
    [key: string]: any;
  }
  
  export interface LibraryOptions {
    [key: string]: any;
  }
  
  export function Library(libFile: string, funcs: any, options?: LibraryOptions): Library;
}

declare module 'ref-napi' {
  export function alloc(type: any, value?: any): any;
  export function deref(ptr: any): any;
  export function get(ptr: any, offset?: number, type?: any): any;
  export function set(ptr: any, offset: number, value: any, type?: any): void;
  export function isNull(ptr: any): boolean;
  export const NULL: any;
  export const NULL_POINTER: any;
  
  export const types: {
    void: any;
    int8: any;
    uint8: any;
    int16: any;
    uint16: any;
    int32: any;
    uint32: any;
    int64: any;
    uint64: any;
    float: any;
    double: any;
    bool: any;
    char: any;
    uchar: any;
    short: any;
    ushort: any;
    int: any;
    uint: any;
    long: any;
    ulong: any;
    longlong: any;
    ulonglong: any;
    size_t: any;
    ssize_t: any;
    time_t: any;
    Object: any;
    CString: any;
    String: any;
    pointer: any;
  };
}
