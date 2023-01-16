#!/bin/bash
rand=$(($RANDOM % 99 + 1))

sed "${rand}q;d" ./quotes/quotes.txt | awk -F '[|]' '{printf "\${font DejaVu Serif:style=Bold:size=14}\${color0}%s\n", $1}' | sed 's/\\n/\n\ /g'

sed "${rand}q;d" ./quotes/quotes.txt | awk -F '[|]' '{printf "\${font DejaVu Serif:style=Italic:size=12}\${color1}%s", $2}' | sed 's/\"//g'
