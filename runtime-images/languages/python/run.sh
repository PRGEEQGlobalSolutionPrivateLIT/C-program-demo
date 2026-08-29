#!/bin/bash

set -e

SOURCE_FILE=${1:-main.py}

timeout 10s python "$SOURCE_FILE"