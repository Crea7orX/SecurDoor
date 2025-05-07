cmake_minimum_required(VERSION 3.16.0)

project(SecurDoor VERSION 1.0.0 LANGUAGES C CXX)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

set(SRC_DIR "${CMAKE_SOURCE_DIR}/src")
set(INCLUDE_DIR "${CMAKE_SOURCE_DIR}/include")

include_directories(${INCLUDE_DIR})
file(GLOB_RECURSE SOURCES "${SRC_DIR}/*.c" "${SRC_DIR}/*.cpp")

add_executable(${PROJECT_NAME}.elf ${SOURCES})

include($ENV{IDF_PATH}/tools/cmake/project.cmake)

project(SecurDoor)
