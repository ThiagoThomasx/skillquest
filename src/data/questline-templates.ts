import type { QuestlineDifficulty, BossBattleStatus, ModuleStatus, QuestlineStatus } from "@/stores/questlines-store";
import type { Questline } from "@/stores/questlines-store";
import type { StoredMission } from "@/stores/missions-store";

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

interface MissionTemplate {
  title: string;
  description: string;
  category: StoredMission["category"];
  xpReward: number;
  estimatedMinutes: number;
  difficulty: StoredMission["difficulty"];
  objectives: string[];
  rewards: string[];
}

interface ModuleTemplate {
  title: string;
  description: string;
  order: number;
  xpReward: number;
  missions: MissionTemplate[];
}

export interface QuestlineTemplate {
  templateId: string;
  title: string;
  description: string;
  category: string;
  className: string;
  difficulty: QuestlineDifficulty;
  estimatedHours: number;
  tags: string[];
  modules: ModuleTemplate[];
  bossTitle: string;
  bossDescription: string;
  bossXP: number;
}

export const QUESTLINE_TEMPLATES: QuestlineTemplate[] = [
  {
    templateId: "tpl-frontend",
    title: "Frontend Developer",
    description: "Do HTML ao React avançado. A jornada completa para se tornar um desenvolvedor frontend profissional.",
    category: "Frontend",
    className: "Frontend Mage",
    difficulty: "intermediate",
    estimatedHours: 40,
    tags: ["HTML", "CSS", "JavaScript", "React"],
    modules: [
      {
        title: "HTML e CSS Avançado",
        description: "Semântica, acessibilidade e layouts complexos.",
        order: 1,
        xpReward: 50,
        missions: [
          { title: "HTML Semântico e Acessibilidade", description: "Tags semânticas, ARIA roles e boas práticas de acessibilidade web.", category: "Main Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Usar tags semânticas (header, main, article)", "Adicionar atributos ARIA", "Testar com leitor de tela"], rewards: ["100 XP"] },
          { title: "CSS Flexbox e Grid", description: "Domine os dois principais sistemas de layout do CSS moderno.", category: "Main Quest", xpReward: 125, estimatedMinutes: 45, difficulty: "medium", objectives: ["Criar layout com Flexbox", "Implementar Grid de 3 colunas", "Responsividade sem media queries desnecessárias"], rewards: ["125 XP"] },
          { title: "Animações e Transições CSS", description: "Crie interfaces fluidas com animações puras em CSS.", category: "Side Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Criar animação com @keyframes", "Usar transitions em hover states", "Implementar loading spinner"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "JavaScript Moderno",
        description: "ES6+, async/await, e programação funcional.",
        order: 2,
        xpReward: 75,
        missions: [
          { title: "ES6+ Fundamentos", description: "Desestruturação, spread, arrow functions e template literals.", category: "Main Quest", xpReward: 125, estimatedMinutes: 40, difficulty: "medium", objectives: ["Usar desestruturação de objetos e arrays", "Aplicar spread e rest operators", "Reescrever funções com arrow functions"], rewards: ["125 XP"] },
          { title: "Promises e Async/Await", description: "Programação assíncrona moderna com tratamento de erros.", category: "Main Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "medium", objectives: ["Criar e encadear Promises", "Converter para async/await", "Tratar erros com try/catch"], rewards: ["150 XP"] },
          { title: "Módulos e Bundlers", description: "ES Modules, import/export e configuração de Vite.", category: "Side Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Organizar código em módulos", "Configurar Vite do zero", "Tree shaking e code splitting"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "React Fundamentos",
        description: "Componentes, estado, props e ciclo de vida.",
        order: 3,
        xpReward: 75,
        missions: [
          { title: "Componentes e Props", description: "Criação de componentes reutilizáveis e comunicação via props.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "easy", objectives: ["Criar componente funcional", "Passar e tipar props", "Compor componentes"], rewards: ["125 XP"] },
          { title: "Estado e Eventos", description: "useState, handlers de eventos e formulários controlados.", category: "Main Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Gerenciar estado com useState", "Criar formulário controlado", "Implementar validação básica"], rewards: ["150 XP"] },
          { title: "Listas e Renderização Condicional", description: "Map, filter e renderização condicional em JSX.", category: "Side Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Renderizar listas com .map()", "Aplicar keys corretamente", "Condicionar exibição com ternário"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Projeto Final Frontend",
        description: "Construção de um portfólio completo com React.",
        order: 4,
        xpReward: 100,
        missions: [
          { title: "Portfólio com React", description: "Projeto completo: portfólio pessoal com dark mode e animações.", category: "Main Quest", xpReward: 250, estimatedMinutes: 90, difficulty: "hard", objectives: ["Criar layout responsivo", "Implementar dark mode", "Adicionar animações com CSS/Framer"], rewards: ["250 XP"] },
          { title: "Deploy e Performance", description: "Publicar o portfólio e otimizar performance com Lighthouse.", category: "Main Quest", xpReward: 200, estimatedMinutes: 60, difficulty: "hard", objectives: ["Deploy na Vercel", "Score Lighthouse > 90", "Otimizar imagens e fontes"], rewards: ["200 XP"] },
        ],
      },
    ],
    bossTitle: "Senior Frontend Challenge",
    bossDescription: "Desenvolva uma aplicação completa com React, integrando uma API pública, com estado global, roteamento e deploy. Prove que você é um Senior Frontend Developer.",
    bossXP: 500,
  },
  {
    templateId: "tpl-cybersec",
    title: "Cyber Security Foundations",
    description: "Da teoria à prática em segurança digital. Aprenda a proteger sistemas e a pensar como um hacker ético.",
    category: "Segurança",
    className: "Cyber Guardian",
    difficulty: "advanced",
    estimatedHours: 35,
    tags: ["Segurança", "Redes", "Ethical Hacking", "OWASP"],
    modules: [
      {
        title: "Redes e Protocolos",
        description: "TCP/IP, DNS, HTTP/HTTPS e análise de tráfego.",
        order: 1,
        xpReward: 60,
        missions: [
          { title: "Fundamentos de Redes TCP/IP", description: "Modelo OSI, endereçamento IP e protocolos essenciais.", category: "Main Quest", xpReward: 125, estimatedMinutes: 45, difficulty: "medium", objectives: ["Entender camadas OSI", "Configurar IP estático", "Analisar pacotes com Wireshark"], rewards: ["125 XP"] },
          { title: "HTTP e HTTPS na Prática", description: "Como funciona a web: headers, cookies, TLS e certificados.", category: "Main Quest", xpReward: 125, estimatedMinutes: 40, difficulty: "medium", objectives: ["Inspecionar headers HTTP", "Entender TLS handshake", "Analisar certificados SSL"], rewards: ["125 XP"] },
          { title: "DNS e Enumeração", description: "Funcionamento do DNS e técnicas de enumeração de subdomínios.", category: "Side Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "medium", objectives: ["Consultas DNS com dig/nslookup", "Enumeração de subdomínios", "DNS zone transfer"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Segurança Web — OWASP Top 10",
        description: "As 10 vulnerabilidades mais críticas da web.",
        order: 2,
        xpReward: 75,
        missions: [
          { title: "SQL Injection", description: "Detectar, explorar e mitigar SQL Injection em aplicações.", category: "Main Quest", xpReward: 175, estimatedMinutes: 50, difficulty: "hard", objectives: ["Identificar ponto vulnerável", "Executar SQL injection básico", "Implementar prepared statements"], rewards: ["175 XP"] },
          { title: "XSS e CSRF", description: "Cross-Site Scripting e Cross-Site Request Forgery.", category: "Main Quest", xpReward: 175, estimatedMinutes: 50, difficulty: "hard", objectives: ["Explorar XSS refletido", "Criar payload de CSRF", "Implementar proteções"], rewards: ["175 XP"] },
          { title: "Autenticação Insegura", description: "Quebra de autenticação: senhas fracas, JWT inseguro e sessions.", category: "Side Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "hard", objectives: ["Testar força bruta", "Analisar JWT malformado", "Implementar MFA"], rewards: ["150 XP"] },
        ],
      },
      {
        title: "Ethical Hacking",
        description: "Metodologia de pentest e ferramentas ofensivas.",
        order: 3,
        xpReward: 80,
        missions: [
          { title: "Reconhecimento (OSINT)", description: "Coleta de informações passiva usando fontes abertas.", category: "Main Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Perfil OSINT de um alvo fictício", "Usar Shodan e Censys", "Google dorks avançados"], rewards: ["150 XP"] },
          { title: "Scanning e Enumeração com Nmap", description: "Mapeamento de rede, detecção de serviços e OS fingerprinting.", category: "Main Quest", xpReward: 175, estimatedMinutes: 45, difficulty: "hard", objectives: ["Full port scan", "Service version detection", "NSE scripts básicos"], rewards: ["175 XP"] },
          { title: "Exploração com Metasploit", description: "Framework de exploração: módulos, payloads e pós-exploração.", category: "Main Quest", xpReward: 200, estimatedMinutes: 60, difficulty: "hard", objectives: ["Configurar módulo de exploit", "Gerar payload Meterpreter", "Pós-exploração: coleta de informações"], rewards: ["200 XP"] },
        ],
      },
      {
        title: "Defesa e Resposta a Incidentes",
        description: "Blue team: monitoramento, SIEM e resposta a ataques.",
        order: 4,
        xpReward: 80,
        missions: [
          { title: "Logs e Monitoramento", description: "Análise de logs de sistema e detecção de anomalias.", category: "Main Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Analisar logs de acesso", "Criar alertas baseados em padrões", "Correlacionar eventos"], rewards: ["150 XP"] },
          { title: "Hardening de Sistemas", description: "Configuração segura de servidores Linux e Windows.", category: "Side Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "medium", objectives: ["Desabilitar serviços desnecessários", "Configurar firewall", "Aplicar princípio do menor privilégio"], rewards: ["125 XP"] },
        ],
      },
    ],
    bossTitle: "CTF: Missão Final",
    bossDescription: "Complete um desafio CTF (Capture The Flag) com 5 flags escondidas em diferentes categorias: web, crypto, forensics, pwn e OSINT. Prove suas habilidades de hacking ético.",
    bossXP: 600,
  },
  {
    templateId: "tpl-python",
    title: "Python Automation",
    description: "Automatize tarefas repetitivas, faça web scraping e integre APIs com Python. Sua caixa de ferramentas de produtividade.",
    category: "Programação",
    className: "Script Wizard",
    difficulty: "beginner",
    estimatedHours: 25,
    tags: ["Python", "Automação", "Web Scraping", "APIs"],
    modules: [
      {
        title: "Python Básico",
        description: "Sintaxe, estruturas de dados e funções.",
        order: 1,
        xpReward: 50,
        missions: [
          { title: "Sintaxe e Tipos de Dados", description: "Variáveis, tipos, operadores e estruturas de controle.", category: "Main Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Escrever primeiro script Python", "Usar listas, dicionários e tuplas", "Controle de fluxo com if/for/while"], rewards: ["100 XP"] },
          { title: "Funções e Módulos", description: "Criação de funções, lambdas, decorators e import de módulos.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "easy", objectives: ["Criar funções com args e kwargs", "Usar list comprehensions", "Importar módulos da stdlib"], rewards: ["125 XP"] },
          { title: "Tratamento de Erros", description: "try/except, logging e debug de scripts Python.", category: "Side Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Capturar exceções específicas", "Configurar logging básico", "Depurar com pdb"], rewards: ["100 XP"] },
          { title: "Classes e OOP", description: "Programação orientada a objetos com Python.", category: "Main Quest", xpReward: 125, estimatedMinutes: 40, difficulty: "medium", objectives: ["Criar classe com métodos", "Herança e polimorfismo", "Dunder methods (__str__, __repr__)"], rewards: ["125 XP"] },
        ],
      },
      {
        title: "Arquivos e Sistema",
        description: "Manipulação de arquivos, OS e processos.",
        order: 2,
        xpReward: 60,
        missions: [
          { title: "Leitura e Escrita de Arquivos", description: "Ler CSV, JSON e TXT. Processar dados de arquivos reais.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "easy", objectives: ["Ler e escrever CSV com csv module", "Processar JSON", "Usar context managers (with)"], rewards: ["125 XP"] },
          { title: "Automação de Sistema com OS e Shutil", description: "Navegar diretórios, copiar arquivos e executar comandos.", category: "Main Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Renomear arquivos em lote", "Copiar/mover estruturas de pastas", "Executar comandos do sistema"], rewards: ["150 XP"] },
          { title: "Agendamento de Tarefas", description: "Agendar scripts com schedule e crontab.", category: "Side Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Configurar schedule.py", "Criar cron job básico", "Executar script diariamente"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Web Scraping",
        description: "Extrair dados da web com BeautifulSoup e Selenium.",
        order: 3,
        xpReward: 75,
        missions: [
          { title: "Requests e HTML Parsing", description: "Fazer requisições HTTP e parsear HTML com BeautifulSoup.", category: "Main Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "medium", objectives: ["Fazer GET/POST com requests", "Parsear HTML com BeautifulSoup", "Extrair dados de tabelas"], rewards: ["150 XP"] },
          { title: "Scraping com Selenium", description: "Automatizar navegador para sites com JavaScript dinâmico.", category: "Main Quest", xpReward: 175, estimatedMinutes: 55, difficulty: "hard", objectives: ["Configurar Selenium WebDriver", "Interagir com elementos dinâmicos", "Fazer screenshots automatizados"], rewards: ["175 XP"] },
          { title: "Salvar e Exportar Dados", description: "Exportar dados scrapeados para CSV, Excel e banco de dados.", category: "Side Quest", xpReward: 125, estimatedMinutes: 30, difficulty: "medium", objectives: ["Exportar para CSV e Excel", "Inserir em SQLite", "Remover duplicatas"], rewards: ["125 XP"] },
        ],
      },
      {
        title: "APIs e Integrações",
        description: "Consumir e criar APIs com Python.",
        order: 4,
        xpReward: 75,
        missions: [
          { title: "Consumir APIs REST", description: "Autenticação, paginação e tratamento de respostas JSON.", category: "Main Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Autenticar com API key e Bearer token", "Paginar resultados", "Tratar erros de API"], rewards: ["150 XP"] },
          { title: "Criar API com FastAPI", description: "Desenvolver uma API REST simples com FastAPI e Pydantic.", category: "Main Quest", xpReward: 200, estimatedMinutes: 60, difficulty: "hard", objectives: ["Criar endpoints CRUD", "Validar dados com Pydantic", "Documentação automática com Swagger"], rewards: ["200 XP"] },
        ],
      },
    ],
    bossTitle: "Projeto de Automação",
    bossDescription: "Crie um bot de automação completo que: faz scraping de dados de uma fonte web, processa e transforma os dados, envia um relatório por e-mail ou Telegram, e roda automaticamente todos os dias.",
    bossXP: 400,
  },
  {
    templateId: "tpl-cloud",
    title: "Cloud Fundamentals",
    description: "Domine os conceitos essenciais de computação em nuvem, AWS, containerização e infraestrutura como código.",
    category: "Cloud & DevOps",
    className: "Cloud Architect",
    difficulty: "intermediate",
    estimatedHours: 30,
    tags: ["AWS", "Docker", "Terraform", "CI/CD"],
    modules: [
      {
        title: "Conceitos Cloud",
        description: "Modelos de serviço, regiões e princípios de alta disponibilidade.",
        order: 1,
        xpReward: 50,
        missions: [
          { title: "IaaS, PaaS e SaaS", description: "Diferenças entre modelos de serviço e quando usar cada um.", category: "Main Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Identificar os 3 modelos", "Mapear serviços AWS para modelos", "Escolher modelo para um projeto real"], rewards: ["100 XP"] },
          { title: "Regiões, AZs e Edge Locations", description: "Arquitetura global da AWS e impacto na disponibilidade.", category: "Main Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Entender regiões e AZs", "Calcular SLA com múltiplas AZs", "Configurar recurso multi-region"], rewards: ["100 XP"] },
          { title: "IAM — Identity and Access Management", description: "Usuários, grupos, roles e políticas de permissão na AWS.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "medium", objectives: ["Criar usuário IAM com least privilege", "Configurar MFA", "Criar role para EC2"], rewards: ["125 XP"] },
        ],
      },
      {
        title: "Storage e Banco de Dados",
        description: "S3, RDS, DynamoDB e estratégias de backup.",
        order: 2,
        xpReward: 65,
        missions: [
          { title: "Amazon S3", description: "Buckets, políticas, versionamento e hosting de site estático.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "easy", objectives: ["Criar bucket com configurações corretas", "Hospedar site estático", "Configurar lifecycle rules"], rewards: ["125 XP"] },
          { title: "RDS e DynamoDB", description: "Bancos relacionais e NoSQL na AWS.", category: "Main Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "medium", objectives: ["Provisionar RDS PostgreSQL", "Criar tabela DynamoDB", "Comparar casos de uso"], rewards: ["150 XP"] },
          { title: "Estratégias de Backup", description: "Snapshots, AWS Backup e planos de disaster recovery.", category: "Side Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "medium", objectives: ["Configurar snapshots automáticos", "Testar restore de backup", "Calcular RPO e RTO"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Compute e Containers",
        description: "EC2, Lambda, Docker e ECS.",
        order: 3,
        xpReward: 75,
        missions: [
          { title: "EC2 e Auto Scaling", description: "Instâncias EC2, grupos de auto scaling e load balancer.", category: "Main Quest", xpReward: 150, estimatedMinutes: 50, difficulty: "medium", objectives: ["Lançar instância EC2", "Configurar Auto Scaling Group", "Configurar Application Load Balancer"], rewards: ["150 XP"] },
          { title: "Docker na Prática", description: "Containers, Dockerfile, docker-compose e registro de imagens.", category: "Main Quest", xpReward: 175, estimatedMinutes: 55, difficulty: "hard", objectives: ["Criar Dockerfile otimizado", "Configurar docker-compose multi-serviço", "Publicar imagem no ECR"], rewards: ["175 XP"] },
          { title: "AWS Lambda e Serverless", description: "Funções serverless, triggers e integração com outros serviços.", category: "Main Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "medium", objectives: ["Criar função Lambda", "Configurar trigger S3 ou API Gateway", "Monitorar com CloudWatch"], rewards: ["150 XP"] },
        ],
      },
      {
        title: "Infraestrutura como Código",
        description: "Terraform, CloudFormation e CI/CD na nuvem.",
        order: 4,
        xpReward: 80,
        missions: [
          { title: "Terraform Fundamentos", description: "Providers, recursos, variáveis e remote state.", category: "Main Quest", xpReward: 175, estimatedMinutes: 55, difficulty: "hard", objectives: ["Configurar provider AWS", "Criar VPC e subnets com Terraform", "Usar remote state no S3"], rewards: ["175 XP"] },
          { title: "CI/CD com GitHub Actions e AWS", description: "Pipeline de deploy automático para AWS.", category: "Main Quest", xpReward: 200, estimatedMinutes: 60, difficulty: "hard", objectives: ["Criar workflow GitHub Actions", "Deploy automático para S3/EC2", "Rollback em caso de falha"], rewards: ["200 XP"] },
        ],
      },
    ],
    bossTitle: "Deploy Multi-Cloud",
    bossDescription: "Implante uma aplicação completa usando Terraform para provisionar a infraestrutura, Docker para containerizar, e um pipeline CI/CD completo com GitHub Actions. Infraestrutura como código do início ao fim.",
    bossXP: 550,
  },
  {
    templateId: "tpl-data",
    title: "Data Analytics",
    description: "Transforme dados brutos em insights acionáveis. De SQL a visualizações que contam histórias poderosas.",
    category: "Dados",
    className: "Data Sage",
    difficulty: "intermediate",
    estimatedHours: 28,
    tags: ["SQL", "Python", "Pandas", "Visualização"],
    modules: [
      {
        title: "Fundamentos de Dados",
        description: "Estatística, tipos de análise e ferramentas essenciais.",
        order: 1,
        xpReward: 50,
        missions: [
          { title: "Estatística para Analistas", description: "Média, mediana, desvio padrão, distribuições e correlações.", category: "Main Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Calcular métricas estatísticas básicas", "Identificar outliers", "Interpretar correlação de Pearson"], rewards: ["100 XP"] },
          { title: "Tipos de Análise de Dados", description: "Descritiva, diagnóstica, preditiva e prescritiva.", category: "Main Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Diferenciar tipos de análise", "Escolher abordagem para um problema", "Comunicar resultados claramente"], rewards: ["100 XP"] },
          { title: "Excel e Google Sheets Avançado", description: "Pivot tables, VLOOKUP/INDEX-MATCH e Power Query.", category: "Side Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "medium", objectives: ["Criar tabela dinâmica", "Usar ÍNDICE+CORRESP", "Automatizar com macros básicas"], rewards: ["125 XP"] },
        ],
      },
      {
        title: "SQL para Análise",
        description: "Consultas complexas, JOINs, window functions e otimização.",
        order: 2,
        xpReward: 65,
        missions: [
          { title: "SQL Fundamentos", description: "SELECT, WHERE, GROUP BY, HAVING e JOINs.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "easy", objectives: ["Escrever queries com JOINs complexos", "Usar agregações e GROUP BY", "Filtrar com HAVING"], rewards: ["125 XP"] },
          { title: "Window Functions", description: "ROW_NUMBER, RANK, LAG, LEAD e PARTITION BY.", category: "Main Quest", xpReward: 175, estimatedMinutes: 50, difficulty: "hard", objectives: ["Usar ROW_NUMBER e RANK", "Calcular médias móveis com LAG/LEAD", "Criar relatórios com CTEs"], rewards: ["175 XP"] },
          { title: "Modelagem de Dados", description: "Normalização, star schema e data warehouse básico.", category: "Main Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "hard", objectives: ["Desenhar modelo dimensional", "Criar fact e dimension tables", "Otimizar queries com índices"], rewards: ["150 XP"] },
        ],
      },
      {
        title: "Python para Dados",
        description: "Pandas, NumPy e processamento de grandes volumes.",
        order: 3,
        xpReward: 75,
        missions: [
          { title: "Pandas Fundamentos", description: "DataFrames, Series, leitura de dados e manipulação básica.", category: "Main Quest", xpReward: 150, estimatedMinutes: 45, difficulty: "medium", objectives: ["Carregar CSV e Excel com Pandas", "Filtrar e agrupar dados", "Tratar valores nulos"], rewards: ["150 XP"] },
          { title: "Limpeza e Transformação de Dados", description: "Técnicas de data wrangling para dados do mundo real.", category: "Main Quest", xpReward: 175, estimatedMinutes: 55, difficulty: "hard", objectives: ["Detectar e tratar outliers", "Normalizar e encodar colunas categóricas", "Merge e concat de DataFrames"], rewards: ["175 XP"] },
          { title: "Análise Exploratória (EDA)", description: "Profiling de dados e descoberta de padrões.", category: "Side Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Criar profile report com ydata-profiling", "Identificar correlações entre variáveis", "Documentar insights encontrados"], rewards: ["150 XP"] },
        ],
      },
      {
        title: "Visualização de Dados",
        description: "Matplotlib, Seaborn, Plotly e storytelling com dados.",
        order: 4,
        xpReward: 80,
        missions: [
          { title: "Matplotlib e Seaborn", description: "Gráficos estáticos de alta qualidade para relatórios.", category: "Main Quest", xpReward: 150, estimatedMinutes: 40, difficulty: "medium", objectives: ["Criar heatmap de correlações", "Boxplots e violin plots", "Exportar em alta resolução"], rewards: ["150 XP"] },
          { title: "Dashboards Interativos com Plotly", description: "Gráficos interativos e dashboards com Plotly e Dash.", category: "Main Quest", xpReward: 200, estimatedMinutes: 60, difficulty: "hard", objectives: ["Criar gráfico interativo com Plotly", "Construir dashboard com Dash", "Adicionar filtros e callbacks"], rewards: ["200 XP"] },
        ],
      },
    ],
    bossTitle: "Dashboard Analytics Final",
    bossDescription: "Construa um dashboard analítico completo: conecte a um dataset real, faça ETL com Pandas, crie visualizações interativas com Plotly/Dash e publique online. Conte uma história com dados.",
    bossXP: 450,
  },
  {
    templateId: "tpl-recruiting",
    title: "Tech Recruiting",
    description: "Domine o processo seletivo de tecnologia: sourcing, avaliação técnica, entrevistas e employer branding para contratar os melhores talentos.",
    category: "RH & Recrutamento",
    className: "Talent Hunter",
    difficulty: "beginner",
    estimatedHours: 18,
    tags: ["Recrutamento", "Entrevistas", "Employer Branding", "Data"],
    modules: [
      {
        title: "Sourcing Estratégico",
        description: "Encontrar talentos passivos e construir pipeline de candidatos.",
        order: 1,
        xpReward: 45,
        missions: [
          { title: "LinkedIn Recruiting Avançado", description: "Boolean search, InMail de alta taxa de resposta e ATS integração.", category: "Main Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Criar boolean string eficiente", "Personalizar InMail com taxa >30%", "Configurar pipeline no LinkedIn Recruiter"], rewards: ["100 XP"] },
          { title: "GitHub e Comunidades Tech", description: "Encontrar desenvolvedores ativos em projetos open source.", category: "Main Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Pesquisar contributors por tecnologia", "Engajar em comunidades Discord/Slack", "Identificar perfis de alta atividade"], rewards: ["100 XP"] },
          { title: "Métricas de Sourcing", description: "KPIs de recrutamento: time-to-fill, cost-per-hire, funil de conversão.", category: "Side Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Definir KPIs do processo", "Criar dashboard de sourcing", "Analisar taxa de conversão por fonte"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Triagem e Avaliação",
        description: "Avaliar candidatos com eficiência e sem viés.",
        order: 2,
        xpReward: 55,
        missions: [
          { title: "Triagem de CVs Técnicos", description: "Como ler um CV de desenvolvedor: projetos, stack, GitHub.", category: "Main Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Identificar red flags em CVs", "Avaliar projetos no GitHub", "Criar scorecard de triagem"], rewards: ["100 XP"] },
          { title: "Testes Técnicos e Take-homes", description: "Boas práticas para desafios técnicos que não afastam candidatos.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "medium", objectives: ["Criar desafio de 2h ou menos", "Definir critérios de avaliação", "Dar feedback construtivo"], rewards: ["125 XP"] },
          { title: "Reduzindo Viés no Processo", description: "Técnicas de structured interviewing e blind review.", category: "Side Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "medium", objectives: ["Implementar blind CV review", "Criar rubrica de avaliação consistente", "Treinar entrevistadores"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Entrevistas Técnicas",
        description: "Conduzir entrevistas comportamentais e técnicas com excelência.",
        order: 3,
        xpReward: 60,
        missions: [
          { title: "Entrevista STAR Comportamental", description: "Método STAR para avaliar soft skills e comportamento.", category: "Main Quest", xpReward: 100, estimatedMinutes: 30, difficulty: "easy", objectives: ["Formular perguntas STAR", "Conduzir entrevista de 45 min", "Documentar respostas sistematicamente"], rewards: ["100 XP"] },
          { title: "Entrevista Técnica como Parceiro", description: "Como ser um facilitador, não um interrogador, na entrevista técnica.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "medium", objectives: ["Criar ambiente acolhedor", "Dar dicas sem entregar respostas", "Avaliar processo de raciocínio"], rewards: ["125 XP"] },
          { title: "Feedback e Decisão de Hire", description: "Debrief estruturado e tomada de decisão colaborativa.", category: "Main Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Facilitar debrief em 30 min", "Usar votação estruturada (hire/no hire)", "Documentar decisão com evidências"], rewards: ["100 XP"] },
        ],
      },
      {
        title: "Employer Branding e Oferta",
        description: "Criar a proposta de valor para candidatos e fechar as melhores contratações.",
        order: 4,
        xpReward: 65,
        missions: [
          { title: "EVP — Employee Value Proposition", description: "Construir e comunicar os diferenciais da empresa para talentos tech.", category: "Main Quest", xpReward: 125, estimatedMinutes: 35, difficulty: "medium", objectives: ["Mapear benefícios e cultura tech", "Criar página de carreiras atraente", "Coletar testimonials de devs"], rewards: ["125 XP"] },
          { title: "Negociação e Oferta", description: "Como fazer uma oferta irrecusável e lidar com counteroffer.", category: "Main Quest", xpReward: 125, estimatedMinutes: 30, difficulty: "medium", objectives: ["Estruturar pacote de compensação", "Conduzir call de oferta", "Lidar com counteroffer estrategicamente"], rewards: ["125 XP"] },
          { title: "Onboarding para Retenção", description: "Primeiros 90 dias: como fazer o novo dev querer ficar para sempre.", category: "Side Quest", xpReward: 100, estimatedMinutes: 25, difficulty: "easy", objectives: ["Criar plano de onboarding 30/60/90 dias", "Definir checkpoints de acompanhamento", "Medir NPS dos novos hires"], rewards: ["100 XP"] },
        ],
      },
    ],
    bossTitle: "Full Cycle Hire",
    bossDescription: "Conduza um processo seletivo completo do zero ao hire: escreva a vaga, faça sourcing de 20+ candidatos, conduza 5 entrevistas técnicas, tome a decisão e faça a oferta. Mostre que você domina o ciclo completo.",
    bossXP: 350,
  },
];

// ── Template Instantiation ────────────────────────────────────────────────────

export interface InstantiateResult {
  questline: Questline;
  missions: Omit<StoredMission, never>[];
}

export function instantiateTemplate(template: QuestlineTemplate): InstantiateResult {
  const questlineId = "ql-" + uid();
  const now = new Date().toISOString();

  const missions: StoredMission[] = [];
  const modules = template.modules.map((modTpl, modIdx) => {
    const moduleId = "mod-" + uid();
    const missionIds: string[] = [];

    modTpl.missions.forEach((mTpl, mIdx) => {
      const missionId = `${questlineId}-m${modIdx}-${mIdx}-${uid().slice(0, 4)}`;
      missionIds.push(missionId);
      missions.push({
        id: missionId,
        title: mTpl.title,
        description: mTpl.description,
        pathId: questlineId,
        pathTitle: template.title,
        category: mTpl.category,
        xpReward: mTpl.xpReward,
        estimatedMinutes: mTpl.estimatedMinutes,
        difficulty: mTpl.difficulty,
        status: "available",
        progress: 0,
        objectives: mTpl.objectives,
        rewards: mTpl.rewards,
        isMainQuest: mTpl.category === "Main Quest",
        isDaily: mTpl.category === "Daily",
        isBoss: mTpl.category === "Boss Quest",
        createdAt: now,
        completedAt: null,
      });
    });

    return {
      id: moduleId,
      questlineId,
      title: modTpl.title,
      description: modTpl.description,
      order: modTpl.order,
      status: "available" as ModuleStatus,
      xpReward: modTpl.xpReward,
      missionIds,
    };
  });

  const questline: Questline = {
    id: questlineId,
    title: template.title,
    description: template.description,
    category: template.category,
    className: template.className,
    difficulty: template.difficulty,
    status: "active" as QuestlineStatus,
    estimatedHours: template.estimatedHours,
    modules,
    bossBattle: {
      id: "boss-" + uid(),
      title: template.bossTitle,
      description: template.bossDescription,
      xpReward: template.bossXP,
      status: "locked" as BossBattleStatus,
      requirements: ["Completar todos os módulos", "Completar todas as missões"],
      completedAt: null,
    },
    createdAt: now,
    updatedAt: now,
  };

  return { questline, missions };
}
