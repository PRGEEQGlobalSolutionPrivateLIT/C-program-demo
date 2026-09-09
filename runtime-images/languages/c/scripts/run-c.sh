#!/bin/bash

set -u

SOURCE_FILE="/workspace/main.c"
OUTPUT_FILE="/workspace/main"

if [ ! -f "$SOURCE_FILE" ]; then
    echo "SOURCE_FILE_NOT_FOUND"
    exit 10
fi

gcc \
    -std=c17 \
    -Wall \
    -Wextra \
    -O2 \
    "$SOURCE_FILE" \
    -o "$OUTPUT_FILE"

COMPILE_EXIT_CODE=$?

if [ $COMPILE_EXIT_CODE -ne 0 ]; then
    exit $COMPILE_EXIT_CODE
fi

"$OUTPUT_FILE"