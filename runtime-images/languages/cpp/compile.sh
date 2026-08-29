#!/bin/bash

set -e

SOURCE_FILE=${1:-main.cpp}
OUTPUT_FILE=${2:-main}

g++ "$SOURCE_FILE" -std=c++20 -o "$OUTPUT_FILE"