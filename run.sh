#!/bin/bash
# TODO
cd backend/API/

node . &

cd ../../frontend/

npm run dev

killall node
