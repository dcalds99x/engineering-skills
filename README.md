# Engineering Skills

A version-controlled collection of practical engineering skills for product development. Each skill lives in its own directory and is documented in a `SKILL.md` file.

## Install

Install the collection globally for Codex with [the Skills CLI](https://github.com/vercel-labs/skills):

```powershell
npx skills add dcalds99x/engineering-skills --global --agent codex --skill '*'
```

This requires Node.js 22.20 or later. To install just one skill, replace `'*'` with its name, such as `commit-changes`.

## Update

Update all globally installed skills, or select one by name:

```powershell
npx skills update --global
npx skills update commit-changes --global
```

List installed skills with `npx skills list --global`. The CLI installs skills for the selected agent; use `--agent` to target another supported agent.

## Skills

| Skill | Purpose |
| --- | --- |
| [commit-changes](skills/commit-changes/SKILL.md) | Organize existing repository changes into reviewable local Git commits. |
| [vdd-visual-direction-decision](skills/vdd-visual-direction-decision/SKILL.md) | Diagnose UI and UX, present visual directions, and gate implementation on explicit approval. |

## Language

All skills in this repository are maintained in English. Contributions should preserve the behavior and safeguards of each skill when improving its wording.

## Structure

```text
skills/
  <skill-name>/
    SKILL.md
```

## Adding a skill

Create `skills/<skill-name>/SKILL.md` with YAML frontmatter containing a `name` and a concise `description`, followed by the skill's instructions in Markdown. Add the new skill to the table above.

Run `node scripts/validate-skills.mjs` before opening a pull request. GitHub Actions runs the same check on pushes and pull requests to `main`.
