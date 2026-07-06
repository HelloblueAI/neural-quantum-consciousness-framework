# Security Policy

## Supported versions

Security fixes are applied to the **default branch** (`main`) and deployed to
production at [agi.bleujs.org](https://agi.bleujs.org). Older tags and archived
code under `src/archive/` are not actively supported.

| Version | Supported |
| ------- | --------- |
| `main` (latest) | Yes |
| Older releases | Best effort |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report security issues through one of these channels:

1. **GitHub Security Advisories (preferred):**
   [Create a private advisory](https://github.com/HelloblueAI/bleujs-reasoning-lab/security/advisories/new)

2. **Email:** info@helloblue.ai with subject `BleuJS Reasoning Lab security`

Include:

- Description of the issue and potential impact
- Steps to reproduce (proof of concept if available)
- Affected endpoints, files, or deployment configuration

We aim to acknowledge reports within **72 hours** and will coordinate disclosure
with you before any public fix.

## Secrets and API keys

- Never commit `.dev.vars`, API keys, or Cloudflare tokens.
- Production secrets are set via `wrangler secret put` (see
  [README.md](README.md) and [.dev.vars.example](.dev.vars.example)).
- If you accidentally commit a secret, rotate it immediately and notify maintainers.

## Scope

In scope:

- The production worker (`src/primary-agi-worker.ts`) and its public API
- Authentication, authorization, and secret handling in the lab stack
- Dependency vulnerabilities affecting production deploys

Out of scope:

- Social engineering against maintainers
- Denial-of-service against third-party services (e.g. BleuJS API, Cloudflare)
- Issues in archived code under `src/archive/` unless they affect production

Thank you for helping keep BleuJS Reasoning Lab safe for everyone.
