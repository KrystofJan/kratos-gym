#!/bin/bash
# TODO
# cd backend/API/

# node . &

# cd ../../frontend/

# npm run dev

gnome-terminal --title="Backend" -- bash -c "./run_be.sh; exec bash"

gnome-terminal --title="Frontend" -- bash -c "./run_fe.sh; exec bash"
