/**
 * Os números da prestação de contas, lidos EM TEMPO DE BUILD.
 *
 * Duas decisões estão embutidas aqui, e as duas têm motivo:
 *
 * 1. **Nada de `@supabase/supabase-js`.** A API da Supabase é PostgREST, que é
 *    HTTP puro — `fetch` resolve. Este repositório tem uma dependência só
 *    (`astro`), e vale a pena continuar assim.
 *
 * 2. **Isto nunca derruba o build.** Se a chave faltar, se a Supabase estiver
 *    pausada, se a rede falhar — a função avisa no log e devolve vazio, e a
 *    seção mostra "em breve". Um site inteiro que não sobe porque um banco
 *    dormiu seria pior do que uma seção sem números.
 *
 * A chave usada é a publicável. O RLS já limita o que ela enxerga: lançamento
 * publicado e necessidade ativa, nada mais. Rascunho não sai daqui.
 */

const URL_BASE = import.meta.env.SUPABASE_URL;
const CHAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export interface ResumoMes {
  competencia: string;
  entradas_centavos: number;
  saidas_centavos: number;
  saldo_centavos: number;
  lancamentos: number;
}

export interface Lancamento {
  id: string;
  tipo: 'entrada' | 'saida';
  data: string;
  competencia: string;
  categoria: string;
  descricao: string;
  valor_centavos: number;
  comprovante_path: string | null;
  comprovante_sha256: string | null;
  retifica: string | null;
}

export interface Necessidade {
  id: string;
  titulo: string;
  descricao: string | null;
  meta_centavos: number | null;
  arrecadado_centavos: number;
  prioridade: number;
}

export interface DadosTransparencia {
  meses: ResumoMes[];
  lancamentos: Lancamento[];
  necessidades: Necessidade[];
  /** Ids que foram substituídos por uma retificação publicada. */
  retificados: Set<string>;
  /** `false` quando não deu para falar com a Supabase — a seção avisa. */
  disponivel: boolean;
}

const VAZIO: DadosTransparencia = {
  meses: [],
  lancamentos: [],
  necessidades: [],
  retificados: new Set(),
  disponivel: false,
};

async function buscar<T>(recurso: string): Promise<T[] | null> {
  try {
    const resposta = await fetch(`${URL_BASE}/rest/v1/${recurso}`, {
      headers: {
        apikey: CHAVE,
        Authorization: `Bearer ${CHAVE}`,
        Accept: 'application/json',
      },
    });

    if (!resposta.ok) {
      console.warn(
        `[transparência] ${recurso} respondeu ${resposta.status}. A seção vai sair vazia.`
      );
      return null;
    }

    return (await resposta.json()) as T[];
  } catch (falha) {
    console.warn(`[transparência] não foi possível ler ${recurso}:`, falha);
    return null;
  }
}

export async function lerTransparencia(): Promise<DadosTransparencia> {
  if (!URL_BASE || !CHAVE) {
    console.warn(
      '[transparência] SUPABASE_URL ou PUBLIC_SUPABASE_ANON_KEY não definidas. ' +
        'A seção vai sair vazia. Ver .env.example.'
    );
    return VAZIO;
  }

  const [meses, lancamentos, necessidades] = await Promise.all([
    buscar<ResumoMes>('resumo_mensal?select=*&order=competencia.desc&limit=24'),
    buscar<Lancamento>(
      'lancamentos?select=id,tipo,data,competencia,categoria,descricao,valor_centavos,comprovante_path,comprovante_sha256,retifica&order=competencia.desc,data.desc'
    ),
    buscar<Necessidade>(
      'necessidades?select=id,titulo,descricao,meta_centavos,arrecadado_centavos,prioridade&order=prioridade.desc'
    ),
  ]);

  if (!meses && !lancamentos && !necessidades) return VAZIO;

  const linhas = lancamentos ?? [];

  return {
    meses: meses ?? [],
    lancamentos: linhas,
    necessidades: necessidades ?? [],
    // Um lançamento que tem correção publicada apontando para ele sai da soma
    // (a view já faz isso), mas continua na lista — riscado. O livro guarda o
    // próprio erro; é isso que torna o resto confiável.
    retificados: new Set(
      linhas.filter((l) => l.retifica).map((l) => l.retifica as string)
    ),
    disponivel: true,
  };
}

/** `123456` → `R$ 1.234,56`. Inteiro do começo ao fim, sem ponto flutuante. */
export function formatarCentavos(centavos: number): string {
  const negativo = centavos < 0;
  const absoluto = Math.abs(centavos);
  const resto = absoluto % 100;
  const reais = (absoluto - resto) / 100;
  return `${negativo ? '−' : ''}R$ ${reais.toLocaleString('pt-BR')},${String(resto).padStart(2, '0')}`;
}

/** `2026-08-01` → `agosto de 2026`. Em UTC, senão o dia 1 cai no mês anterior. */
export function nomeDoMes(competenciaISO: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${competenciaISO}T00:00:00Z`));
}

/** `2026-08-14` → `14/08`. */
export function diaEMes(dataISO: string): string {
  const [, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}`;
}

/**
 * A data em que estes números foram lidos. Vai impressa na seção: se o webhook
 * que dispara o rebuild parar de funcionar, o site continua mostrando números
 * antigos — e é melhor que isso apareça na tela do que passe despercebido.
 */
export function dataDaLeitura(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Fortaleza',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}
