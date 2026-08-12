window.BLOG_POSTS = [
  {
    "date": "2026-08-12",
    "slug": "shared-ai-harness-for-a-development-team-with-pi.md",
    "read": "4 min",
    "tags": [
      "pi",
      "ai-harness",
      "skills",
      "workflow"
    ],
    "title": "How I set up a shared AI harness for a development team with Pi",
    "blocks": [
      {
        "type": "lead",
        "text": "One Git repository with context for the entire ecosystem, skills for day-to-day tools, and two interfaces: terminal and Telegram."
      },
      {
        "type": "heading",
        "text": "An engineering task starts with gathering context"
      },
      {
        "type": "paragraph",
        "text": "Requirements live in an issue tracker, code spans several repositories, change history and pipelines live in GitLab, errors live in logs and monitoring, and data lives in PostgreSQL. Developers usually know which system contains the relevant information and how projects and services fit together."
      },
      {
        "type": "paragraph",
        "text": "To give an agent the same ability, I created a separate `agent` repository. It contains project descriptions, documentation, Pi settings, and skills for internal CLI integrations."
      },
      {
        "type": "heading",
        "text": "A dedicated `agent` repository"
      },
      {
        "type": "paragraph",
        "text": "The workspace looks like this:"
      },
      {
        "type": "code",
        "language": "text",
        "text": "~/code/company/\n├── agent/\n│   ├── AGENTS.md\n│   ├── README.md\n│   ├── docs/\n│   │   └── ecosystem/\n│   └── .pi/\n│       ├── settings.json\n│       └── skills/\n├── main-application/\n├── infrastructure/\n├── terraform/\n├── telegram-bot/\n├── analytics/\n└── qa/"
      },
      {
        "type": "paragraph",
        "text": "Pi runs from `agent/`, while filesystem and shell tools access sibling repositories through `../`."
      },
      {
        "type": "paragraph",
        "text": "`AGENTS.md` contains the project index and shared rules:"
      },
      {
        "type": "code",
        "language": "markdown",
        "text": "Workspace for agents operating across the company ecosystem.\n\nWhen a task relates to an ecosystem project:\n\n1. Find the matching sibling repository.\n2. Read its README and project documentation.\n3. Check the ecosystem documentation when infrastructure is relevant.\n4. Do not mutate repositories or infrastructure without explicit approval.\n\n## Projects\n\n- `../main-application` — main CRM and web application.\n- `../infrastructure` — deployment configuration.\n- `../terraform` — cloud infrastructure.\n- `../telegram-bot` — notification service.\n- `../analytics` — analytics and data pipelines.\n- `../qa` — automated tests."
      },
      {
        "type": "paragraph",
        "text": "`AGENTS.md` defines each project's responsibility and the shared rules. Based on the task, the agent selects the relevant sibling repositories and reads their documentation and code. This provides cross-repository context without turning the ecosystem into a monorepo."
      },
      {
        "type": "paragraph",
        "text": "The `.pi/settings.json` file stores shared Pi settings and project extensions, versioned with the repository for the whole team."
      },
      {
        "type": "heading",
        "text": "Context is loaded on demand"
      },
      {
        "type": "paragraph",
        "text": "There is no need to send every internal document to the model on every request. Initial context only needs the rules and a list of available capabilities."
      },
      {
        "type": "code",
        "language": "text",
        "text": "At startup:\n  AGENTS.md\n  skill names and descriptions\n\nWhen a skill is selected:\n  SKILL.md\n\nFor a specific operation:\n  the relevant file from references/\n\nDuring task execution:\n  project documentation\n  code\n  CLI output"
      },
      {
        "type": "paragraph",
        "text": "Integrations:"
      },
      {
        "type": "table",
        "headers": [
          "Used for",
          "CLI"
        ],
        "rows": [
          [
            "GitLab: repositories, merge requests, and pipelines",
            "`glab`"
          ],
          [
            "YouTrack: issues and knowledge base",
            "`yt`"
          ],
          [
            "Grafana: logs, metrics, and alerts",
            "`gcx`"
          ],
          [
            "PostgreSQL: reports and data exploration",
            "`psql`"
          ],
          [
            "Portainer: current container and service state",
            "`portainerctl`"
          ],
          [
            "GlitchTip: application errors and stack traces",
            "`glitchtip-cli`"
          ],
          [
            "Phoenix: LLM/STT trace analysis",
            "`phoenix-cli`"
          ],
          [
            "S3: recordings and transcripts of team calls",
            "`aws`"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "A simplified skill:"
      },
      {
        "type": "code",
        "language": "markdown",
        "text": "---\nname: youtrack\ndescription: Use for issue IDs, issue search, task creation and comments.\n---\n\nUse `yt`.\n\nPass credentials through environment variables:\n\n    YOUTRACK_BASE_URL=\"$TEAM_YOUTRACK_URL\" \\\n    YOUTRACK_TOKEN=\"$TEAM_YOUTRACK_TOKEN\" \\\n    yt ...\n\nFor task creation, read `references/creating-task.md`."
      },
      {
        "type": "paragraph",
        "text": "`SKILL.md` defines when to invoke the integration, which CLI to run, and which constraints apply. Operation-specific instructions live under `references/`:"
      },
      {
        "type": "code",
        "language": "text",
        "text": "youtrack/\n├── SKILL.md\n└── references/\n    ├── reading-task.md\n    └── creating-task.md"
      },
      {
        "type": "paragraph",
        "text": "This way, reading an issue does not load the instructions for creating one. Credentials stay out of Git: the skill names the environment variables, and the runtime injects their values."
      },
      {
        "type": "heading",
        "text": "What this enables"
      },
      {
        "type": "paragraph",
        "text": "The harness is most useful for tasks that need context from several systems."
      },
      {
        "type": "table",
        "headers": [
          "Request",
          "Context the agent uses",
          "Result"
        ],
        "rows": [
          [
            "Prepare an issue for implementation",
            "YouTrack, project index, documentation, and code",
            "Affected repositories and an implementation plan"
          ],
          [
            "Investigate a problem",
            "Errors, logs, code, data, and runtime state",
            "Root cause or testable hypotheses"
          ],
          [
            "Implement a change",
            "Issue, related repositories, and tests",
            "Changes, commit, and merge request after confirmation"
          ],
          [
            "Answer a data or system question",
            "Documentation and read-only PostgreSQL",
            "Answer or short report"
          ],
          [
            "Verify production",
            "Pipeline, deployment, errors, logs, and service state",
            "Running version and detected discrepancies"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "For cross-repository work, the agent lists affected repositories, dependencies between merge requests, and merge order."
      },
      {
        "type": "heading",
        "text": "A shared AI assistant for the team in Telegram"
      },
      {
        "type": "paragraph",
        "text": "It uses the same tools and project knowledge as the local harness: the same `agent` repository, skills, project documentation, and CLI integrations. Telegram is another interface to the harness, not a separate agent configuration."
      }
    ],
    "refs": [
      {
        "label": "Pi",
        "url": "https://pi.dev"
      },
      {
        "label": "GitLab",
        "url": "https://gitlab.com"
      },
      {
        "label": "YouTrack",
        "url": "https://www.jetbrains.com/youtrack/"
      },
      {
        "label": "Grafana",
        "url": "https://grafana.com"
      },
      {
        "label": "PostgreSQL",
        "url": "https://www.postgresql.org/"
      },
      {
        "label": "Portainer",
        "url": "https://www.portainer.io/"
      },
      {
        "label": "GlitchTip",
        "url": "https://glitchtip.com/"
      },
      {
        "label": "Phoenix",
        "url": "https://phoenix.arize.com/"
      },
      {
        "label": "A shared AI assistant for the team in Telegram",
        "url": "Blog.dc.html?post=shared-ai-assistant-for-the-team-in-telegram.md"
      }
    ],
    "links": []
  }
];
