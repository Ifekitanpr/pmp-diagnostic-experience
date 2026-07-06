// ─── 15 RECALL CHECKS — 5 per domain ────────────────────────────────────────
// type: 'recognition' | 'prompted' | 'active'
// For recognition: MCQ with correct index
// For prompted/active: self-assessed after model answer revealed

export const RECALL_CHECKS = [
  // ── PEOPLE (5) ──────────────────────────────────────────────────────────────
  {
    id: 'r1', domain: 'people', type: 'recognition', recallWeight: 0.30,
    question: 'Which model describes the five stages of team development?',
    options: ['RACI Matrix','Tuckman\'s Model','Kotter\'s 8-Step Model','Agile Manifesto'],
    correct: 1,
    modelAnswer: 'Tuckman\'s Model: Forming → Storming → Norming → Performing → Adjourning.',
  },
  {
    id: 'r2', domain: 'people', type: 'prompted', recallWeight: 0.30,
    question: 'Name the FIVE stages of Tuckman\'s team development model in order.',
    prompt: 'Type the five stages separated by commas...',
    modelAnswer: 'Forming, Storming, Norming, Performing, Adjourning',
    keywords: ['forming','storming','norming','performing','adjourning'],
  },
  {
    id: 'r3', domain: 'people', type: 'active', recallWeight: 0.40,
    question: 'Explain what "stakeholder engagement" means and why it matters in project management.',
    prompt: 'Explain in your own words...',
    modelAnswer: 'Stakeholder engagement means proactively identifying all individuals/groups affected by or who can affect the project, understanding their interests, concerns, and expectations, and communicating with them throughout the project to maintain their support, resolve issues early, and prevent resistance. Poor engagement is a leading cause of project failure.',
    keywords: ['identify','interests','communicate','support','concerns','expectations'],
  },
  {
    id: 'r4', domain: 'people', type: 'recognition', recallWeight: 0.30,
    question: 'According to PMI, which conflict resolution approach results in the most lasting resolution?',
    options: ['Avoiding','Forcing / Directing','Collaborating / Problem-Solving','Compromising'],
    correct: 2,
    modelAnswer: 'Collaborating/Problem-Solving addresses the root cause and produces a win-win outcome.',
  },
  {
    id: 'r5', domain: 'people', type: 'prompted', recallWeight: 0.30,
    question: 'Complete: In servant leadership, the PM\'s primary focus is to ______ the team and remove ______.',
    prompt: 'Fill in the two blanks...',
    modelAnswer: 'SERVE / SUPPORT the team and remove OBSTACLES / IMPEDIMENTS',
    // Each blank has multiple acceptable synonyms — grouping them means matching
    // ANY one word per group counts as that blank being correct, instead of
    // treating "obstacles", "impediments", and "blockers" as three separate
    // required words (which used to under-score a fully correct answer).
    keywords: [['serve', 'support'], ['obstacles', 'impediments', 'blockers']],
  },

  // ── PROCESS (5) ─────────────────────────────────────────────────────────────
  {
    id: 'r6', domain: 'process', type: 'recognition', recallWeight: 0.30,
    question: 'Which process group is responsible for creating the Project Management Plan?',
    options: ['Initiating','Planning','Executing','Closing'],
    correct: 1,
    modelAnswer: 'Planning produces the Project Management Plan — the guide for how the project will be executed and controlled.',
  },
  {
    id: 'r7', domain: 'process', type: 'prompted', recallWeight: 0.30,
    question: 'Name the THREE baselines that together form the project performance measurement baseline.',
    prompt: 'List the three baselines...',
    modelAnswer: 'Scope Baseline, Schedule Baseline, Cost Baseline (together forming the Performance Measurement Baseline / PMB)',
    keywords: ['scope','schedule','cost','baseline'],
  },
  {
    id: 'r8', domain: 'process', type: 'active', recallWeight: 0.40,
    question: 'Explain what Earned Value Management (EVM) measures and name the two key performance indices with their formulas.',
    prompt: 'Explain EVM and give the two indices...',
    modelAnswer: 'EVM measures project performance against the plan using three values: PV (Planned Value), EV (Earned Value), and AC (Actual Cost). The two key indices are: CPI (Cost Performance Index) = EV / AC — measures cost efficiency (>1 = under budget); SPI (Schedule Performance Index) = EV / PV — measures schedule efficiency (>1 = ahead of schedule).',
    keywords: ['cpi','spi','ev','ac','pv','cost','schedule','performance'],
  },
  {
    id: 'r9', domain: 'process', type: 'recognition', recallWeight: 0.30,
    question: 'What does "fast-tracking" mean in schedule compression?',
    options: ['Adding more resources to critical tasks','Running sequential activities in parallel','Removing scope to shorten the schedule','Switching to agile methodology'],
    correct: 1,
    modelAnswer: 'Fast-tracking overlaps or parallels activities that were originally planned sequentially — it adds schedule risk.',
  },
  {
    id: 'r10', domain: 'process', type: 'prompted', recallWeight: 0.30,
    question: 'What is the formula for Schedule Variance (SV) in EVM?',
    prompt: 'Write the formula...',
    modelAnswer: 'SV = EV − PV  (Earned Value minus Planned Value). Positive = ahead of schedule; Negative = behind.',
    // "ev"/"earned" and "pv"/"planned" are the same two terms either as the
    // acronym or spelled out — grouped so a correct "SV = EV - PV" answer
    // isn't penalised for not also spelling out "earned" and "planned".
    keywords: [['ev', 'earned'], ['pv', 'planned'], 'sv'],
  },

  // ── BUSINESS ENVIRONMENT (5) ─────────────────────────────────────────────────
  {
    id: 'r11', domain: 'business', type: 'recognition', recallWeight: 0.30,
    question: 'What is the PRIMARY purpose of a project business case?',
    options: ['To plan the project in detail','To justify the investment and establish the expected benefits','To identify all project risks','To define the project scope'],
    correct: 1,
    modelAnswer: 'The business case justifies why the project should be undertaken — it links the project to organisational strategy and expected value.',
  },
  {
    id: 'r12', domain: 'business', type: 'prompted', recallWeight: 0.30,
    question: 'Name THREE factors that can significantly shape organisational culture on a project.',
    prompt: 'List three factors...',
    modelAnswer: 'Leadership style, organisational values/history, communication norms, reward/recognition systems, power structures, policies and procedures (any three valid).',
    keywords: ['leadership','values','culture','communication','norms','history','policies'],
    // The question only asks for three factors out of this longer valid list —
    // without minRequired, naming exactly three (as asked) would score at most
    // 3/7 ≈ 43%, marking a fully correct answer as incomplete.
    minRequired: 3,
  },
  {
    id: 'r13', domain: 'business', type: 'active', recallWeight: 0.40,
    question: 'Explain what "benefits realisation management" means, why it matters, and who typically owns it post-project.',
    prompt: 'Explain in your own words...',
    modelAnswer: 'Benefits realisation management is the process of ensuring that the outcomes delivered by a project translate into the intended organisational value (benefits) described in the business case. It matters because completing a project on time/budget/scope does not automatically mean benefits are realised — active tracking and sometimes operational changes are needed. Post-project, benefits are owned by the sponsoring organisation / benefits owner, not the project manager.',
    keywords: ['benefits','value','business case','owner','post-project','organisation','track'],
  },
  {
    id: 'r14', domain: 'business', type: 'recognition', recallWeight: 0.30,
    question: 'Which organisational structure gives the Project Manager the MOST authority?',
    options: ['Functional','Weak Matrix','Balanced Matrix','Projectised (Project-Oriented)'],
    correct: 3,
    modelAnswer: 'In a projectised structure, the PM has full authority. Team members report to the PM directly and the project is the primary business unit.',
  },
  {
    id: 'r15', domain: 'business', type: 'prompted', recallWeight: 0.30,
    question: 'Briefly distinguish between a Project, a Program, and a Portfolio.',
    prompt: 'Define all three in one or two sentences each...',
    modelAnswer: 'Project: A temporary endeavour undertaken to create a unique product, service, or result. Program: A group of related projects managed in a coordinated way to obtain benefits not available from managing them individually. Portfolio: A collection of projects, programs, and operations managed as a group to achieve strategic objectives.',
    keywords: ['temporary','program','related','portfolio','strategic','collection'],
  },
]
