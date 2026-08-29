#!/bin/bash

set -e

SOURCE_FILE=${1:-main.c}
OUTPUT_FILE=${2:-main}

gcc "$SOURCE_FILE" -o "$OUTPUT_FILE"