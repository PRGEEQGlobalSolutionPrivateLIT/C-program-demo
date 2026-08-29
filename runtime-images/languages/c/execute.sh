#!/bin/bash

set -e

EXECUTABLE=${1:-./main}

timeout 10s "$EXECUTABLE"