# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

> **⚠️ CRITICAL INSTRUCTION FOR CLAUDE:**
>
> **ALWAYS START BY READING THE "STATUS Project Status Check" SECTION BELOW.**
>
> Do NOT proceed with any work until you've determined whether this is:
> - ❶ A NEW PROJECT (needs initialization)
> - ❷ An EXISTING PROJECT (has session history)
> - ❸ INITIALIZED BUT NO SESSIONS (folder exists, but no documentation yet)
>
> The status check will direct you to the appropriate workflow (IF: NEW PROJECT, IF: EXISTING PROJECT, or IF: INITIALIZED BUT NO SESSIONS).

---

## INIT /init Command Override Instructions

  **FOR CLAUDE: When user invokes `/init` command in a project directory:**

  ### Step 1: Copy & Customize Template
  1. Copy `~/.claude/CLAUDE.md` to `./CLAUDE.md` in current project
  2. Auto-fill placeholders by analyzing the project:

  #### Placeholder Detection Strategy
  - **[PROJECT_NAME]**:
    - Try `git remote -v` → parse repo name
    - Fallback to `basename $(pwd)`
    - Last resort: Ask user

  - **[DOCS_FOLDER]**:
    - Default: `docs/`
    - Ask user: "Where should I store session files? (docs/, Docs/, .sessions/)"

  - **[TECH_STACK]**:
    - Scan for: `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`, `*.csproj`
    - Parse dependencies to determine stack
    - Examples: "React + TypeScript + Vite", "Python + FastAPI + PostgreSQL"

  - **[LANGUAGES]**:
    - Run: `find . -type f -name "*.*" | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -5`
    - Map extensions to languages: .ts/.tsx → TypeScript, .py → Python, .rs → Rust, etc.

  - **[FRAMEWORKS]**:
    - Parse from dependencies in package.json, requirements.txt, etc.
    - Common patterns: React, Next.js, Vue, Django, FastAPI, Express, etc.

  - **Architecture Highlights**:
    - Scan directory structure for patterns:
      - `src/api/` or `routes/` → API architecture
      - `components/` → Component-based frontend
      - `models/` → Database models
      - `services/` → Service layer
      - `docker-compose.yml` → Containerized deployment
    - Make educated guesses, document them in CLAUDE.md

  ### Step 2: Execute "IF: NEW PROJECT" Workflow
  Follow the exact checklist from § IF: NEW PROJECT:
  1. ✅ Customize CLAUDE.md (just completed above)
  2. Create docs directory
  3. Create INDEX.md from template
  4. Create 001.md with initial session documentation
  5. Initialize Cognee knowledge graph (if MCP available)
  6. Verify setup checklist
  7. Stage files for git commit (but don't commit yet)

  ### Step 3: Standard /init Behavior
  Continue with whatever the base `/init` command normally does:
  - Create README.md if missing
  - Initialize git if not already initialized
  - Create .gitignore if missing
  - Set up any other standard project files

  ### Step 4: Final Confirmation
  Present user with:
  ✅ Project initialized with Claude Code documentation system

  Created:
  - ./CLAUDE.md (customized for this project)
  - ./docs/ (session documentation folder)
  - ./docs/INDEX.md (session index)
  - ./docs/001.md (session 1 started)

  Detected:
  - Project: ok2pan
  - Stack: React + Vite + Tailwind CSS
  - Languages: JavaScript, JSON, HTML
  - Frameworks: React 19, HeroUI, Framer Motion

  Next steps:
  - Review ./CLAUDE.md and adjust as needed
  - Run: git add CLAUDE.md docs/
  - Run: git commit -m "Initialize Claude Code documentation system"
  - Start working: I'll track everything in session files

  ### Step 5: Ask About Cognee (if MCP available)
  If Cognee MCP is detected:
  Would you like me to initialize the Cognee knowledge graph now?
  This will:
  - Index the entire codebase (cognify handles all content types including code)
  - Extract patterns and structure
  - Enable intelligent context retrieval for future sessions

  [Yes] [No, I'll do it later]

## STATUS Project Status Check (START HERE)

**IMPORTANT: Before proceeding, Claude should run this validation check to determine project state.**

### Automatic Status Assessment

When Claude first encounters this CLAUDE.md file, it should run these validation checks:

#### Claude's Validation Script (Run These Commands)

```bash
# Step 1: Check for docs folder existence
# Try common folder names: docs/, Docs/, .sessions/
ls -la | grep -E "docs|Docs|\.sessions"

# Step 2: If docs folder found, check for session files
ls -la docs/*.md 2>/dev/null | grep -E "[0-9]{3}\.md"
# or
ls -la Docs/*.md 2>/dev/null | grep -E "[0-9]{3}\.md"

# Step 3: Check if CLAUDE.md has placeholders (needs customization)
grep -E "\[PROJECT_NAME\]|\[DOCS_FOLDER\]|\[TECH_STACK\]" CLAUDE.md

# Step 4: Check Cognee status (if MCP available)
# This is optional - only if Cognee MCP is installed
```

#### Validation Results → Workflow Mapping

Based on the commands above:

1. **Check for Documentation Folder**
   - **IF** `ls` shows `docs/` or `Docs/` or `.sessions/` → Folder EXISTS
   - **IF** `ls` shows nothing → Folder DOES NOT EXIST → **NEW PROJECT**

2. **Check for Session Files** (if docs folder exists)
   - **IF** `ls docs/*.md` shows `001.md`, `002.md`, etc. → Session files EXIST → **EXISTING PROJECT**
   - **IF** `ls docs/*.md` shows "No such file" → No session files → **INITIALIZED BUT NO SESSIONS**

3. **Check for Customization**
   - **IF** `grep` finds `[PROJECT_NAME]` or other placeholders → **NEEDS CUSTOMIZATION**
   - **IF** `grep` finds nothing → CLAUDE.md is customized → **READY TO USE**

4. **Check Cognee Status** (optional)
   - Run: `@agent-swarm-orchestrator List all datasets in Cognee`
   - **IF** datasets exist → Cognee INITIALIZED
   - **IF** empty or error → Cognee NOT INITIALIZED

### Decision Tree

Based on the checks above, follow the appropriate workflow:

```
┌─────────────────────────────────────┐
│  Does docs exist?                   │
└──────────┬──────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
   YES            NO
    │             │
    ▼             ▼
Are there     [NEW PROJECT]
session       Go to § Quick
files?        Start: New
    │         Project Setup
    │
┌───┴───┐
│       │
YES     NO
│       │
▼       ▼
[EXISTING  [INITIALIZED
PROJECT]   BUT NO SESSIONS]
Go to §    Go to § Quick
Quick      Start: First
Start:     Session Setup
Continue
Work
```

---

## QUICK Quick Start

### IF: NEW PROJECT (First-Time Setup)

**Condition:** docs does NOT exist, OR CLAUDE.md still has `[PLACEHOLDER]` values.

**Follow these steps:**

1. **Customize This CLAUDE.md File**
   - [ ] Replace `[PROJECT_NAME]` with your actual project name
   - [ ] Replace `[DOCS_FOLDER]` with your chosen folder (e.g., `docs/`, `Docs/`, `.sessions/`)
   - [ ] Replace `[TECH_STACK]` with your actual stack (e.g., "Next.js + TypeScript + Prisma")
   - [ ] Replace `[LANGUAGES]` with primary languages (e.g., "TypeScript, Python")
   - [ ] Replace `[FRAMEWORKS]` with key frameworks (e.g., "React, FastAPI")
   - [ ] Update "Architecture Highlights" section with your project's patterns
   - [ ] Customize "Domain-Specific Cognee Query Examples" for your domain
   - [ ] Configure optional integrations (Error Monitoring, CI/CD, etc.) if applicable

2. **Create Documentation Folder**
   ```bash
   # Create the folder specified in docs
   mkdir -p docs/  # or your chosen folder name
   ```

3. **Create INDEX.md**
   ```bash
   # Create docs/INDEX.md following the template in § Session Documentation
   # This will track all session files and active blockers
   ```

4. **Create First Session File**
   ```bash
   # Create docs/001.md following the session template (§ Session Documentation)
   # Document the initial setup and project goals
   ```

5. **Initialize Knowledge Graph** (if using Cognee)
   ```bash
   @agent-swarm-orchestrator Initialize Cognee knowledge graph for this project

   # This will:
   # - Extract developer rules from CLAUDE.md
   # - Structure the entire codebase (cognify handles all content including code)
   # - Build initial knowledge graph
   # - Verify with status checks
   ```

6. **Verify Setup**
   - [ ] CLAUDE.md has no remaining `[PLACEHOLDER]` values
   - [ ] docs directory exists
   - [ ] INDEX.md created with initial structure
   - [ ] 001.md created with session 1 documentation
   - [ ] Cognee initialized (if using): `@agent-swarm-orchestrator List Cognee datasets` shows data

7. **Commit to Git**
   ```bash
   git add CLAUDE.md docs/
   git commit -m "Initialize Claude Code documentation system"
   ```

---

### IF: EXISTING PROJECT (Continuing Work)

**Condition:** docs EXISTS and contains session files (e.g., 001.md, 002.md).

**Follow these steps:**

1. **Query Cognee Knowledge Graph** (if enabled, automatic with swarm)
   ```bash
   # Swarm-orchestrator automatically queries Cognee at session start
   # Or manually query for specific context:
   @agent-swarm-orchestrator Search knowledge graph for [topic related to current work]
   ```

2. **Find Most Recent Session File**
   ```bash
   # Look in docs for the highest numbered file
   # Example: If 001.md through 030.md exist → Read 030.md
   ```

3. **Review Session Context**
   - Read the "Next Session Focus" section → This is your priority list
   - Check "🔴 Current Blockers" → Any blocking issues to resolve?
   - Review "⏳ Remaining / Next Session" tasks → What's incomplete?
   - Check "🔄 In Progress" items → What was being worked on?

4. **Review INDEX.md**
   - Check "Active Blockers" table → Any unresolved issues across sessions?
   - Review "Current Focus" → What's the project's overall direction?
   - Check "High-Priority Backlog" → What's planned next?

5. **Start Work**
   - Work on prioritized tasks from "Next Session Focus"
   - Update knowledge graph incrementally (if using Cognee + swarm)
   - Document attempts, findings, and decisions as you go

6. **End of Session: Create New Session File**
   ```bash
   # At end of work session, create next numbered file
   # Example: If last was 030.md → Create 031.md
   @agent-swarm-orchestrator Create session documentation file

   # Swarm will:
   # - Create numbered .md file in docs
   # - Carry forward incomplete tasks
   # - Document all changes and decisions
   # - Add session to knowledge graph (if Cognee enabled)
   # - Update INDEX.md with new session entry
   ```

---

### IF: INITIALIZED BUT NO SESSIONS

**Condition:** docs EXISTS, but NO session files (001.md, 002.md, etc.).

**This means the folder structure is created but documentation hasn't started.**

**Follow these steps:**

1. **Verify CLAUDE.md is Customized**
   - Check if `[PLACEHOLDER]` values are still present
   - If yes → Go to "IF: NEW PROJECT" workflow to customize
   - If no → Proceed to step 2

2. **Create First Session File**
   ```bash
   # Create docs/001.md (or your docs/001.md)
   # Follow the session template in § Session Documentation
   # Document what you're starting to work on
   ```

3. **Create INDEX.md** (if missing)
   ```bash
   # Create docs/INDEX.md with initial structure
   # See § Index File template
   ```

4. **Initialize Cognee** (if not done yet)
   ```bash
   @agent-swarm-orchestrator Initialize Cognee knowledge graph
   ```

5. **Begin Work**
   - Follow "IF: EXISTING PROJECT" workflow for subsequent sessions

---

## 🧠 Cognee Knowledge Graph Integration

**Optional but Recommended:** This project can use Cognee MCP for persistent project memory. All context, decisions, patterns, and learnings are stored in a local knowledge graph.

### Why Use Cognee?

- **Context Accumulation**: Every decision, bug fix, and pattern discovered is preserved
- **Smart Retrieval**: Query past implementations, architectural decisions, and debug histories
- **Pattern Recognition**: Automatically identifies recurring solutions and best practices
- **Zero API Costs**: Runs entirely local with Ollama

### Workflow Integration

For **complex, multi-step tasks**, use the **swarm-orchestrator agent** (`@agent-swarm-orchestrator`):

1. **Pre-Task Query**: Searches knowledge graph for relevant context, patterns, and past solutions
2. **During Execution**: Updates knowledge graph at key milestones, persists decisions
3. **Post-Task Persist**: Saves complete interaction, builds connections between concepts

### Knowledge Graph Commands

```bash
# Initialize (run once for new projects)
@agent-swarm-orchestrator Initialize Cognee knowledge graph

# Check status
@agent-swarm-orchestrator List all datasets in Cognee

# Maintenance (monthly recommended)
@agent-swarm-orchestrator Re-run cognify on repository

# Query specific topics
@agent-swarm-orchestrator Search knowledge graph for [topic]
```

### Search Types

- **GRAPH_COMPLETION**: Complex analysis, "why" questions (slowest, most intelligent)
- **CHUNKS**: Fast fact-finding, specific content retrieval (fastest)
- **CODE**: Code-specific queries with syntax understanding
- **SUMMARIES**: Quick overviews, pre-computed summaries
- **FEELING_LUCKY**: Auto-selects optimal search type (default)

---

## 📋 Documentation Management: Task-Oriented Session Logs

**CRITICAL: This project uses numbered session documentation in `docs` folder.**

### Session Documentation System

Each conversation creates a **new numbered `.md` file** that serves as both a record AND context source for subsequent sessions.

**Purpose:**
- Track features, issues, and debug attempts across sessions
- Maintain task state (what's done, what's remaining, what's blocked)
- Provide Claude with continuous project context
- Version control for decision-making and problem-solving
- Automatically enriches Cognee knowledge graph (if enabled)

### Session File Template: `docs/XXX.md`

```markdown
# Session 001: [Brief Title]

**Date:** YYYY-MM-DD
**Status:** 🟢 In Progress / 🔴 Blocked / ✅ Complete

## Objective
Clear statement of what this session is attempting to accomplish

## Tasks

### ✅ Completed This Session
- [x] Task item 1
- [x] Task item 2

### 🔄 In Progress
- [ ] Task item 3
- [ ] Task item 4

### ⏳ Remaining / Next Session
- [ ] Task item 5
- [ ] Task item 6

## Features

### ✅ Implemented
- Feature A (Session 001)
- Feature B (Session 001)

### 🔄 In Development
- Feature C - Currently debugging [issue]

### 📋 Backlog
- Feature D
- Feature E

## Issues & Debugging

### 🔴 Current Blockers
**Issue: [Description]**
- Status: Blocked since Session XXX
- Attempted: [what we tried]
- Next: [what we haven't tried yet]
- Related: [link to relevant code/config]

### ✅ Resolved Issues
**Issue: [Description]** → Resolved in Session XXX
- Solution: [what fixed it]
- Why it worked: [explanation]

## Code Changes
```
Modified: [file path]
  → [description of changes]
New: [file path]
  → [description]
Deleted: [file path]
  → [reason]
```

## Dependencies / Config Changes
- Added/Updated: [dependency]
- Removed: [dependency]
- Config: [changes to env, config files, etc]

## Questions / Decisions Pending
- [ ] [Question or decision needed]

## Next Session Focus
Priority order for next conversation:
1. [Top priority task]
2. [Second priority task]
3. [Third priority task]

## Context Links
- Previous: `docs/XXX.md`
- Related: `docs/XXX.md`
- Reference: CLAUDE.md § [Section Name]

---
*Last updated: [timestamp] by Claude*
*Cognified: [timestamp] - Added to knowledge graph* (if using Cognee)
```

### Session File Naming
- **001.md** = First session
- **002.md** = Second session
- **999.md** = Maximum support (easily extendable)
- Always zero-padded (001, 002, ..., 099, 100) for proper sorting

### Claude's Workflow for Session Files

**At Start of Session:**
1. Query Cognee knowledge graph (if enabled)
2. Read the most recent session file (e.g., `docs/030.md`)
3. Check the "Next Session Focus" section
4. Review any "🔴 Current Blockers"
5. Understand "⏳ Remaining / Next Session" tasks

**During Session:**
- Work on prioritized tasks
- Document what's being attempted
- Note any new issues discovered
- Track debug attempts
- Update knowledge graph incrementally (if using Cognee)

**At End of Session:**
1. Create new numbered file (e.g., `docs/043.md`)
2. Check off ✅ completed items from previous session
3. Move incomplete items to new session's "⏳ Remaining"
4. Document what was tried, what worked, what didn't
5. Set "Next Session Focus" with clear priorities
6. Cognify entire session (if using Cognee)

### Index File: `docs/INDEX.md`

Maintain an index of all session files with quick reference:

```markdown
# Session Index

| Session | Date | Status | Focus | Key Outcome |
|---------|------|--------|-------|------------|
| 001 | YYYY-MM-DD | ✅ | [Brief focus] | [Key outcome] |
| 002 | YYYY-MM-DD | ✅ | [Brief focus] | [Key outcome] |
| 003 | YYYY-MM-DD | 🔴 | [Brief focus] | [Blocker description] |

## Active Blockers
- Session XXX: [Blocker description] → [Resolution status]

## Current Focus (Session XXX+)
[Current development focus and priorities]

## High-Priority Backlog
1. [Priority item 1]
2. [Priority item 2]
3. [Priority item 3]
```

### Benefits

✅ **Claude always knows project state** - No context-switching between conversations
✅ **Issue tracking without external tools** - Everything in git alongside code
✅ **Debug history** - "What did we try?" becomes searchable and referenceable
✅ **Decision audit trail** - Why did we do X? See session file
✅ **Onboarding** - New team members read session files to understand project evolution
✅ **Version control** - `git log -- docs/` shows project progression
✅ **Knowledge Graph Enrichment** - Every session makes Cognee smarter about the project (if enabled)
✅ **Cross-Session Intelligence** - Bug fixes from Session 010 inform debugging in Session 050

---

## 🎯 Project-Specific Customization

**This section should be customized for your project.** Replace placeholders with your actual values.

### Project Variables

- **Project Name**: `ok2pan`
- **Docs Folder**: `docs/`
- **Tech Stack**: `React 19 + Vite + Tailwind CSS 4`
- **Primary Languages**: `JavaScript, JSX, JSON`
- **Key Frameworks**: `React 19, HeroUI, Framer Motion, React Router, Culori (color manipulation)`

### Architecture Highlights

*Document your project's key architectural patterns here:*

- **Architecture Pattern**: Single Page Application (SPA) with component-based architecture
- **Data Layer**: Static JSON data (colors.json) with client-side color manipulation using Culori library
- **API Design**: N/A - Static client-side application
- **State Management**: React Context API and local component state
- **Authentication**: N/A - No authentication required
- **Deployment**: Static site (Vite build output)
- **Special Features**:
  - ACB (Adobe Color Book) file generation from Pantone colors
  - LAB color space conversion for accurate color representation
  - Color search and browsing interface
  - Animation with Anime.js and Framer Motion

### Domain-Specific Cognee Query Examples

*Customize these examples for your project's domain:*

**Color Management & ACB Generation:**
- "How does the ACB file generation work?" → Retrieves generate-acb.js code + LAB conversion logic
- "What were the LAB color space conversion issues?" → Pulls related sessions + color accuracy fixes
- "Show me color manipulation patterns" → Finds all Culori usage + color transformation code
- "What's the current ACB file format implementation?" → Aggregates sessions + ACB specification code

**React Component Architecture:**
- "How is the component structure organized?" → Retrieves src/components/ hierarchy + routing
- "What were the state management issues?" → Pulls related sessions + context implementation
- "Show me animation patterns" → Finds all Anime.js and Framer Motion usage
- "What's the current routing configuration?" → Aggregates React Router setup + page structure

**Build & Development:**
- "How is the Vite configuration structured?" → Retrieves vite.config.js + build settings
- "What were the Tailwind CSS setup issues?" → Pulls related sessions + PostCSS config
- "Show me development workflow patterns" → Finds package.json scripts + dev commands
- "What's the current build output structure?" → Aggregates build process + deployment setup

### Coding Standards & Preferences

*Document your project's coding conventions:*

- **Code Style**: ESLint with default React configuration
- **Commit Convention**: Informal/descriptive commits
- **Testing Strategy**: Manual testing (no automated tests configured yet)
- **Documentation**: Inline comments and README
- **PR Process**: Direct commits to main (personal project)

---

## 🔌 Optional Integrations

**These sections are optional.** Include them if you use these tools in your project.

### Error Monitoring (Template)

<details>
<summary>Click to expand error monitoring integration guide</summary>

**Tool**: Not currently configured

#### Fetching Recent Errors via API

**Setup:**
- API Endpoint: `N/A`
- Auth Token: Use `N/A` environment variable
- Project ID: `N/A`

**Example Query:**
```bash
# Not configured
```

#### Error Investigation Workflow

When Claude fetches errors:
1. Get full stack traces
2. See error frequency and affected users
3. Review context/breadcrumbs
4. Identify error patterns
5. Suggest fixes based on error context

#### Dashboard Links
- **Issues**: `N/A`
- **Releases**: `N/A`

</details>

### CI/CD Integration (Template)

<details>
<summary>Click to expand CI/CD integration guide</summary>

**Tool**: Not currently configured (manual deployment)

#### Pipeline Configuration
- **Build Pipeline**: `N/A`
- **Test Pipeline**: `N/A`
- **Deploy Pipeline**: `N/A`

#### Common Commands
```bash
# Run tests locally
npm run lint

# Build for production
npm run build

# Deploy to staging
N/A

# Deploy to production
N/A
```

#### Pipeline Status
- **Status Dashboard**: `N/A`
- **Deployment History**: `N/A`

</details>

### Analytics / Logging (Template)

<details>
<summary>Click to expand analytics integration guide</summary>

**Tool**: Not currently configured

#### Analytics Setup
- **Dashboard**: `N/A`
- **Key Metrics**: N/A
- **Event Tracking**: N/A

#### Logging Infrastructure
- **Tool**: Browser DevTools Console
- **Log Aggregation**: `N/A`
- **Query Syntax**: N/A

</details>

---

## 📚 Useful Links

**Framework/Language Documentation:**
- React: `https://react.dev`
- Vite: `https://vitejs.dev`
- Tailwind CSS: `https://tailwindcss.com`

**Third-Party Services:**
- HeroUI: `https://heroui.com`
- Culori (color library): `https://culorijs.org`
- Framer Motion: `https://www.framer.com/motion`

**Project-Specific:**
- GitHub Repository: `https://github.com/blas0/ok2pan`
- ACB Library: `https://github.com/atesgoral/acb`

---

## 🛠️ Quick Reference: Working with This Project

### For Complex Tasks
```bash
# Always use swarm-orchestrator for multi-step work
@agent-swarm-orchestrator [your task description]

# Swarm automatically:
# - Queries Cognee knowledge graph for context (if enabled)
# - Plans with full project history awareness
# - Updates knowledge graph during execution
# - Persists learnings for future sessions
```

### For Quick Queries
```bash
# Simple questions can be asked directly
# Claude will respond immediately without orchestration

# But for anything involving:
# - Multiple files
# - Debugging
# - Implementation
# - Refactoring
# Use @agent-swarm-orchestrator for best results
```

### Session Management
```bash
# At end of major work session
@agent-swarm-orchestrator Create session documentation file

# Swarm will:
# - Create numbered .md file in docs
# - Document all changes and decisions
# - Add session to knowledge graph (if Cognee enabled)
# - Link related sessions
```

---

## 📖 Known Issues & Workarounds

*Document any known issues here as they're discovered. Use this format:*

**Issue: [Brief Description]**
- **Symptom**: [What happens]
- **Cause**: [Root cause if known]
- **Workaround**: [Temporary fix]
- **Permanent Fix**: [Planned solution]
- **Related Sessions**: docs/XXX.md

---

## 🎓 Best Practices for This Project

### Do's
- ✅ Always check recent session files before starting new work
- ✅ Document all architectural decisions in session files
- ✅ Use Cognee queries to find similar past implementations (if enabled)
- ✅ Update INDEX.md when completing major features
- ✅ Link related sessions for complex features
- ✅ Preserve debug history (what didn't work and why)
- ✅ Test ACB file generation in Adobe tools after changes
- ✅ Verify color accuracy in LAB color space conversions

### Don'ts
- ❌ Don't skip session documentation for "small" changes
- ❌ Don't duplicate code without checking knowledge graph first
- ❌ Don't resolve issues without documenting the solution
- ❌ Don't merge PRs without updating relevant session files
- ❌ Don't delete session files (archive if needed)
- ❌ Don't modify color conversion logic without testing roundtrip accuracy
- ❌ Don't change ACB file format without validating against Adobe specs

---

## 📝 Maintenance Schedule

### Weekly
- [ ] Review active blockers in INDEX.md
- [ ] Update session files with progress
- [ ] Test ACB file generation with latest changes

### Monthly
- [ ] Re-run Cognee cognify (if using Cognee) after major changes
- [ ] Clean up outdated knowledge graph entries (if using Cognee)
- [ ] Archive completed session files older than 6 months (optional)
- [ ] Update INDEX.md with project milestones
- [ ] Review and update color conversion accuracy

### Quarterly
- [ ] Review and update this CLAUDE.md file
- [ ] Audit session documentation for gaps
- [ ] Update architecture highlights section
- [ ] Refresh useful links section
- [ ] Validate ACB files against latest Adobe Color specifications

---

**Remember**: The more you use this project with consistent session documentation, the smarter Claude becomes about your codebase!

---

## 🚀 Getting Started Guide

### For Users (Deploying to a New Codebase)

**When adding this CLAUDE.md template to a new project:**

1. **Copy Template**
   ```bash
   # Copy CLAUDE.template.md to your project root
   cp CLAUDE.template.md /path/to/your-project/CLAUDE.md
   ```

2. **Let Claude Check Project Status**
   - Open Claude Code in your project directory
   - Claude will automatically read CLAUDE.md
   - Claude will run the "🔍 Project Status Check" and determine:
     - Is this a NEW PROJECT? → Follow "IF: NEW PROJECT" workflow
     - Is this EXISTING? → Follow "IF: EXISTING PROJECT" workflow
     - Is this INITIALIZED BUT NO SESSIONS? → Follow that workflow

3. **Claude Will Guide You**
   - Claude will tell you which workflow applies
   - Claude will walk you through the appropriate setup steps
   - For NEW PROJECTS: Claude will help customize placeholders and initialize the system
   - For EXISTING PROJECTS: Claude will load session history and continue where you left off

### For Claude (When You Encounter This File)

**⚠️ IMPORTANT: When you first read this CLAUDE.md file, IMMEDIATELY:**

1. **Run Project Status Check** (§ Project Status Check)
   - Check if `docs` exists (look for `docs/`, `Docs/`, `.sessions/`)
   - Check if session files exist (001.md, 002.md, etc.)
   - Check if CLAUDE.md still has `[PLACEHOLDER]` values
   - Check if Cognee is initialized (if MCP available)

2. **Inform User of Project Status**
   ```
   Example response:
   "I've analyzed this project and determined it's a [NEW/EXISTING/INITIALIZED] project.

   Here's what I found:
   - Docs folder: [EXISTS/DOES NOT EXIST]
   - Session files: [FOUND X FILES / NONE FOUND]
   - CLAUDE.md customization: [CUSTOMIZED / NEEDS CUSTOMIZATION]
   - Cognee status: [INITIALIZED / NOT INITIALIZED / NOT AVAILABLE]

   I recommend following the '[IF: X PROJECT]' workflow. Shall I proceed?"
   ```

3. **Follow Appropriate Workflow**
   - **IF NEW PROJECT**: Guide user through customization and initialization
   - **IF EXISTING PROJECT**: Load session context and continue work
   - **IF INITIALIZED BUT NO SESSIONS**: Create first session file and begin

### Quick Reference Checklist

**For New Projects (Manual Setup):**
- [ ] Copy CLAUDE.template.md to project root as CLAUDE.md
- [ ] Let Claude run project status check
- [ ] Follow Claude's recommended workflow (IF: NEW PROJECT)
- [ ] Claude will help customize all `[PLACEHOLDER]` values
- [ ] Claude will create docs folder and initial session files
- [ ] Claude will initialize Cognee (if desired)
- [ ] Commit to git when complete

**For Existing Projects (Returning):**
- [ ] Claude runs project status check
- [ ] Claude follows "IF: EXISTING PROJECT" workflow
- [ ] Claude reads most recent session file
- [ ] Claude loads knowledge graph context (if Cognee enabled)
- [ ] Work continues from "Next Session Focus" priorities

---

*Template Version: 2.1.0*
*Last Updated: 2025-11-06*
*License: MIT (Free to use and modify)*
*Changelog: v2.1.0 - Customized for ok2pan Pantone color management project*
