@AGENTS.md

# Grove — Contexto Completo para Modelos

## O que é o Grove

App web anti-procrastinação baseado em ciência. Timer Pomodoro + gamificação (árvores, XP, ranking) + regulação emocional. Feito para pessoas com procrastinação crônica, TDAH, ansiedade de desempenho.

**Stack:** Next.js 16 + React 19 + Tailwind v4 (mas UI é majoritariamente inline styles)
**Idioma:** Português Brasileiro
**Repo:** `Elicarlos/focus-front` (GitHub) + `Elicarlos/focus-back` (FastAPI)
**Deploy:** Coolify (localhost)

---

## Base Científica (NotebookLM)

O app foi construído com base em pesquisa científica real:

### Causa raiz da procrastinação
- **Não é preguiça** — é problema de regulação emocional
- Conflito no cérebro: sistema límbico (busca alívio imediato) vs córtex pré-frontal (planejamento)
- Amígdala dispara alarme quando tarefa gera desconforto (tédio, medo, ansiedade)
- Conexão amígdala-córtex é mais fraca em procrastinadores
- Baixa disponibilidade de dopamina diminui motivação

### O que o app faz (e por que)

| Feature | Base científica | Implementada? |
|---------|-----------------|:---:|
| **Pomodoro 25/5** | Blocos curtos neutralizam ansiedade, impedem fadiga mental | ✅ |
| **Check-in emocional** | Reconhecer emoção antes de agir quebra o ciclo de evitação | ✅ |
| **Micro-passo** | Ativação comportamental: começar pequeno quebra inércia | ✅ |
| **Início rápido 5min** | Regra dos 5 minutos (TCC): compromisso mínimo reduz medo | ✅ |
| **Gamificação (XP, árvores)** | Dopamina imediata para o sistema límbico | ✅ |
| **Ranking global** | Motivação social + competição saudável | ✅ |
| **Streak** | Consistência > intensidade (hábito sustentado) | ✅ |
| **Árvore que cresce** | Progresso visual tangível (inspiração Forest) | ✅ |
| Breakdown de tarefas | Dividir em microtarefas reduz sobrecarga cognitiva | ❌ |
| Bloqueio de distrações | Controle de estímulo durante foco | ❌ |
| Prós/Contras de evitar | Técnica DBT de regulação emocional | ❌ |
| Calendário visual | Time blocking para "cegueira temporal" | ❌ |

### O que a pesquisa diz

- **Gamificação** atrai e ativa no curto prazo, mas o que sustenta é motivação intrínseca (valores pessoais)
- **Apps simples** retêm mais que apps complexos — sobrecarga causa paralisia
- **Abandono** acontece quando app é rígido demais ou não lida com falhas
- **Única intervenção mais poderosa**: quebra de tarefas + ativação comportamental + checagem emocional

---

## Arquitetura do Código

### Estrutura
```
src/
├── app/
│   ├── dashboard/page.js    # Tela principal (600+ linhas, client component)
│   ├── ranking/page.js      # Ranking com login obrigatório
│   ├── bosque/page.js       # Bosque (floresta de árvores)
│   ├── layout.js            # Root layout com ThemeWrapper
│   └── globals.css          # Animações CSS
├── components/
│   ├── TimerCircle.js       # Timer com anel SVG + cores dinâmicas
│   ├── MascotTree.js        # Árvore mascote com 6 tipos + partículas
│   ├── TreeTypes.js         # Config das 6 árvores (extensível)
│   ├── Sidebar.js           # Navegação lateral
│   ├── Bosque.js            # Modal do bosque
│   ├── VictoryModal.js      # Tela de vitória pós-sessão
│   ├── Achievements.js      # 12 conquistas
│   ├── ThemeToggle.js       # Seletor de tema
│   ├── ThemeWrapper.js      # Aplica tema ao body
│   └── Modals.js            # Settings, Ranking modal, Check-in
├── contexts/
│   └── ThemeContext.js       # 3 temas: dark, light, midnight
└── docs/
    ├── MONETIZATION.md       # Planos de monetização (gitignored)
    ├── FEATURE_STATUS.md     # Status das features (gitignored)
    └── TEST_PLAN.md          # Testes manuais (gitignored)
```

### Padrões de código
- **Estilos:** Inline JavaScript objects (NÃO Tailwind classes)
- **State:** `useState`/`useEffect` puro — sem Redux/Zustand
- **Temas:** Cada componente chama `useTheme()` individualmente
- **Backend:** `NEXT_PUBLIC_API_URL` (env var) → FastAPI
- **Auth:** Google OAuth JWT → localStorage `pragma_token`
- **Dados offline:** localStorage com prefixo `pragma_`

### localStorage keys
| Key | O que guarda |
|-----|-------------|
| `pragma_token` | JWT do login Google |
| `pragma_nickname` | Apelido do usuário |
| `pragma_streak` | Dias seguidos |
| `pragma_total_sessions` | Total de sessões |
| `pragma_sessions_today` | Sessões de hoje |
| `pragma_sessions_date` | Data das sessões (reset diário) |
| `pragma_bosque` | Array de árvores plantadas |
| `pragma_state_minimal` | Estado offline (task, deadline, XP, tree) |
| `pragma_last_activity` | Último dia de atividade |
| `pragma_theme` | Tema selecionado (dark/light/midnight) |

### Backend (FastAPI)
- URL: `http://a33qw28hn83ky06i7gua435q.187.127.15.180.sslip.io`
- Endpoints: `/auth/google`, `/users/me`, `/users/me/sync`, `/ranking`
- Ranking: top 50 por (level desc, xp desc)
- **Status: BAD GATEWAY** (fora do ar neste momento)

---

## Features Implementadas (90%)

| Feature | Status |
|---------|:------:|
| Timer Pomodoro 25/5 | ✅ |
| Início rápido 5min | ✅ |
| Timer que esquenta | ✅ |
| Anel de progresso SVG | ✅ |
| 6 tipos de árvore | ✅ |
| Bosque (página) | ✅ |
| Ranking (requer login) | ✅ |
| 12 conquistas | ✅ |
| Sons (alarme + tick) | ✅ |
| 3 temas (dark/light/midnight) | ✅ |
| Sync com backend | ⚠️ Backend offline |
| Bloqueio de distrações | ❌ Não implementado |
| Breakdown de tarefas | ❌ Não implementado |

---

## Regras para Modelos

1. **Não usar Tailwind classes** — o projeto usa inline styles
2. **Português BR** em toda UI
3. **Tempa:** Todo componente novo deve chamar `useTheme()` e usar cores do context
4. **Extensível:** Árvores são objetos em `TreeTypes.js` — adicionar uma = adicionar 1 objeto
5. **Offline-first:** Tudo funciona sem backend via localStorage
6. **Simplicidade:** App deve ser simples — sobrecarga causa paralisia (base científica)
7. **Dopamina:** Toda sessão completa deve ter recompensa visual (confetti, XP, árvore)

---

## Monetização

Freemium R$9.90/mês. Doc em `docs/MONETIZATION.md` (gitignored).

---

## Docs vivos

- `docs/FEATURE_STATUS.md` — % de pronto por feature
- `docs/TEST_PLAN.md` — 40+ testes manuais
- `docs/MONETIZATION.md` — Planos de negócio

Ambos gitignored — ficam só local.
