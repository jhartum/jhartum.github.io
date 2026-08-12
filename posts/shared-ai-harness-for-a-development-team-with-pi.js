window.BLOG_POSTS = [
  {
    "date": "2026-08-12",
    "slug": "shared-ai-harness-for-a-development-team-with-pi.md",
    "read": {
      "ru": "4 мин",
      "en": "4 min"
    },
    "tags": [
      "pi",
      "ai-harness",
      "skills",
      "workflow"
    ],
    "title": {
      "ru": "Как я настроил общий AI-harness для команды разработки на Pi",
      "en": "How I set up a shared AI harness for a development team with Pi"
    },
    "blocks": [
      {
        "type": "lead",
        "text": {
          "ru": "Один Git-репозиторий с контекстом всей экосистемы, skills для рабочих инструментов и два интерфейса: терминал и Telegram.",
          "en": "One Git repository with context for the entire ecosystem, skills for day-to-day tools, and two interfaces: terminal and Telegram."
        }
      },
      {
        "type": "heading",
        "text": {
          "ru": "Инженерная задача начинается со сбора контекста",
          "en": "An engineering task starts with gathering context"
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Требования находятся в таск-трекере, код — в нескольких репозиториях, история изменений и pipelines — в GitLab, ошибки — в логах и мониторинге, данные — в PostgreSQL. Обычно разработчик знает, в какой системе искать нужную информацию и как связаны проекты и сервисы.",
          "en": "Requirements live in an issue tracker, code spans several repositories, change history and pipelines live in GitLab, errors live in logs and monitoring, and data lives in PostgreSQL. Developers usually know which system contains the relevant information and how projects and services fit together."
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Чтобы агент мог делать то же самое, я создал отдельный репозиторий `agent`. В нём хранятся описания проектов, документация, настройки Pi и skills для внутренних CLI-интеграций.",
          "en": "To give an agent the same ability, I created a separate `agent` repository. It contains project descriptions, documentation, Pi settings, and skills for internal CLI integrations."
        }
      },
      {
        "type": "heading",
        "text": {
          "ru": "Отдельный репозиторий `agent`",
          "en": "A dedicated `agent` repository"
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Рабочий каталог устроен так:",
          "en": "The workspace looks like this:"
        }
      },
      {
        "type": "code",
        "language": "text",
        "text": "~/code/company/\n├── agent/\n│   ├── AGENTS.md\n│   ├── README.md\n│   ├── docs/\n│   │   └── ecosystem/\n│   └── .pi/\n│       ├── settings.json\n│       └── skills/\n├── main-application/\n├── infrastructure/\n├── terraform/\n├── telegram-bot/\n├── analytics/\n└── qa/"
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Pi запускается из `agent/`, а файловые и shell-инструменты обращаются к sibling repositories через `../`.",
          "en": "Pi runs from `agent/`, while filesystem and shell tools access sibling repositories through `../`."
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "В `AGENTS.md` находится карта проектов и общие правила:",
          "en": "`AGENTS.md` contains the project index and shared rules:"
        }
      },
      {
        "type": "code",
        "language": "markdown",
        "text": "Workspace for agents operating across the company ecosystem.\n\nWhen a task relates to an ecosystem project:\n\n1. Find the matching sibling repository.\n2. Read its README and project documentation.\n3. Check the ecosystem documentation when infrastructure is relevant.\n4. Do not mutate repositories or infrastructure without explicit approval.\n\n## Projects\n\n- `../main-application` — main CRM and web application.\n- `../infrastructure` — deployment configuration.\n- `../terraform` — cloud infrastructure.\n- `../telegram-bot` — notification service.\n- `../analytics` — analytics and data pipelines.\n- `../qa` — automated tests."
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "`AGENTS.md` задаёт роли проектов и общие правила. По задаче агент выбирает нужные sibling repositories и читает их документацию и код — cross-repo контекст без monorepo.",
          "en": "`AGENTS.md` defines each project's responsibility and the shared rules. Based on the task, the agent selects the relevant sibling repositories and reads their documentation and code. This provides cross-repository context without turning the ecosystem into a monorepo."
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "`.pi/settings.json` хранит общие настройки Pi и project extensions, которые команда получает вместе с репозиторием.",
          "en": "The `.pi/settings.json` file stores shared Pi settings and project extensions, versioned with the repository for the whole team."
        }
      },
      {
        "type": "heading",
        "text": {
          "ru": "Контекст загружается по задаче",
          "en": "Context is loaded on demand"
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Постоянно передавать модели всю внутреннюю документацию нет необходимости. В стартовом контексте достаточно правил и карты возможностей.",
          "en": "There is no need to send every internal document to the model on every request. Initial context only needs the rules and a list of available capabilities."
        }
      },
      {
        "type": "code",
        "language": "text",
        "text": {
          "ru": "При запуске:\n  AGENTS.md\n  имена и описания skills\n\nПри выборе skill:\n  SKILL.md\n\nПри выполнении конкретной операции:\n  нужный файл из references/\n\nВо время работы:\n  документация проекта\n  код\n  результаты CLI",
          "en": "At startup:\n  AGENTS.md\n  skill names and descriptions\n\nWhen a skill is selected:\n  SKILL.md\n\nFor a specific operation:\n  the relevant file from references/\n\nDuring task execution:\n  project documentation\n  code\n  CLI output"
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Интеграции:",
          "en": "Integrations:"
        }
      },
      {
        "type": "table",
        "headers": [
          {
            "ru": "Для чего используется",
            "en": "Used for"
          },
          "CLI"
        ],
        "rows": [
          [
            {
              "ru": "GitLab: repositories, MR и pipelines",
              "en": "GitLab: repositories, merge requests, and pipelines"
            },
            "`glab`"
          ],
          [
            {
              "ru": "YouTrack: задачи и база знаний",
              "en": "YouTrack: issues and knowledge base"
            },
            "`yt`"
          ],
          [
            {
              "ru": "Grafana: логи, метрики и alerts",
              "en": "Grafana: logs, metrics, and alerts"
            },
            "`gcx`"
          ],
          [
            {
              "ru": "PostgreSQL: отчёты и исследование данных",
              "en": "PostgreSQL: reports and data exploration"
            },
            "`psql`"
          ],
          [
            {
              "ru": "Portainer: текущее состояние containers и services",
              "en": "Portainer: current container and service state"
            },
            "`portainerctl`"
          ],
          [
            {
              "ru": "GlitchTip: ошибки приложений и stack traces",
              "en": "GlitchTip: application errors and stack traces"
            },
            "`glitchtip-cli`"
          ],
          [
            {
              "ru": "Phoenix: анализ LLM/STT traces",
              "en": "Phoenix: LLM/STT trace analysis"
            },
            "`phoenix-cli`"
          ],
          [
            {
              "ru": "S3: записи и транскрипты рабочих созвонов",
              "en": "S3: recordings and transcripts of team calls"
            },
            "`aws`"
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Упрощённый пример:",
          "en": "A simplified skill:"
        }
      },
      {
        "type": "code",
        "language": "markdown",
        "text": "---\nname: youtrack\ndescription: Use for issue IDs, issue search, task creation and comments.\n---\n\nUse `yt`.\n\nPass credentials through environment variables:\n\n    YOUTRACK_BASE_URL=\"$TEAM_YOUTRACK_URL\" \\\n    YOUTRACK_TOKEN=\"$TEAM_YOUTRACK_TOKEN\" \\\n    yt ...\n\nFor task creation, read `references/creating-task.md`."
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "`SKILL.md` содержит условия вызова, CLI и ограничения. Операционные инструкции находятся в `references/`:",
          "en": "`SKILL.md` defines when to invoke the integration, which CLI to run, and which constraints apply. Operation-specific instructions live under `references/`:"
        }
      },
      {
        "type": "code",
        "language": "text",
        "text": "youtrack/\n├── SKILL.md\n└── references/\n    ├── reading-task.md\n    └── creating-task.md"
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Так чтение задачи не загружает инструкцию по её созданию. Credentials остаются вне Git: skill называет environment variables, а runtime передаёт значения.",
          "en": "This way, reading an issue does not load the instructions for creating one. Credentials stay out of Git: the skill names the environment variables, and the runtime injects their values."
        }
      },
      {
        "type": "heading",
        "text": {
          "ru": "Какие сценарии получились",
          "en": "What this enables"
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Ценность harness проявляется в задачах, где нужно связать несколько источников контекста.",
          "en": "The harness is most useful for tasks that need context from several systems."
        }
      },
      {
        "type": "table",
        "headers": [
          {
            "ru": "Запрос",
            "en": "Request"
          },
          {
            "ru": "Откуда агент собирает контекст",
            "en": "Context the agent uses"
          },
          {
            "ru": "Результат",
            "en": "Result"
          }
        ],
        "rows": [
          [
            {
              "ru": "Подготовить задачу к разработке",
              "en": "Prepare an issue for implementation"
            },
            {
              "ru": "YouTrack, карта проектов, документация и код",
              "en": "YouTrack, project index, documentation, and code"
            },
            {
              "ru": "Затронутые repositories и план изменений",
              "en": "Affected repositories and an implementation plan"
            }
          ],
          [
            {
              "ru": "Исследовать проблему",
              "en": "Investigate a problem"
            },
            {
              "ru": "Ошибки, логи, код, данные и runtime state",
              "en": "Errors, logs, code, data, and runtime state"
            },
            {
              "ru": "Причина или проверяемые гипотезы",
              "en": "Root cause or testable hypotheses"
            }
          ],
          [
            {
              "ru": "Внести изменение",
              "en": "Implement a change"
            },
            {
              "ru": "Задача, связанные repositories и тесты",
              "en": "Issue, related repositories, and tests"
            },
            {
              "ru": "Изменения, commit и MR после подтверждения",
              "en": "Changes, commit, and merge request after confirmation"
            }
          ],
          [
            {
              "ru": "Ответить на вопрос по данным или системе",
              "en": "Answer a data or system question"
            },
            {
              "ru": "Документация и read-only PostgreSQL",
              "en": "Documentation and read-only PostgreSQL"
            },
            {
              "ru": "Ответ или короткий отчёт",
              "en": "Answer or short report"
            }
          ],
          [
            {
              "ru": "Проверить production",
              "en": "Verify production"
            },
            {
              "ru": "Pipeline, deploy, ошибки, логи и состояние сервисов",
              "en": "Pipeline, deployment, errors, logs, and service state"
            },
            {
              "ru": "Запущенная версия и найденные отклонения",
              "en": "Running version and detected discrepancies"
            }
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "При cross-repo работе агент перечисляет затронутые repositories, связи между MR и порядок merge.",
          "en": "For cross-repository work, the agent lists affected repositories, dependencies between merge requests, and merge order."
        }
      },
      {
        "type": "heading",
        "text": {
          "ru": "Общий AI-ассистент команды в Telegram",
          "en": "A shared AI assistant for the team in Telegram"
        }
      },
      {
        "type": "paragraph",
        "text": {
          "ru": "Он использует те же инструменты и знания о проектах, что и локальный harness: тот же репозиторий `agent`, skills, проектную документацию и CLI-интеграции. Telegram — ещё один интерфейс к harness, а не отдельная конфигурация агента. Секреты для интеграций разделены: локальный Pi использует учётные данные разработчика, а Telegram-версия `pi-chat` — отдельные учётные данные с ограниченным read-only доступом.",
          "en": "It uses the same tools and project knowledge as the local harness: the same `agent` repository, skills, project documentation, and CLI integrations. Telegram is another interface to the harness, not a separate agent configuration. Integration credentials are separate: local Pi uses each developer's credentials, while the Telegram `pi-chat` runtime has its own scoped, read-only credentials."
        }
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
        "label": {
          "ru": "Общий AI-ассистент команды в Telegram",
          "en": "A shared AI assistant for the team in Telegram"
        },
        "url": "Blog.dc.html?post=shared-ai-assistant-for-the-team-in-telegram.md"
      }
    ],
    "links": []
  }
];
