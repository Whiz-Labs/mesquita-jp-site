// Todo o conteúdo variável do site vive aqui. As páginas só leem daqui —
// assim dá pra corrigir nome, endereço, horários, agenda e documentos sem
// mexer no layout.
//
// Os valores marcados com TODO são placeholders e precisam ser confirmados
// com a administração do centro antes de publicar.

export const site = {
  /** Nome curto, usado no menu, no rodapé e no <title>. */
  name: 'Centro Islâmico de João Pessoa',
  /** Nome completo/oficial, usado no hero e em textos formais. */
  fullName: 'Centro Islâmico de João Pessoa',
  /** Nome em árabe (aparece no hero, em fonte Amiri). */
  nameAr: 'المركز الإسلامي في جواو بيسوا',
  tagline: 'Uma casa de oração e de acolhimento para a comunidade muçulmana da Paraíba.',
  description:
    'Mesquita e centro islâmico em João Pessoa (PB): horários de oração, jumu\'ah, agenda de aulas e eventos, documentos da comunidade, apoio a novos muçulmanos e endereço.',
  locale: 'pt-BR',
} as const;

export const contact = {
  /**
   * Endereço como consta na ficha do Google da mesquita (a mesma de onde veio
   * o `mapsEmbed` abaixo).
   * TODO: pedir à administração que confirme rua, número, bairro e CEP.
   *
   * Se precisar tirar do ar, deixe `street` vazio: o site passa a mostrar só a
   * cidade e o mapa, em vez de publicar um endereço pela metade.
   */
  address: {
    street: 'Av. Santa Catarina, 191',
    district: 'Estados',
    city: 'João Pessoa',
    state: 'PB',
    zip: '58030-070',
  },
  /**
   * TODO: confirmar telefone/WhatsApp.
   * Vazios de propósito: enquanto o número real não chegar, todos os botões
   * de contato vão para o Instagram (veja `canalPrincipal` abaixo). Um número
   * de exemplo publicado é pior do que nenhum.
   */
  phone: '',
  whatsapp: '',
  /** Grupo de avisos no WhatsApp. Vazio = o botão não aparece. */
  whatsappGroup: '',
  email: '',
  /** Confirmado — é por aqui que a comunidade fala com o centro. */
  instagram: 'https://instagram.com/centro.islamico.jp',
  instagramHandle: '@centro.islamico.jp',
  youtube: '',
  /** Ficha da mesquita no Google Maps (link "como chegar"). */
  mapsLink: 'https://maps.google.com/?cid=4583295204543350686',
  /**
   * URL do iframe do Google Maps (Maps → Compartilhar → Incorporar um mapa →
   * copiar só o src). Vazio = a seção mostra um aviso no lugar do mapa.
   */
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1664.5828466808093!2d-34.861155356316296!3d-7.118173123103195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7acdd5613295add%3A0x3f9b22b4878ec79e!2sMesquita%20e%20Centro%20Isl%C3%A2mico%20de%20Jo%C3%A3o%20Pessoa!5e0!3m2!1sen!2sbr!4v1786837263536!5m2!1sen!2sbr',
} as const;

/**
 * Canal principal de contato, usado por todos os botões "fale com a gente".
 *
 * Enquanto `contact.whatsapp` estiver vazio, o site manda as pessoas para o
 * Instagram — que é onde a comunidade de fato responde. Assim que o número da
 * mesquita for confirmado, basta preencher `whatsapp` acima: todos os botões
 * do site passam a apontar para lá sozinhos.
 */
export const canalPrincipal = contact.whatsapp
  ? { href: contact.whatsapp, nome: 'WhatsApp', acao: 'Falar no WhatsApp', icon: 'phone' }
  : {
      href: contact.instagram,
      nome: 'Instagram',
      acao: 'Chamar no Instagram',
      icon: 'instagram',
    };

/**
 * Aviso no topo do site — Ramadan, mudança de horário, mutirão, obra.
 * Deixe `active: false` para esconder a faixa inteira.
 */
export const announcement = {
  active: false,
  text: 'Nova programação de aulas a partir deste mês — confira a agenda.',
  linkLabel: 'Ver agenda',
  linkHref: '/#agenda',
} as const;

/**
 * Coordenadas usadas para calcular os horários de oração (API Aladhan).
 * Ajustar para o endereço exato da mesquita depois — a diferença dentro de
 * João Pessoa é de segundos, mas o cálculo fica correto para a qibla também.
 */
export const location = {
  city: 'João Pessoa',
  country: 'Brazil',
  /** Coordenadas da própria mesquita, tiradas da ficha do Google. */
  latitude: -7.118173,
  longitude: -34.861155,
  timezone: 'America/Fortaleza',
  /**
   * Método de cálculo da Aladhan API.
   * 3 = Muslim World League (padrão comum no Brasil).
   * 2 = ISNA, 4 = Umm al-Qura, 5 = Egyptian.
   */
  calculationMethod: 3,
  /**
   * Direção da qibla a partir da mesquita, em graus a partir do norte.
   * Calculada pela Aladhan (`/v1/qibla/-7.118173/-34.861155` → 66,37°) para as
   * coordenadas acima; refazer o cálculo se as coordenadas mudarem.
   */
  qiblaDegrees: 66,
} as const;

/** Nomes das cinco orações, na ordem, com a chave devolvida pela Aladhan API. */
export const prayers = [
  { key: 'Fajr', pt: 'Fajr', ar: 'الفجر', note: 'Alvorada' },
  { key: 'Dhuhr', pt: 'Dhuhr', ar: 'الظهر', note: 'Meio-dia' },
  { key: 'Asr', pt: 'Asr', ar: 'العصر', note: 'Tarde' },
  { key: 'Maghrib', pt: 'Maghrib', ar: 'المغرب', note: 'Pôr do sol' },
  { key: 'Isha', pt: 'Isha', ar: 'العشاء', note: 'Noite' },
] as const;

/**
 * Iqamah (horário em que a oração em congregação começa na mesquita).
 * Não é calculado: é uma decisão da mesquita. Deixe null enquanto não houver
 * horário fixo — o site então mostra só o horário astronômico (adhan).
 */
export const iqamah: Record<string, string | null> = {
  Fajr: null,
  Dhuhr: null,
  Asr: null,
  Maghrib: null,
  Isha: null,
};

/**
 * Quando a mesquita abre — o dado mais importante do site.
 *
 * A mesquita NÃO fica aberta nas cinco orações: só nesta janela, sexta e
 * sábado. Os horários de oração mostrados no site são o cálculo para a cidade
 * de João Pessoa, não um horário de funcionamento — não escreva em lugar
 * nenhum que a mesquita está aberta no Fajr, no Asr etc.
 */
export const openingHours = {
  days: [
    { day: 'Sexta-feira', time: '11h30 às 13h00', note: "Jumu'ah" },
    { day: 'Sábado', time: '11h30 às 13h00', note: null },
  ],
  /**
   * TODO: confirmar com a administração o horário exato da khutbah dentro da
   * janela de sexta-feira. Enquanto não for confirmado, o site anuncia só a
   * janela de abertura — nunca um horário de khutbah supostamente exato.
   */
  khutbahTime: null as string | null,
  /**
   * Não escreva aqui um "fechada fora desses horários" seco: no Ramadan e nos
   * dois Eid a mesquita abre em outros horários, e a frase ficaria falsa.
   */
  closedNote:
    'Nos outros dias a mesquita abre apenas em datas especiais — Ramadan e as festas de Eid —, anunciadas antes no Instagram. Para visitar fora do horário, combine pelo formulário.',
} as const;

/**
 * O que a comunidade faz junto na mesquita — e só isso.
 *
 * Não é a lista de serviços: envio de livros e agendamento de visita têm a
 * própria seção (`#pedidos`) e não entram aqui.
 *
 * Só o que está confirmado. Não acrescente atividade (aulas, casamento, apoio
 * a revertidos) antes de a administração confirmar que ela existe de verdade —
 * uma versão anterior deste arquivo listava aulas que o centro não oferece.
 *
 * Iftar, Eid e as leituras do Alcorão acontecem fora da janela de sexta e
 * sábado: por isso nenhuma delas anuncia horário aqui. As datas saem no
 * Instagram a cada ano.
 */
export const activities = [
  {
    title: "Jumu'ah — sexta-feira",
    description:
      'A mesquita abre das 11h30 às 13h00 para a oração de sexta-feira. É quando a comunidade se encontra.',
    icon: 'calendar',
  },
  {
    title: 'Sábado',
    description:
      'Aberta no mesmo horário, das 11h30 às 13h00, para quem quiser rezar ou conversar com a comunidade.',
    icon: 'mosque',
  },
  {
    title: 'Leituras do Alcorão',
    description:
      'A comunidade se reúne para ler e escutar o Alcorão. Quem ainda não lê em árabe também é bem-vindo.',
    icon: 'book',
  },
  {
    title: 'Iftar no Ramadan',
    description:
      'No mês de Ramadan a comunidade quebra o jejum junto na mesquita. Os dias são combinados e avisados no Instagram.',
    icon: 'moon',
  },
  {
    title: 'Eid al-Fitr e Eid al-Adha',
    description:
      'As duas festas do ano são celebradas com a comunidade. O horário da oração de Eid muda a cada ano e é anunciado antes.',
    icon: 'star',
  },
] as const;

/**
 * Envio de livros islâmicos — hoje o principal serviço do centro.
 *
 * Os livros são enviados sem custo para quem mora no Nordeste. A lista de
 * estados existe para o formulário: pedir de fora dela é o único caso que a
 * gente não consegue atender.
 */
export const books = {
  regionLabel: 'Nordeste',
  /** Estados atendidos pelo envio. */
  states: [
    'Alagoas',
    'Bahia',
    'Ceará',
    'Maranhão',
    'Paraíba',
    'Pernambuco',
    'Piauí',
    'Rio Grande do Norte',
    'Sergipe',
  ],
  note:
    'O envio é gratuito. Pedimos só o endereço completo para conseguir postar — nada além disso.',
} as const;

/**
 * Formulário único de pedidos (livros, visita, outro assunto).
 *
 * Os campos mudam conforme o assunto escolhido, e a troca é feita só com CSS
 * (radio + seletor de irmão), sem JavaScript — veja Formulario.astro.
 *
 * O envio usa **Netlify Forms**: funciona porque o site é publicado na Netlify
 * e o formulário existe no HTML estático. Nenhum campo condicional pode ser
 * `required`, senão o navegador trava a submissão tentando validar um campo
 * escondido.
 */
export const requestForm = {
  /** Nome do formulário no painel da Netlify. */
  name: 'pedidos',
  /** Página mostrada depois do envio. */
  successPage: '/obrigado',
  types: [
    {
      id: 'livros',
      value: 'Pedido de livros islâmicos',
      label: 'Quero receber livros islâmicos',
      hint: 'Envio gratuito para o Nordeste',
      icon: 'book',
    },
    {
      id: 'visita',
      value: 'Visita à mesquita',
      label: 'Quero visitar a mesquita',
      hint: 'Pessoas, escolas e grupos',
      icon: 'mosque',
    },
    {
      id: 'outro',
      value: 'Outro assunto',
      label: 'Tenho outro assunto',
      hint: 'Dúvidas, pedidos, imprensa',
      icon: 'mail',
    },
  ],
} as const;

/**
 * Documentos e modelos disponibilizados à comunidade.
 *
 * Coloque os arquivos em `public/docs/` e aponte `file` para
 * `/docs/nome-do-arquivo.pdf`. Enquanto o arquivo não existir, deixe
 * `file: null` — o item aparece marcado como "em breve" em vez de virar
 * um link quebrado.
 *
 * TODO: confirmar quais documentos a administração quer publicar.
 */
export type DocItem = {
  title: string;
  description: string;
  file: string | null;
  /** Formato mostrado na etiqueta: 'PDF', 'DOCX'... */
  format?: string;
  /** Tamanho aproximado, só informativo: '180 KB'. */
  size?: string;
};

export const documents: DocItem[] = [
  {
    title: 'Declaração de shahada',
    description:
      'Modelo de declaração entregue a quem abraça o Islam no centro, com registro e testemunhas.',
    file: null,
    format: 'PDF',
  },
  {
    title: 'Pedido de casamento islâmico (nikah)',
    description:
      'Formulário preenchido pelos noivos antes da cerimônia, com a lista de documentos necessários.',
    file: null,
    format: 'PDF',
  },
  {
    title: 'Guia de funeral islâmico',
    description:
      'Passo a passo do que fazer em caso de falecimento e quem procurar na comunidade.',
    file: null,
    format: 'PDF',
  },
  {
    title: 'Como rezar — guia do iniciante',
    description:
      'Wudu e as posições do salat explicados em português, para imprimir e levar.',
    file: null,
    format: 'PDF',
  },
  {
    title: 'Orientação sobre alimentação halal',
    description:
      'O que é halal, o que evitar e onde encontrar produtos em João Pessoa.',
    file: null,
    format: 'PDF',
  },
  {
    title: 'Carta de apresentação da comunidade',
    description:
      'Documento institucional do centro, útil para escolas, empresas e órgãos públicos.',
    file: null,
    format: 'PDF',
  },
];

/**
 * Galeria de fotos da mesquita e das atividades.
 * Coloque as imagens em `public/galeria/` e liste aqui. Com a lista vazia,
 * a seção mostra um aviso de "em breve" — nunca um buraco no layout.
 */
export type Photo = { src: string; alt: string; caption?: string };

export const gallery: Photo[] = [];

/** Doações. Deixe pixKey vazio para esconder a seção de PIX. */
export const donations = {
  pixKey: '',
  pixOwner: '',
  note: 'A mesquita se mantém com a sadaqa da comunidade: manutenção, água, luz e as atividades.',
} as const;
