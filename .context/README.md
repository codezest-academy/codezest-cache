# .context - Documentation & Context Files

This folder contains all planning, design, and progress tracking documents for the `@codezest-academy/codezest-cache` package and related CodeZest project documentation.

---

## 📁 Folder Structure

```
.context/
├── this-repo/           # Cache package specific documentation
├── project-wide/        # CodeZest overall architecture & planning
├── guides/              # General development guides
└── README.md            # This file
```

---

## 📂 this-repo/ - Cache Package Documentation

Cache-specific documentation in chronological/logical order:

| File                                                             | Purpose                                | Size  |
| ---------------------------------------------------------------- | -------------------------------------- | ----- |
| [01_SETUP.md](this-repo/01_SETUP.md)                             | Initial setup instructions             | 7.7KB |
| [02_CACHE_DETAILS.md](this-repo/02_CACHE_DETAILS.md)             | Implementation details                 | 4.1KB |
| [03_CACHE_CONSUMING.md](this-repo/03_CACHE_CONSUMING.md)         | How to consume this package            | 2.5KB |
| [04_IMPLEMENTATION_PLAN.md](this-repo/04_IMPLEMENTATION_PLAN.md) | Original implementation plan           | 3KB   |
| [05_DELPATTERN_BUG.md](this-repo/05_DELPATTERN_BUG.md)           | Complete delPattern bug analysis & fix | 13KB  |
| [06_MIGRATION_v1.0.2.md](this-repo/06_MIGRATION_v1.0.2.md)       | Migration guide for v1.0.2             | 8.5KB |
| [07_PUBLISHING_STATUS.md](this-repo/07_PUBLISHING_STATUS.md)     | Publishing status & workflow           | 3.2KB |
| [08_PROGRESS.md](this-repo/08_PROGRESS.md)                       | Progress tracking                      | 2.2KB |

### Quick Start

```bash
# For new developers
cat .context/this-repo/01_SETUP.md
cat .context/this-repo/02_CACHE_DETAILS.md

# For consuming this package
cat .context/this-repo/03_CACHE_CONSUMING.md

# For understanding the delPattern bug fix
cat .context/this-repo/05_DELPATTERN_BUG.md
```

---

## 🌐 project-wide/ - CodeZest Overall Documentation

Project-wide architecture and planning documents:

| File                                                                | Purpose                             | Size  |
| ------------------------------------------------------------------- | ----------------------------------- | ----- |
| [01_PLAN_OVERVIEW.md](project-wide/01_PLAN_OVERVIEW.md)             | Complete CodeZest platform plan     | 26KB  |
| [02_ARCHITECTURE_DESIGN.md](project-wide/02_ARCHITECTURE_DESIGN.md) | Overall architecture design         | 16KB  |
| [03_DB_CONSUMING.md](project-wide/03_DB_CONSUMING.md)               | How to consume @codezest-academy/db | 2.5KB |

### Quick Start

```bash
# Understand overall CodeZest architecture
cat .context/project-wide/01_PLAN_OVERVIEW.md
cat .context/project-wide/02_ARCHITECTURE_DESIGN.md

# Learn about shared database package
cat .context/project-wide/03_DB_CONSUMING.md
```

---

## 📚 guides/ - General Development Guides

Reusable guides for development tools and workflows:

| File                                                                        | Purpose                        | Size  |
| --------------------------------------------------------------------------- | ------------------------------ | ----- |
| [01_REDIS_GUIDE.md](guides/01_REDIS_GUIDE.md)                               | Redis setup (dev & production) | 5KB   |
| [02_DOCKER_COMPOSE_LOCAL_SETUP.md](guides/02_DOCKER_COMPOSE_LOCAL_SETUP.md) | Local Docker setup             | 3KB   |
| [03_GITHUB_ACTIONS_GUIDE.md](guides/03_GITHUB_ACTIONS_GUIDE.md)             | CI/CD with GitHub Actions      | 3.9KB |

### Quick Start

```bash
# Setup Redis locally
cat .context/guides/01_REDIS_GUIDE.md

# Setup Docker Compose
cat .context/guides/02_DOCKER_COMPOSE_LOCAL_SETUP.md

# Understand CI/CD pipeline
cat .context/guides/03_GITHUB_ACTIONS_GUIDE.md
```

---

## 🎯 Usage Scenarios

### For New Developers

1. **Start with this-repo/**

   ```bash
   cat .context/this-repo/01_SETUP.md
   cat .context/this-repo/02_CACHE_DETAILS.md
   ```

2. **Understand the project context**

   ```bash
   cat .context/project-wide/01_PLAN_OVERVIEW.md
   cat .context/project-wide/02_ARCHITECTURE_DESIGN.md
   ```

3. **Setup your environment**
   ```bash
   cat .context/guides/01_REDIS_GUIDE.md
   cat .context/guides/02_DOCKER_COMPOSE_LOCAL_SETUP.md
   ```

### For Consuming This Package

```bash
cat .context/this-repo/03_CACHE_CONSUMING.md
```

### For Understanding the delPattern Bug

```bash
cat .context/this-repo/05_DELPATTERN_BUG.md
```

### For AI Agents (Context Retrieval)

Files are numbered chronologically for easy sequential reading:

```bash
# Cache-specific context
ls -1 .context/this-repo/

# Project-wide context
ls -1 .context/project-wide/

# General guides
ls -1 .context/guides/
```

---

## 📝 File Naming Convention

All files follow a chronological/logical naming pattern:

```
<number>_<DESCRIPTIVE_NAME>.md
```

- **Number**: Indicates reading order (01, 02, 03, etc.)
- **Descriptive Name**: Clear, uppercase with underscores
- **Extension**: Always `.md` (Markdown)

**Examples**:

- `01_SETUP.md` - Read first
- `02_CACHE_DETAILS.md` - Read second
- `05_DELPATTERN_BUG.md` - Read fifth

---

## 🔄 When to Update

### this-repo/

- **01_SETUP.md**: When setup process changes
- **02_CACHE_DETAILS.md**: When implementation details change
- **03_CACHE_CONSUMING.md**: When usage API changes
- **08_PROGRESS.md**: After each work session

### project-wide/

- **01_PLAN_OVERVIEW.md**: When overall plan changes
- **02_ARCHITECTURE_DESIGN.md**: When architecture evolves
- **03_DB_CONSUMING.md**: When DB package API changes

### guides/

- **01_REDIS_GUIDE.md**: When Redis setup changes
- **02_DOCKER_COMPOSE_LOCAL_SETUP.md**: When Docker config changes
- **03_GITHUB_ACTIONS_GUIDE.md**: When CI/CD workflow changes

---

## 🗑️ Deprecated Files

The following files have been consolidated or moved:

- ~~`CACHE_DELPATTERN_BUG_ANALYSIS.md`~~ → Consolidated into `this-repo/05_DELPATTERN_BUG.md`
- ~~`DELPATTERN_FIX_GUIDE.md`~~ → Consolidated into `this-repo/05_DELPATTERN_BUG.md`
- ~~`DELPATTERN_FIX_SUMMARY.md`~~ → Consolidated into `this-repo/05_DELPATTERN_BUG.md`

---

## 📊 Statistics

- **Total Files**: 14 (8 this-repo + 3 project-wide + 3 guides)
- **Total Size**: ~80KB
- **Folders**: 3 (this-repo, project-wide, guides)
- **Consolidated**: 3 delPattern files → 1 comprehensive doc

---

## 📖 Notes

- These files are **not published** to npm (excluded in `.npmignore`)
- These files **are committed** to git (for team context)
- Keep these files **up to date** for seamless collaboration
- Use these files for **onboarding** new team members
- Files are numbered for **easy context retrieval** by AI agents

---

**Last Updated**: 2025-11-24  
**Reorganized**: 2025-11-24  
**Structure Version**: 2.0
