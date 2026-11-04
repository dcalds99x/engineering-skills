# Engineering Skills

A version-controlled collection of practical engineering skills for product development. Each skill lives in its own directory and is documented in a `SKILL.md` file.

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
