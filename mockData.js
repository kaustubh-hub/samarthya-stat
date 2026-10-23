// Mock Data for MoSPI Samarthya-Stat Platform (Problem Statement 26101)

export const MOSPI_DIVISIONS = [
  { id: "NAD", name: "National Accounts Division (NAD)", description: "Estimates GDP, GVA, Capital Formation, and Macroeconomic Aggregates." },
  { id: "FOD", name: "Field Operations Division (FOD)", description: "Conducts nationwide socio-economic surveys, CAPI, and field data collection." },
  { id: "SDRD", name: "Survey Design & Research Division (SDRD)", description: "Develops survey sampling designs, schedules, and estimation methodology." },
  { id: "PSD", name: "Price Statistics Division (PSD)", description: "Compiles Consumer Price Index (CPI), Inflation rates, and ICP comparisons." },
  { id: "ESD", name: "Economic Statistics Division (ESD)", description: "Produces Index of Industrial Production (IIP), ASI, and Economic Census." },
  { id: "DIID", name: "Data Informatics & Innovation Division (DIID)", description: "Drives Big Data analytics, AI/ML, Cloud, Data Dissemination, and IT security." },
  { id: "SSD", name: "Social Statistics Division (SSD)", description: "Monitors Sustainable Development Goal (SDG) Indicators and Social Statistics." }
];

export const DESIGNATIONS = [
  { id: "JSO", title: "Junior Statistical Officer (JSO)", grade: "Group B Gazetted", targetLevel: "Core Operational" },
  { id: "SSO", title: "Senior Statistical Officer (SSO)", grade: "Group B Gazetted", targetLevel: "Intermediate Analytical" },
  { id: "AD", title: "Assistant Director (AD / ISS)", grade: "Junior Time Scale (JTS)", targetLevel: "Advanced Methodological" },
  { id: "DD", title: "Deputy Director (DD / ISS)", grade: "Senior Time Scale (STS)", targetLevel: "Policy & Strategic Statistical" },
  { id: "DIR", title: "Director / Joint Director (ISS)", grade: "Junior Administrative Grade (JAG)", targetLevel: "Executive Leadership" },
  { id: "FI", title: "Field Investigator / Data Collector", grade: "Operational Staff", targetLevel: "Field Data & Digital CAPI" }
];

export const COMPETENCY_TAXONOMY = [
  {
    pillar: "Statistical Competencies",
    icon: "BarChart3",
    color: "blue",
    competencies: [
      { id: "stat_sampling", name: "Survey Design & Sampling", target: 85, description: "Stratified, multi-stage sampling, PPSWR/PPSWOR, and variance estimation." },
      { id: "stat_accounts", name: "National Accounts & GVA", target: 80, description: "System of National Accounts (SNA 2008), GVA deflators, and input-output tables." },
      { id: "stat_price", name: "Price Statistics & Indices", target: 85, description: "CPI Rural/Urban, Laspeyres/Paasche formulas, chain-base indexing, and hedonic prices." },
      { id: "stat_sdg", name: "SDG Indicators & Data Quality", target: 75, description: "National Indicator Framework (NIF), metadata standards, and UN-DQAF compliance." }
    ]
  },
  {
    pillar: "Technical Competencies",
    icon: "Code2",
    color: "emerald",
    competencies: [
      { id: "tech_python", name: "Python for Statistical Computing", target: 80, description: "Pandas, NumPy, SciPy, statistical modelling, and automated data pipelines." },
      { id: "tech_r", name: "R & Biostatistics / Survey Pkg", target: 75, description: "R Survey package, tidyverse, econometric modelling, and ggplot2 visualisations." },
      { id: "tech_ai_ml", name: "AI & Big Data in Official Stats", target: 70, description: "NLP for classification, remote sensing imagery, time-series forecasting, and LLMs." },
      { id: "tech_gis", name: "GIS & Spatial Analytics", target: 65, description: "QGIS, geospatial boundary mapping, spatial interpolation, and satellite crop acreage." }
    ]
  },
  {
    pillar: "Digital Governance",
    icon: "ShieldCheck",
    color: "amber",
    competencies: [
      { id: "gov_dpdp", name: "Data Privacy & DPDP Act 2023", target: 85, description: "Data fiduciary principles, anonymization protocols, and citizen consent frameworks." },
      { id: "gov_cyber", name: "Cybersecurity & Gov Cloud", target: 80, description: "CERT-In guidelines, MeghRaj cloud security, digital signatures, and API security." },
      { id: "gov_dpi", name: "Digital Public Infrastructure", target: 75, description: "Open Data Policy (NDSAP), data exchanges, and interoperable government APIs." }
    ]
  },
  {
    pillar: "Behavioural & Managerial",
    icon: "Users2",
    color: "purple",
    competencies: [
      { id: "man_leadership", name: "Statistical Leadership & Team Mentoring", target: 80, description: "Managing multi-disciplinary survey teams and field supervision." },
      { id: "man_decision", name: "Evidence-based Policy Formulation", target: 85, description: "Translating statistical findings into actionable cabinet notes and policy briefs." },
      { id: "man_ethics", name: "Ethics & Statistical Confidentiality", target: 90, description: "Collection of Statistics Act 2008, official confidentiality, and integrity." }
    ]
  }
];

export const INITIAL_DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    competencyId: "stat_sampling",
    pillar: "Statistical Competencies",
    question: "In Periodic Labour Force Survey (PLFS), if the sampling frame has heterogeneous strata with varying variance, which allocation method yields the minimum variance for an estimated total under a fixed sample size?",
    options: [
      "Equal allocation among all strata",
      "Proportional allocation based on population size",
      "Neyman allocation (optimal allocation proportional to stratum size and standard deviation)",
      "Systematic random allocation without replacement"
    ],
    correctAnswer: 2,
    explanation: "Neyman allocation allocates sample sizes proportional to both the stratum size (N_h) and stratum standard deviation (S_h), mathematically minimizing the variance of the stratified estimator for a fixed total sample size.",
    difficulty: "Medium"
  },
  {
    id: 2,
    competencyId: "stat_accounts",
    pillar: "Statistical Competencies",
    question: "Under the System of National Accounts (SNA 2008) adopted by MoSPI, Gross Value Added (GVA) at basic prices is derived from Gross Value of Output (GVO) at basic prices by subtracting:",
    options: [
      "Taxes on products net of subsidies",
      "Intermediate consumption at purchasers prices",
      "Compensation of employees and operating surplus",
      "Consumption of fixed capital (depreciation)"
    ],
    correctAnswer: 1,
    explanation: "GVA at basic prices = Gross Value of Output (at basic prices) - Intermediate Consumption (at purchasers prices). Adding product taxes and subtracting product subsidies subsequently gives GDP at market prices.",
    difficulty: "Medium"
  },
  {
    id: 3,
    competencyId: "stat_price",
    pillar: "Statistical Competencies",
    question: "Which index number formula satisfies both the Time Reversal Test and the Factor Reversal Test simultaneously?",
    options: [
      "Laspeyres Price Index",
      "Paasche Price Index",
      "Fishers Ideal Index (Geometric mean of Laspeyres and Paasche)",
      "Marshall-Edgeworth Index"
    ],
    correctAnswer: 2,
    explanation: "Irving Fisher proved that his Ideal Index (the geometric mean of Laspeyres and Paasche indices) uniquely satisfies both the Time Reversal Test and Factor Reversal Test.",
    difficulty: "Easy"
  },
  {
    id: 4,
    competencyId: "stat_sdg",
    pillar: "Statistical Competencies",
    question: "The National Indicator Framework (NIF) developed by MoSPI aligns with which international standard framework for tracking global progress?",
    options: [
      "UN Sustainable Development Goals (SDG 2030 Agenda)",
      "World Bank Worldwide Governance Indicators",
      "OECD Better Life Index",
      "IMF Special Data Dissemination Standard (SDDS)"
    ],
    correctAnswer: 0,
    explanation: "MoSPI is the nodal agency in India responsible for tracking the 17 UN Sustainable Development Goals (SDGs) via India-specific National Indicator Framework (NIF) comprising 300+ indicators.",
    difficulty: "Easy"
  },
  {
    id: 5,
    competencyId: "tech_python",
    pillar: "Technical Competencies",
    question: "When processing micro-data from NSS fixed-width records in Python Pandas, which method efficiently parses positional columns without full delimiter splitting?",
    options: [
      "pd.read_csv(delimiter=',')",
      "pd.read_fwf(colspecs=..., widths=...)",
      "pd.read_json(orient='records')",
      "pd.read_sql_query()"
    ],
    correctAnswer: 1,
    explanation: "pd.read_fwf (Read Fixed-Width Formatted lines) takes colspecs or widths parameters, specifically designed for parsing fixed-column institutional survey files common in MoSPI/NSSO archives.",
    difficulty: "Medium"
  },
  {
    id: 6,
    competencyId: "tech_r",
    pillar: "Technical Competencies",
    question: "Which R package is the gold standard for specifying complex survey designs (stratification, clusters/PSUs, and survey weights) for unbiased variance estimation?",
    options: [
      "ggplot2",
      "survey (by Thomas Lumley)",
      "dplyr",
      "caret"
    ],
    correctAnswer: 1,
    explanation: "The survey package in R by Thomas Lumley implements Taylor series linearization, Jackknife, and Bootstrap replication to compute correct standard errors for stratified, clustered survey designs.",
    difficulty: "Medium"
  },
  {
    id: 7,
    competencyId: "tech_ai_ml",
    pillar: "Technical Competencies",
    question: "In modern official statistics, how are Large Language Models (LLMs) and NLP classifiers primarily deployed by national statistical agencies to reduce manual coding latency?",
    options: [
      "Replacing all field survey interviewers entirely",
      "Automated coding of open-ended economic activity text into National Industrial Classification (NIC-2008) and NCO codes",
      "Generating fabricated survey responses when non-response occurs",
      "Computing aggregate national GDP without input data"
    ],
    correctAnswer: 1,
    explanation: "Statistical agencies worldwide (including Eurostat, US Census Bureau, and MoSPI pilots) use NLP and LLMs to auto-code verbatim job descriptions and business activities into standard classification codes (NIC/ISIC, NCO/ISCO).",
    difficulty: "Hard"
  },
  {
    id: 8,
    competencyId: "tech_gis",
    pillar: "Technical Competencies",
    question: "What remote-sensing vegetation index is standardly combined with cadastral maps to forecast early crop acreage before ground agricultural census verification?",
    options: [
      "Consumer Price Index (CPI)",
      "Normalized Difference Vegetation Index (NDVI) derived from Sentinel/Landsat satellite bands",
      "Digital Elevation Model (DEM) aspect ratio only",
      "Surface Temperature Index without spectral reflectance"
    ],
    correctAnswer: 1,
    explanation: "NDVI, calculated using near-infrared and visible red reflectance (NIR - Red)/(NIR + Red), correlates directly with chlorophyll content and crop vigor for agricultural yield forecasting.",
    difficulty: "Medium"
  },
  {
    id: 9,
    competencyId: "gov_dpdp",
    pillar: "Digital Governance",
    question: "Under the Digital Personal Data Protection Act 2023 (DPDP Act), what is the mandatory requirement for government entities collecting citizen data for statistical dissemination?",
    options: [
      "Publishing all raw un-anonymized voter records publicly",
      "Ensuring robust pseudonymisation, de-identification, purpose limitation, and prevention of re-identification",
      "Sharing confidential microdata with commercial advertising firms",
      "Retaining identifiable citizen responses indefinitely without audit trails"
    ],
    correctAnswer: 1,
    explanation: "The DPDP Act 2023 and Section 11 of the Collection of Statistics Act 2008 strictly protect respondent confidentiality, mandating data masking, purpose limitation, and aggregated or de-identified dissemination.",
    difficulty: "Medium"
  },
  {
    id: 10,
    competencyId: "gov_cyber",
    pillar: "Digital Governance",
    question: "According to National Informatics Centre (NIC) and CERT-In compliance for official statistical web portals, which protocol must be enforced for all API data endpoints?",
    options: [
      "Plain text HTTP with clear-text API keys",
      "TLS 1.3 encryption, mTLS/OAuth 2.0 token authentication, and role-based access control (RBAC)",
      "Open FTP protocol without password credentials",
      "Telnet remote terminal connections"
    ],
    correctAnswer: 1,
    explanation: "Government cloud security standards require TLS 1.3, cryptographic token authentication (OAuth 2.0 / JWT), and strict RBAC to prevent unauthorized data tampering.",
    difficulty: "Easy"
  },
  {
    id: 11,
    competencyId: "gov_dpi",
    pillar: "Digital Governance",
    question: "Under the National Data Sharing and Accessibility Policy (NDSAP), open government datasets (OGD India) must be made available in which format to ensure interoperability?",
    options: [
      "Scanned hand-written image PDFs",
      "Machine-readable, open formats like CSV, JSON, and XML with standardized metadata",
      "Proprietary locked binary databases requiring paid licensed viewers",
      "Hardcopy paper gazette printouts only"
    ],
    correctAnswer: 1,
    explanation: "NDSAP mandates that all proactively disclosable government datasets be published in machine-readable, open standards (CSV, JSON, XML) accompanied by formal data dictionaries.",
    difficulty: "Easy"
  },
  {
    id: 12,
    competencyId: "man_leadership",
    pillar: "Behavioural & Managerial",
    question: "During a nationwide field survey, non-sampling errors due to investigator fatigue and non-response are best mitigated through:",
    options: [
      "Penalizing respondents who refuse to answer",
      "Rigorous pre-survey CAPI mock trials, concurrent field inspections, and real-time validation checks embedded in survey tablets",
      "Ignoring outlier responses and substituting them with zero",
      "Cancelling the entire survey round"
    ],
    correctAnswer: 1,
    explanation: "Non-sampling errors are minimized through continuous quality control, automated validation scripts on CAPI devices, spot-checks by supervisory officers, and comprehensive enumerator debriefs.",
    difficulty: "Medium"
  },
  {
    id: 13,
    competencyId: "man_ethics",
    pillar: "Behavioural & Managerial",
    question: "Under the Collection of Statistics Act, 2008, what is the legal penalty for an official who unlawfully discloses confidential information obtained during official data collection?",
    options: [
      "No penalty exists for government officers",
      "Imprisonment up to six months, or fine, or both, along with administrative disciplinary action",
      "An informal verbal caution only",
      "Transfer to another city without legal trial"
    ],
    correctAnswer: 1,
    explanation: "Section 23 of the Collection of Statistics Act 2008 stipulates strict penal consequences, including imprisonment up to 6 months or fines, for breach of official confidentiality.",
    difficulty: "Hard"
  }
];

export const IGOT_COURSES = [
  {
    id: "igot_001",
    igotCode: "iGOT-STAT-2026-101",
    title: "Advanced Survey Sampling & Estimation Techniques",
    provider: "National Statistical Systems Training Academy (NSSTA) & iGOT",
    category: "Statistical Competencies",
    competencyId: "stat_sampling",
    duration: "18 Hours (Self-paced)",
    rating: 4.9,
    enrolledCount: 3840,
    level: "Intermediate to Advanced",
    igotVerified: true,
    syllabusMatch: 96,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Master multi-stage stratification, variance estimation for non-linear statistics, Horvitz-Thompson estimators, and handling non-sampling errors in NSSO rounds.",
    modules: ["Probability Sampling Fundamentals", "Complex Survey Design in NSS", "Variance Estimation & Jackknife Methods", "Hands-on R Survey Package"]
  },
  {
    id: "igot_002",
    igotCode: "iGOT-SNA-2026-204",
    title: "System of National Accounts (SNA 2008) & GDP Compilation",
    provider: "MoSPI Central Training & DoPT",
    category: "Statistical Competencies",
    competencyId: "stat_accounts",
    duration: "24 Hours",
    rating: 4.8,
    enrolledCount: 2950,
    level: "Advanced",
    igotVerified: true,
    syllabusMatch: 98,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "In-depth guide to India's National Accounts methodology, Supply and Use Tables (SUT), double-deflation techniques, and measuring informal economy GVA.",
    modules: ["SNA 2008 Conceptual Framework", "Production Account & GVA Estimation", "Financial Intermediation (FISIM)", "Double Deflation & Price Deflators"]
  },
  {
    id: "igot_003",
    igotCode: "iGOT-TECH-2026-305",
    title: "Python for Official Statistics & Big Data Processing",
    provider: "Data Informatics & Innovation Division (DIID) - NIC",
    category: "Technical Competencies",
    competencyId: "tech_python",
    duration: "30 Hours (with Coding Sandbox)",
    rating: 4.95,
    enrolledCount: 5120,
    level: "Beginner to Advanced",
    igotVerified: true,
    syllabusMatch: 94,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Automate statistical data cleaning, parse large-scale fixed-width microdata, perform econometric regression, and generate automated statistical bulletins.",
    modules: ["Python Basics for Statisticians", "Pandas & Polars for Multi-Gigabyte Survey Data", "Statistical Hypothesis Testing in SciPy", "Automated Report Generation"]
  },
  {
    id: "igot_004",
    igotCode: "iGOT-AI-2026-410",
    title: "AI, Machine Learning & NLP for National Statistical Systems",
    provider: "MeitY, NITI Aayog & MoSPI",
    category: "Technical Competencies",
    competencyId: "tech_ai_ml",
    duration: "20 Hours",
    rating: 4.9,
    enrolledCount: 4180,
    level: "Intermediate",
    igotVerified: true,
    syllabusMatch: 95,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Learn how modern statistical offices apply NLP for automated text classification (NIC/NCO codes), web scraping for price collection, and satellite imagery for agriculture.",
    modules: ["ML Foundations for Statisticians", "Automated Text Classification with Transformers", "Web Scraping for High-Frequency Price Data", "Computer Vision for Crop Yield Estimation"]
  },
  {
    id: "igot_005",
    igotCode: "iGOT-CPI-2026-118",
    title: "Price Statistics, CPI Compilation & Index Number Theory",
    provider: "Price Statistics Division (PSD) & NSSTA",
    category: "Statistical Competencies",
    competencyId: "stat_price",
    duration: "15 Hours",
    rating: 4.75,
    enrolledCount: 2130,
    level: "Core Operational",
    igotVerified: true,
    syllabusMatch: 97,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Comprehensive training on Consumer Price Index (CPI Rural, Urban & Combined), index weighting, geometric mean aggregations, and quality adjustments.",
    modules: ["Index Number Axioms & Formulas", "Basket Construction & Household Consumption Surveys", "Chain Base vs Fixed Base Indices", "Elementary Aggregate Calculations"]
  },
  {
    id: "igot_006",
    igotCode: "iGOT-GOV-2026-502",
    title: "Digital Personal Data Protection Act (DPDP) 2023 for Public Servants",
    provider: "Ministry of Law & Justice, MeitY & ISTM",
    category: "Digital Governance",
    competencyId: "gov_dpdp",
    duration: "10 Hours",
    rating: 4.88,
    enrolledCount: 8940,
    level: "Essential / All Cadres",
    igotVerified: true,
    syllabusMatch: 99,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Understand statutory responsibilities of Data Fiduciaries, anonymization techniques, data breach penalties, and respondent confidentiality under Indian law.",
    modules: ["DPDP Act 2023 Core Provisions", "Consent Management & Exemptions for Research", "Technical Measures for Anonymization", "Audit Compliance & Citizen Rights"]
  },
  {
    id: "igot_007",
    igotCode: "iGOT-R-2026-215",
    title: "R Programming for Econometrics & Complex Survey Analysis",
    provider: "Indian Statistical Institute (ISI) & iGOT",
    category: "Technical Competencies",
    competencyId: "tech_r",
    duration: "25 Hours",
    rating: 4.85,
    enrolledCount: 3410,
    level: "Intermediate",
    igotVerified: true,
    syllabusMatch: 93,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Harness R for official data analysis. Master the survey and srvyr packages, time-series seasonal adjustments with X-13ARIMA-SEATS, and publication graphics.",
    modules: ["Tidyverse Workflow", "Complex Survey Analysis with survey Pkg", "Seasonal Adjustment in Official Time Series", "Interactive Dashboards with Shiny"]
  },
  {
    id: "igot_008",
    igotCode: "iGOT-CYBER-2026-601",
    title: "Cyber Security & Information Assurance in Government Systems",
    provider: "CERT-In, MeitY & National Informatics Centre",
    category: "Digital Governance",
    competencyId: "gov_cyber",
    duration: "12 Hours",
    rating: 4.8,
    enrolledCount: 7650,
    level: "Mandatory",
    igotVerified: true,
    syllabusMatch: 91,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Guidelines for securing government data portals, preventing phishing and credential theft, cloud data protection on MeghRaj, and incident reporting.",
    modules: ["Cyber Hygiene & Threat Landscape", "Securing API Endpoints", "MeghRaj Government Cloud Architecture", "Incident Response Framework"]
  },
  {
    id: "igot_009",
    igotCode: "iGOT-GIS-2026-330",
    title: "Geospatial Analysis & QGIS for Statistical Demography",
    provider: "Survey of India & MoSPI DIID",
    category: "Technical Competencies",
    competencyId: "tech_gis",
    duration: "16 Hours",
    rating: 4.7,
    enrolledCount: 1890,
    level: "Intermediate",
    igotVerified: true,
    syllabusMatch: 88,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Map census enumeration blocks, integrate GPS coordinates from CAPI surveys, and generate thematic choropleth maps for administrative dissemination.",
    modules: ["GIS Basics & Coordinate Reference Systems", "QGIS Hands-on for Boundary Demarcation", "Spatial Joins with NSS Survey Data", "Interactive Web Maps"]
  },
  {
    id: "igot_010",
    igotCode: "iGOT-SDG-2026-105",
    title: "SDG Indicators Monitoring & Data Quality Frameworks",
    provider: "Social Statistics Division (SSD) & UN-ESCAP",
    category: "Statistical Competencies",
    competencyId: "stat_sdg",
    duration: "14 Hours",
    rating: 4.82,
    enrolledCount: 2470,
    level: "Core Operational",
    igotVerified: true,
    syllabusMatch: 95,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Implementation of the UN Data Quality Assurance Framework (UN-DQAF), metadata documentation (SDMX), and aligning state indicator frameworks with national goals.",
    modules: ["UN SDG Global Indicator Framework", "National Indicator Framework (NIF) Architecture", "Data Quality Dimensions: Timeliness, Accuracy, Reusability", "SDMX Standards"]
  }
];

export const NSSTA_TPAC_PROGRAMS = [
  {
    id: "nssta_001",
    title: "Residential Induction & Advanced Analytics Programme for ISS / SSS",
    location: "NSSTA Campus, Greater Noida (UP)",
    duration: "2 Weeks (Residential)",
    intakePeriod: "Batch 2026-Q2",
    mode: "In-Person Classroom & Labs",
    category: "Institutional Cadre Training",
    targetCadre: "Junior & Senior Statistical Officers (ISS/SSS)",
    seats: 45,
    status: "Nominations Open",
    description: "Hands-on residential workshop on econometric modelling, large-scale survey supervision, modern CAPI workflows, and public policy formulation."
  },
  {
    id: "nssta_002",
    title: "Executive Masterclass on Big Data & Satellite Analytics in Agriculture",
    location: "Hybrid (Virtual + 3 Days NSSTA Greater Noida)",
    duration: "1 Month (Hybrid)",
    intakePeriod: "Batch 2026-Q3",
    mode: "Hybrid",
    category: "Technical Upskilling",
    targetCadre: "Assistant Directors & Directors",
    seats: 30,
    status: "Upcoming",
    description: "Joint program with Indian Agricultural Statistics Research Institute (IASRI) on utilizing remote sensing for real-time crop acreage estimation."
  },
  {
    id: "nssta_003",
    title: "Specialized Training on Compilation of State Domestic Product (GSDP)",
    location: "State Statistical Bureaus (DES) & NSSTA Regional Centers",
    duration: "1 Week Intensive",
    intakePeriod: "Rolling Monthly",
    mode: "In-Person",
    category: "National Accounts Division Support",
    targetCadre: "Statistical Officers handling State Accounts",
    seats: 50,
    status: "Active Registration",
    description: "Capacity building for State Directorate of Economics and Statistics (DES) officials on standardizing GSDP estimation aligned with SNA 2008."
  }
];

export const PRELOADED_LEARNING_MATERIALS = [
  {
    id: "mat_001",
    title: "Official Handbook: System of National Accounts & GVA Deflators (2024)",
    division: "National Accounts Division (NAD)",
    pages: "18 Pages Excerpt",
    fileSize: "2.4 MB",
    summary: "Comprehensive methodological guide on double-deflation of Gross Value Added, compilation of Supply and Use Tables (SUT), and measuring digital intermediary platforms.",
    sampleText: `GOVERNMENT OF INDIA - MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
DATA INFORMATICS & INNOVATION DIVISION (DIID) & NATIONAL ACCOUNTS DIVISION (NAD)
METHODOLOGICAL NOTE: ESTIMATION OF GROSS VALUE ADDED (GVA) AND DOUBLE DEFLATION IN OFFICIAL STATISTICS

1. CONCEPTUAL ARCHITECTURE
Gross Value Added (GVA) at basic prices represents the value of output minus the value of intermediate consumption. Output is valued at basic prices, which reflects the amount receivable by the producer from the purchaser for a unit of a good or service produced, excluding any taxes on products payable, but including subsidies on products receivable.
Intermediate consumption consists of the value of the goods and services consumed as inputs by a process of production, excluding fixed assets whose consumption is recorded as consumption of fixed capital. Intermediate consumption is valued at purchasers prices.

2. DOUBLE DEFLATION METHODOLOGY
In accordance with SNA 2008 and international best practices, single deflation using output price indices can introduce substantial bias when intermediate input prices diverge from output prices. Double deflation requires:
(a) Deflating gross output at current prices using an appropriate output price index (e.g., specific Wholesale Price Index or Producer Price Index series) to obtain constant-price output.
(b) Deflating intermediate inputs at current prices using input-specific price indices weighted according to the input cost structure derived from the latest Supply and Use Tables (SUT).
Constant Price GVA is then calculated directly as the difference: Constant Price GVA = Constant Price Output - Constant Price Intermediate Inputs.

3. DIGITAL INTERMEDIATION PLATFORMS & E-COMMERCE VALUATION
Digital platforms that facilitate transactions between buyers and sellers without taking ownership of the goods are treated as service providers. Their output is measured by the facilitation fees, commissions, and advertising revenue generated, rather than the total gross merchandise value (GMV) of goods transacted.

4. CAPITAL FORMATION & INTELLECTUAL PROPERTY PRODUCTS (IPP)
Under the 2011-12 and revised base series, Research and Development (R&D) and software creation are treated as capital formation rather than intermediate consumption, recognizing that knowledge assets provide economic returns over multiple accounting periods.`,
    questions: [
      {
        id: 1,
        difficulty: "Easy",
        question: "How is Gross Value Added (GVA) at basic prices fundamentally calculated from output and intermediate consumption?",
        options: [
          "GVA = Output at basic prices + Intermediate consumption at purchasers prices",
          "GVA = Output at basic prices - Intermediate consumption at purchasers prices",
          "GVA = Output at basic prices * Product taxes",
          "GVA = Intermediate consumption - Subsidies"
        ],
        correctAnswer: 1,
        explanation: "As stated in Section 1, GVA at basic prices represents the value of gross output at basic prices minus intermediate consumption at purchasers prices.",
        topic: "GVA Foundations"
      },
      {
        id: 2,
        difficulty: "Medium",
        question: "Why does the handbook mandate 'Double Deflation' over single deflation when calculating constant price GVA?",
        options: [
          "Single deflation requires double the computation time",
          "Single deflation introduces substantial bias when intermediate input price movements diverge from output prices",
          "Double deflation eliminates all forms of product taxes automatically",
          "Single deflation is banned under United Nations treaties"
        ],
        correctAnswer: 1,
        explanation: "Section 2 notes that single deflation using only output price indices introduces bias when intermediate input prices diverge from output prices. Double deflation deflates outputs and inputs separately.",
        topic: "Double Deflation"
      },
      {
        id: 3,
        difficulty: "Medium",
        question: "Under the latest SNA standards, how is output measured for Digital Intermediation Platforms that do not own transacted goods?",
        options: [
          "By the total Gross Merchandise Value (GMV) of all goods transacted",
          "By the total market capitalization of the technology company",
          "By the facilitation fees, commissions, and advertising revenue generated",
          "Digital platforms have zero recorded output in national accounts"
        ],
        correctAnswer: 2,
        explanation: "Section 3 specifies that platforms acting as facilitators are treated as service providers; their output is measured by commissions, fees, and advertising rather than gross merchandise value.",
        topic: "Digital Economy Accounting"
      },
      {
        id: 4,
        difficulty: "Hard",
        question: "In what category does SNA 2008 treat expenditure on software creation and Research & Development (R&D)?",
        options: [
          "Intermediate consumption consumed immediately within the financial year",
          "Gross Capital Formation under Intellectual Property Products (IPP)",
          "Transfer payments from government reserves",
          "Household personal final consumption expenditure"
        ],
        correctAnswer: 1,
        explanation: "Section 4 highlights that R&D and software are capitalized as Intellectual Property Products (IPP) under Gross Capital Formation because they generate economic benefits across multiple accounting cycles.",
        topic: "Capital Formation & IPP"
      },
      {
        id: 5,
        difficulty: "Easy",
        question: "At which price valuation is intermediate consumption recorded according to the handbook?",
        options: [
          "Basic prices",
          "Purchasers prices",
          "Factor cost",
          "Shadow exchange rate"
        ],
        correctAnswer: 1,
        explanation: "Intermediate consumption consists of inputs consumed in production and is explicitly valued at purchasers prices (inclusive of delivery margins and net product taxes).",
        topic: "Price Valuation"
      },
      {
        id: 6,
        difficulty: "Medium",
        question: "What matrix derived from Input-Output analysis provides the weighting pattern for intermediate input deflators?",
        options: [
          "Consumer Price Basket Weight Matrix",
          "Supply and Use Tables (SUT)",
          "Exchange Rate Parity Table",
          "Periodic Labour Force Schedule"
        ],
        correctAnswer: 1,
        explanation: "Section 2(b) states that input-specific price indices are weighted according to the input cost structure derived from the latest Supply and Use Tables (SUT).",
        topic: "Supply & Use Tables"
      },
      {
        id: 7,
        difficulty: "Hard",
        question: "What is excluded from intermediate consumption because its economic contribution is already recorded under depreciation?",
        options: [
          "Electricity and fuel inputs",
          "Raw materials and packaging supplies",
          "Fixed assets whose usage is recorded as Consumption of Fixed Capital (CFC)",
          "Auditing and legal consultancy fees"
        ],
        correctAnswer: 2,
        explanation: "Section 1 explicitly states that intermediate consumption excludes fixed assets whose wear and tear is accounted for as Consumption of Fixed Capital (CFC).",
        topic: "Intermediate Consumption Scope"
      },
      {
        id: 8,
        difficulty: "Medium",
        question: "Which of the following is included in the basic price receivable by the producer?",
        options: [
          "Product taxes like GST payable to the treasury",
          "Subsidies on products receivable by the producer",
          "Trade margins added by wholesale distributors",
          "Transport charges separately invoiced by courier agents"
        ],
        correctAnswer: 1,
        explanation: "Basic price includes subsidies on products receivable from government to reduce market price, while excluding taxes on products payable.",
        topic: "Basic Prices vs Market Prices"
      },
      {
        id: 9,
        difficulty: "Hard",
        question: "If Gross Value of Output at constant prices is 500 Crore and Intermediate Inputs at constant prices is 280 Crore, what is the Constant Price GVA?",
        options: [
          "780 Crore",
          "220 Crore",
          "140 Crore",
          "350 Crore"
        ],
        correctAnswer: 1,
        explanation: "Constant Price GVA = Constant Price Output (500) - Constant Price Intermediate Inputs (280) = 220 Crore.",
        topic: "Numerical Aggregates"
      },
      {
        id: 10,
        difficulty: "Easy",
        question: "Which division of MoSPI is primarily responsible for the official compilation of National Accounts and GDP?",
        options: [
          "Field Operations Division (FOD)",
          "National Accounts Division (NAD)",
          "Survey Design & Research Division (SDRD)",
          "Price Statistics Division (PSD)"
        ],
        correctAnswer: 1,
        explanation: "The National Accounts Division (NAD) of MoSPI is the official custodian and compilation authority for India National Accounts Statistics.",
        topic: "Institutional Governance"
      }
    ]
  },
  {
    id: "mat_002",
    title: "Methodological Manual: Consumer Price Index (CPI Rural & Urban) 2024",
    division: "Price Statistics Division (PSD)",
    pages: "14 Pages Excerpt",
    fileSize: "1.9 MB",
    summary: "Detailed procedures for price collection, imputation of missing items, chain base formulation, geometric mean elementary aggregation, and rural-urban weight integration.",
    sampleText: `GOVERNMENT OF INDIA - MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
PRICE STATISTICS DIVISION (PSD)
METHODOLOGICAL MANUAL FOR COMPILATION OF CONSUMER PRICE INDEX (CPI - RURAL, URBAN, COMBINED)

1. OBJECTIVE AND SCOPE
The Consumer Price Index (CPI) measures changes over time in the general level of prices of goods and services that a reference population acquires, uses, or pays for consumption. In India, MoSPI compiles separate CPIs for Rural and Urban sectors along with a Combined all-India index.

2. ELEMENTARY AGGREGATES & FORMULATION
At the elementary aggregate level, prices collected across selected markets are synthesized using the Jevons formula (geometric mean of price relatives) to minimize upward substitution bias inherent in arithmetic averages (Carli formula).
For higher-level aggregation, the modified Laspeyres formula is applied using fixed consumption expenditure weights derived from the Household Consumption Expenditure Survey (HCES).

3. HANDLING OUTLETS AND MISSING QUOTATIONS
When an item is temporarily missing in a surveyed market, the following imputation hierarchy must be followed:
- Class-mean imputation: Price change is imputed based on the average price change of similar varieties within the same elementary item group.
- Carry-forward pricing is strictly discouraged except under verified emergency circumstances for a maximum of one monthly cycle.
- Permanent disappearance requires identification of a comparable replacement variety with appropriate quality adjustment (overlap pricing or hedonics).

4. COMPUTATION OF COMBINED ALL-INDIA CPI
The all-India Combined CPI is calculated as the weighted average of the all-India Rural index and all-India Urban index, weighted by total aggregate consumer expenditure calculated from the latest nationwide consumption survey.`,
    questions: [
      {
        id: 1,
        difficulty: "Easy",
        question: "Which formula is recommended at the elementary aggregate level in CPI compilation to avoid arithmetic substitution bias?",
        options: [
          "Carli Formula (Arithmetic mean of price relatives)",
          "Jevons Formula (Geometric mean of price relatives)",
          "Dutot Formula without sample normalization",
          "Harmonic Mean Index"
        ],
        correctAnswer: 1,
        explanation: "Section 2 specifies that the Jevons formula (geometric mean) is used at the elementary aggregate level to minimize upward substitution bias.",
        topic: "Elementary Aggregation"
      },
      {
        id: 2,
        difficulty: "Medium",
        question: "From which nationwide survey are the consumption expenditure weights for the Indian CPI basket derived?",
        options: [
          "Annual Survey of Industries (ASI)",
          "Household Consumption Expenditure Survey (HCES / NSS)",
          "Periodic Labour Force Survey (PLFS)",
          "Agricultural Census"
        ],
        correctAnswer: 1,
        explanation: "Consumption basket weights are derived directly from the nationwide Household Consumption Expenditure Survey (HCES) conducted by MoSPI.",
        topic: "CPI Basket Weighting"
      },
      {
        id: 3,
        difficulty: "Medium",
        question: "What is the official guideline regarding 'carry-forward pricing' for temporarily missing items in surveyed markets?",
        options: [
          "It is standard practice and can be carried forward for 12 months",
          "It is strictly discouraged and permitted only under verified emergency for at most one cycle",
          "It is mandatory for all food items",
          "Prices should be set to zero when an item is missing"
        ],
        correctAnswer: 1,
        explanation: "Section 3 clarifies that carry-forward pricing creates artificial price rigidity and is strictly discouraged except for a maximum of one cycle during emergencies.",
        topic: "Imputation Protocols"
      },
      {
        id: 4,
        difficulty: "Hard",
        question: "How is the all-India Combined CPI mathematically synthesized from Rural and Urban CPI series?",
        options: [
          "Simple arithmetic unweighted average of the two numbers",
          "Weighted average of Rural and Urban indices using aggregate consumer expenditure weights",
          "Taking whichever index is higher in that month",
          "Geometric mean of population ratios only"
        ],
        correctAnswer: 1,
        explanation: "Section 4 establishes that Combined CPI is the weighted average of Rural and Urban indices weighted by total consumer expenditure.",
        topic: "Combined Index Aggregation"
      },
      {
        id: 5,
        difficulty: "Easy",
        question: "Which formula is applied for higher-level index aggregation across commodity subgroups?",
        options: [
          "Modified Laspeyres Index with fixed base weights",
          "Unweighted mode average",
          "Random walk index",
          "Geometric Paasche Index"
        ],
        correctAnswer: 0,
        explanation: "Higher-level aggregation in official statistics uses the modified Laspeyres index with fixed expenditure weights from the base period.",
        topic: "Higher Level Aggregation"
      },
      {
        id: 6,
        difficulty: "Medium",
        question: "When a surveyed commodity undergoes a permanent quality improvement, what method is required to prevent artificial inflation?",
        options: [
          "Ignore the change and record the new sticker price as pure inflation",
          "Quality adjustment (such as overlap pricing or hedonic regression)",
          "Delete the item permanently from the national basket",
          "Impute the price as zero"
        ],
        correctAnswer: 1,
        explanation: "Section 3 mandates quality adjustments (e.g. overlap pricing or hedonic pricing) so that technological improvements are not misclassified as pure price inflation.",
        topic: "Quality Adjustment"
      },
      {
        id: 7,
        difficulty: "Hard",
        question: "What is the primary advantage of the Jevons formula over the Carli formula?",
        options: [
          "It satisfies the Time Reversal Test and reduces substitution bias",
          "It requires only one price quote per state",
          "It gives double weight to luxury items",
          "It does not require mathematical calculation"
        ],
        correctAnswer: 0,
        explanation: "The Jevons formula satisfies the Time Reversal Test and does not suffer from the upward drift inherent in arithmetic price relative averages (Carli).",
        topic: "Index Axiomatics"
      },
      {
        id: 8,
        difficulty: "Easy",
        question: "Which division within MoSPI oversees the monthly release of the Consumer Price Index (CPI)?",
        options: [
          "Price Statistics Division (PSD)",
          "National Sample Survey Office - FOD only",
          "Computer Centre Division",
          "Infrastructure Division"
        ],
        correctAnswer: 0,
        explanation: "The Price Statistics Division (PSD) located in New Delhi compiles and releases the monthly all-India Consumer Price Indices.",
        topic: "Institutional Custodianship"
      },
      {
        id: 9,
        difficulty: "Medium",
        question: "Under class-mean imputation for a missing item quotation, how is the price movement determined?",
        options: [
          "Assumed to increase by exactly 5% per month",
          "Based on the average price change of similar varieties within the same elementary group",
          "Taken from the foreign stock exchange",
          "Derived from the wholesale bullion index"
        ],
        correctAnswer: 1,
        explanation: "Class-mean imputation estimates the missing price using the rate of change observed among similar items within the same elementary class.",
        topic: "Statistical Imputation"
      },
      {
        id: 10,
        difficulty: "Hard",
        question: "Why does MoSPI release separate Rural and Urban price indices rather than a single unified price basket?",
        options: [
          "Rural and urban households exhibit substantially different consumption expenditure baskets and market structures",
          "Rural areas do not have any retail shops",
          "Urban data cannot be verified electronically",
          "Because international laws prohibit unified calculation"
        ],
        correctAnswer: 0,
        explanation: "Consumption patterns, food share proportions, and retail supply chains differ significantly between rural and urban India, necessitating distinct weights and market monitoring.",
        topic: "Spatial Demographics"
      }
    ]
  }
];

export const SAMPLE_RESUMES = [
  {
    id: "sample_sso_nad",
    name: "Rajesh Kumar Verma",
    title: "Senior Statistical Officer (SSO)",
    division: "NAD",
    experience: "6.5 Years",
    qualifications: "M.Sc. Statistics (Delhi University), PGDCA",
    summaryText: `Senior Statistical Officer with 6+ years at MoSPI, currently assigned to National Accounts Division (NAD). Extensive experience in compilation of Gross Value Added (GVA) for manufacturing and services sectors. Conducted field supervisory audits in FOD during NSS 77th Round. Proficient in MS-Excel advanced statistical modelling, intermediate Stata, and basic R. Eager to upskill in Python automated data pipelines, modern AI/ML text classification for NIC-2008 coding, and DPDP Act 2023 compliance for official microdata dissemination.`,
    extractedSkills: [
      "National Accounts & GVA Compilation",
      "Macroeconomic Deflators & SUT",
      "NSS Survey Supervision (FOD)",
      "Stata Econometric Modelling",
      "Basic R Programming",
      "Data Quality Audits"
    ],
    detectedGaps: [
      "Python for Big Data (Critical)",
      "AI/ML & NLP Classification (Critical)",
      "DPDP Act 2023 Compliance (Moderate)",
      "GIS Spatial Analytics (Moderate)"
    ]
  },
  {
    id: "sample_jso_fod",
    name: "Pooja Sharma",
    title: "Junior Statistical Officer (JSO)",
    division: "FOD",
    experience: "2.5 Years",
    qualifications: "M.A. Economics & Econometrics, B.Sc. Mathematics",
    summaryText: `Junior Statistical Officer serving in the Field Operations Division (FOD), Maharashtra Regional Office. Directly responsible for Periodic Labour Force Survey (PLFS) data collection using CAPI tablets. Well versed in probability sampling, multi-stage stratification, household listing, and respondent handling under the Collection of Statistics Act. Seeking to upgrade computational skills in R survey package, Python scripting, and price statistics index compilation.`,
    extractedSkills: [
      "CAPI Digital Data Collection",
      "PLFS & Labour Statistics",
      "Sampling & Household Listing",
      "Field Inspection & Non-sampling Error Control",
      "Basic Statistics & Excel"
    ],
    detectedGaps: [
      "R Survey Package Analysis (Critical)",
      "National Accounts & SNA 2008 (Moderate)",
      "AI & Automation in Official Stats (Critical)",
      "Cybersecurity Protocols (Moderate)"
    ]
  }
];

export const MOCK_ADMIN_STATS = {
  totalOfficers: 4280,
  averageCompetencyIndex: 68.4,
  criticalGapsActive: 642,
  completedIgotCertificates: 3120,
  divisionReadiness: [
    { division: "NAD", name: "National Accounts", score: 76, officers: 620, criticalGaps: 48 },
    { division: "FOD", name: "Field Operations", score: 63, officers: 1840, criticalGaps: 310 },
    { division: "SDRD", name: "Survey Design", score: 81, officers: 410, criticalGaps: 22 },
    { division: "PSD", name: "Price Statistics", score: 74, officers: 390, criticalGaps: 35 },
    { division: "ESD", name: "Economic Statistics", score: 69, officers: 480, criticalGaps: 68 },
    { division: "DIID", name: "Data Informatics", score: 84, officers: 280, criticalGaps: 14 },
    { division: "SSD", name: "Social Statistics", score: 71, officers: 260, criticalGaps: 32 }
  ],
  topDeficientSkills: [
    { skill: "Python for Big Data in Surveys", affectedOfficers: 1420, urgency: "Critical" },
    { skill: "AI/ML & NLP Text Classification", affectedOfficers: 1280, urgency: "Critical" },
    { skill: "DPDP Act 2023 Microdata Privacy", affectedOfficers: 980, urgency: "Moderate" },
    { skill: "Double Deflation in National Accounts", affectedOfficers: 740, urgency: "Moderate" },
    { skill: "QGIS Cadastral Spatial Mapping", affectedOfficers: 690, urgency: "Moderate" }
  ]
};
