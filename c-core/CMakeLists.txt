cmake_minimum_required(VERSION 3.16)
project(AGI_C_Core VERSION 1.0.0 LANGUAGES C CXX)

# Set C and C++ standards
set(CMAKE_C_STANDARD 17)
set(CMAKE_CXX_STANDARD 20)

# Enable SIMD optimizations
if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -mavx2 -mfma -march=native -O3")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -mavx2 -mfma -march=native -O3")
elseif(CMAKE_C_COMPILER_ID MATCHES "MSVC")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} /arch:AVX2 /O2")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /arch:AVX2 /O2")
endif()

# Enable OpenMP for parallel processing
find_package(OpenMP)
if(OpenMP_C_FOUND)
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${OpenMP_C_FLAGS}")
endif()

# Set output directories
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# Include directories
include_directories(include)
include_directories(src)

# Source files
set(SOURCES
    src/neural_operations.c
    src/memory_management.c
    src/optimization.c
    src/simd_operations.c
    src/matrix_operations.c
    src/activation_functions.c
)

# Header files
set(HEADERS
    include/agi_core.h
    include/neural_ops.h
    include/memory_mgmt.h
    include/optimization.h
    include/simd_ops.h
    include/matrix_ops.h
    include/activation_funcs.h
)

# Create shared library
add_library(agi_c_core SHARED ${SOURCES} ${HEADERS})

# Set library properties
set_target_properties(agi_c_core PROPERTIES
    VERSION ${PROJECT_VERSION}
    SOVERSION ${PROJECT_VERSION_MAJOR}
    OUTPUT_NAME "agi_c_core"
    POSITION_INDEPENDENT_CODE ON
)

# Link libraries
if(OpenMP_C_FOUND)
    target_link_libraries(agi_c_core OpenMP::OpenMP_C)
endif()

# Create static library
add_library(agi_c_core_static STATIC ${SOURCES} ${HEADERS})
set_target_properties(agi_c_core_static PROPERTIES
    VERSION ${PROJECT_VERSION}
    OUTPUT_NAME "agi_c_core"
    POSITION_INDEPENDENT_CODE ON
)

# Create test executable
enable_testing()
add_executable(agi_c_core_test tests/test_main.c)
target_link_libraries(agi_c_core_test agi_c_core)

# Install targets
install(TARGETS agi_c_core agi_c_core_static
    EXPORT AGICCoreTargets
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
)

install(FILES ${HEADERS} DESTINATION include/agi_c_core)

# Export targets
install(EXPORT AGICCoreTargets
    FILE AGICCoreTargets.cmake
    NAMESPACE AGICCore::
    DESTINATION lib/cmake/AGICCore
)

# Create config file
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    AGICCoreConfigVersion.cmake
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY SameMajorVersion
)

configure_package_config_file(
    AGICCoreConfig.cmake.in
    AGICCoreConfig.cmake
    INSTALL_DESTINATION lib/cmake/AGICCore
)

install(FILES
    ${CMAKE_CURRENT_BINARY_DIR}/AGICCoreConfig.cmake
    ${CMAKE_CURRENT_BINARY_DIR}/AGICCoreConfigVersion.cmake
    DESTINATION lib/cmake/AGICCore
)

# Performance testing
add_executable(performance_test tests/performance_test.c)
target_link_libraries(performance_test agi_c_core)

# Benchmark executable
add_executable(benchmark tests/benchmark.c)
target_link_libraries(benchmark agi_c_core)

# Documentation
find_package(Doxygen)
if(DOXYGEN_FOUND)
    set(DOXYGEN_IN ${CMAKE_CURRENT_SOURCE_DIR}/docs/Doxyfile.in)
    set(DOXYGEN_OUT ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile)
    
    configure_file(${DOXYGEN_IN} ${DOXYGEN_OUT} @ONLY)
    
    add_custom_target(docs ALL
        COMMAND ${DOXYGEN_EXECUTABLE} ${DOXYGEN_OUT}
        WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
        COMMENT "Generating API documentation with Doxygen"
        VERBATIM
    )
endif()

# Print configuration summary
message(STATUS "AGI C Core Configuration:")
message(STATUS "  Version: ${PROJECT_VERSION}")
message(STATUS "  C Standard: ${CMAKE_C_STANDARD}")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  SIMD Optimizations: Enabled")
message(STATUS "  OpenMP: ${OpenMP_C_FOUND}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "  Install Prefix: ${CMAKE_INSTALL_PREFIX}")
