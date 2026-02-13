#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY=0, skipping"
    exit 0
  fi

  if [ -f "$HOME/.huskyrc" ]; then
    debug "sourcing $HOME/.huskyrc"
    . "$HOME/.huskyrc"
  fi

  export husky_skip_init=1
  sh -e "$0" "$@"
  exit $?
fi
