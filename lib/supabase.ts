import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqsopxrbcmxcwesetrot.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc29weHJiY214Y3dlc2V0cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjQ1NTIsImV4cCI6MjA5Mzk0MDU1Mn0.NiZEaoEV5pztRRl4So_cOVY65C7gc7ROo7q5NZOC8N8'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Produto = {
  id: string
  nome: string
  preco: number
  categoria: string
  destaque: boolean
  promocao?: string
  imagem_url?: string
  estoque: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type Log = {
  id: string
  usuario_nome: string
  usuario_nivel: string
  acao: string
  tabela: string
  registro_id?: string
  detalhe?: string
  criado_em: string
}

export type Orcamento = {
  id: string
  cliente_nome?: string
  cliente_endereco?: string
  itens: any[]
  total: number
  criado_em: string
}

export async function registrarLog(
  usuario_nome: string,
  usuario_nivel: string,
  acao: string,
  tabela: string,
  registro_id?: string,
  detalhe?: string
) {
  await supabase.from('logs').insert({
    usuario_nome,
    usuario_nivel,
    acao,
    tabela,
    registro_id,
    detalhe,
  })
}

export async function registrarOrcamento(
  itens: any[],
  total: number,
  cliente_nome?: string,
  cliente_endereco?: string
) {
  await supabase.from('orcamentos').insert({
    itens,
    total,
    cliente_nome,
    cliente_endereco,
  })
}

export async function registrarMetrica(
  evento: string,
  produto_id?: string,
  produto_nome?: string,
  categoria?: string
) {
  await supabase.from('metricas').insert({
    evento,
    produto_id,
    produto_nome,
    categoria,
  })
}
