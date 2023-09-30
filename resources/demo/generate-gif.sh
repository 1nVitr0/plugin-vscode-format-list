#!/bin/bash

convert \
  -loop 0 \
  -delay 120 1.png \
  -delay 60 2.png \
  -delay 90 3.png \
  -delay 60 {4..7}.png \
  -delay 30 {8..9}.png \
  -delay 60 {10..11}.png \
  -delay 120 12.png \
  ../demo.gif