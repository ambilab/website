#!/bin/bash
#
# Cursor Agent Stop Hook
#
# Runs lightweight quality checks when the agent completes a task.
# Only runs format + typecheck (not full preflight) for faster feedback.
#
# Input: JSON payload via stdin with conversation context
# Output: JSON with optional followup_message to continue the loop
#

set -euo pipefail

# Read the input payload from stdin
INPUT=$(cat)

# Parse the status and loop count from the input
STATUS=$(echo "$INPUT" | jq -r '.status // "unknown"')
LOOP_COUNT=$(echo "$INPUT" | jq -r '.loop_count // 0')

# Maximum iterations to prevent infinite loops
MAX_ITERATIONS=3

# Exit early if the agent was aborted or errored, or if we've exceeded max iterations
if [ "$STATUS" != "completed" ] || [ "$LOOP_COUNT" -gt "$MAX_ITERATIONS" ]; then
    echo '{}'
    exit 0
fi

# Run format check (fast)
echo "Running format check..." >&2
FORMAT_OUTPUT=$(pnpm format 2>&1) || FORMAT_EXIT_CODE=$?
FORMAT_EXIT_CODE=${FORMAT_EXIT_CODE:-0}

# Run typecheck (comprehensive but not as slow as full preflight)
echo "Running typecheck..." >&2
TYPECHECK_OUTPUT=$(pnpm typecheck 2>&1) || TYPECHECK_EXIT_CODE=$?
TYPECHECK_EXIT_CODE=${TYPECHECK_EXIT_CODE:-0}

# If both passed, show success and exit
if [ "$FORMAT_EXIT_CODE" -eq 0 ] && [ "$TYPECHECK_EXIT_CODE" -eq 0 ]; then
    # macOS notification for success (optional, fails silently on other platforms)
    osascript -e 'display notification "Format and typecheck passed" with title "Cursor Agent Complete"' 2>/dev/null || true
    echo '{}'
    exit 0
fi

# If checks failed and we haven't exceeded max iterations, ask agent to fix
if [ "$LOOP_COUNT" -lt "$MAX_ITERATIONS" ]; then
    FOLLOWUP_MESSAGE="[Auto-check iteration $((LOOP_COUNT + 1))/$MAX_ITERATIONS] Quality checks failed.\n\n"

    if [ "$FORMAT_EXIT_CODE" -ne 0 ]; then
        FORMAT_SUMMARY=$(echo "$FORMAT_OUTPUT" | head -15)
        FOLLOWUP_MESSAGE="${FOLLOWUP_MESSAGE}**Format issues:**\n\`\`\`\n${FORMAT_SUMMARY}\n\`\`\`\n\n"
    fi

    if [ "$TYPECHECK_EXIT_CODE" -ne 0 ]; then
        TYPECHECK_SUMMARY=$(echo "$TYPECHECK_OUTPUT" | head -15)
        FOLLOWUP_MESSAGE="${FOLLOWUP_MESSAGE}**Type errors:**\n\`\`\`\n${TYPECHECK_SUMMARY}\n\`\`\`\n\n"
    fi

    FOLLOWUP_MESSAGE="${FOLLOWUP_MESSAGE}Please fix these issues."

    # Output JSON with the followup message (escape for JSON)
    echo "{\"followup_message\": $(echo "$FOLLOWUP_MESSAGE" | jq -Rs .)}"
else
    # Max iterations reached, notify and stop
    osascript -e 'display notification "Quality checks still failing after '"$MAX_ITERATIONS"' attempts" with title "Cursor Agent - Manual Review Needed"' 2>/dev/null || true
    echo '{}'
fi
