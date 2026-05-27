'use client'

import { useEffect, useState } from 'react'
import { supabase, registrarLog, type Produto } from '@/lib/supabase'

const STAFF_SENHA = 'Ass2832'
const CATEGORIAS = [
  'Hidráulica','Elétrica','Ferramentas','Tintas',
  'Argamassa','EPI','Ferragens','Cobertura',
  'Construção Pesada','Acessórios'
]

export default function StaffPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(false)
  const [busca, setBusca] = useState('')
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState<Produto|null>(null)
  const [form, setForm] = useState({
    nome:'', preco:'', categoria:'Hidráulica',
    estoque:'', promocao:'', imagem_url:'', destaque: false
  })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  function login() {
    if (senha === STAFF_SENHA) { setAutenticado(true); setErroSenha(false) }
    else setErroSenha(true)
  }

  async function carregar() {
    setCarregando(true)
    const { data } = await supabase.from('produtos').select('*').order('nome')
    setProdutos(data || [])
    setCarregando(false)
  }

  useEffect(() => { if (autenticado) carregar() }, [autenticado])

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  async function salvar() {
    if (!form.nome || !form.preco) { setMsg('Nome e preço são obrigatórios'); return }
    setSalvando(true)
    const dados = {
      nome: form.nome, preco: parseFloat(form.preco),
      categoria: form.categoria, estoque: parseInt(form.estoque) || 0,
      promocao: form.promocao || null, imagem_url: form.imagem_url || null,
      destaque: form.destaque, atualizado_em: new Date().toISOString(),
    }
    if (editando) {
      await supabase.from('produtos').update(dados).eq('id', editando.id)
      await registrarLog('Assistente', 'funcionario', 'EDITAR', 'produtos', editando.id,
        `Editou: ${form.nome} — Preço: R$${form.preco} — Estoque: ${form.estoque}`)
      setMsg(`✅ "${form.nome}" atualizado com sucesso!`)
    } else {
      const { data } = await supabase.from('produtos').insert({ ...dados, ativo: true }).select().single()
      await registrarLog('Assistente', 'funcionario', 'CRIAR', 'produtos', data?.id,
        `Criou: ${form.nome} — R$${form.preco}`)
      setMsg(`✅ "${form.nome}" criado com sucesso!`)
    }
    setSalvando(false)
    setFormAberto(false)
    setEditando(null)
    setForm({ nome:'', preco:'', categoria:'Hidráulica', estoque:'', promocao:'', imagem_url:'', destaque:false })
    carregar()
    setTimeout(() => setMsg(''), 4000)
  }

  function abrirEditar(p: Produto) {
    setEditando(p)
    setForm({ nome:p.nome, preco:String(p.preco), categoria:p.categoria, estoque:String(p.estoque), promocao:p.promocao||'', imagem_url:p.imagem_url||'', destaque:p.destaque })
    setFormAberto(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function toggleAtivo(p: Produto) {
    await supabase.from('produtos').update({ ativo: !p.ativo }).eq('id', p.id)
    await registrarLog('Assistente', 'funcionario', p.ativo ? 'DESATIVAR' : 'ATIVAR', 'produtos', p.id,
      `${p.ativo ? 'Desativou' : 'Ativou'}: ${p.nome}`)
    setMsg(`${p.ativo ? '⏸ Produto desativado' : '▶️ Produto ativado'}: ${p.nome}`)
    setTimeout(() => setMsg(''), 3000)
    carregar()
  }

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  // ─── LOGIN ───
  if (!autenticado) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1117' }}>
      <div style={{ background:'#1c2030', borderRadius:16, padding:40, width:340, boxShadow:'0 20px 60px rgba(0,0,0,.4)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ background:'linear-gradient(135deg,#1E4FA8,#14307A)', width:52, height:52, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22, fontWeight:700, color:'#fff' }}>📦</div>
          <h1 style={{ color:'#fff', fontSize:20, fontWeight:700, margin:0 }}>Painel Funcionário</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:12, marginTop:5 }}>Gaúcho Material de Construção</p>
        </div>
        <input type="password" placeholder="Senha de acesso" value={senha}
          onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key==='Enter' && login()}
          style={{ width:'100%', padding:'11px 13px', borderRadius:8, border:`1.5px solid ${erroSenha?'#ef4444':'rgba(255,255,255,.1)'}`, background:'rgba(255,255,255,.05)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:10 }}
        />
        {erroSenha && <p style={{ color:'#ef4444', fontSize:12, textAlign:'center', marginBottom:10 }}>Senha incorreta</p>}
        <button onClick={login} style={{ width:'100%', background:'#1E4FA8', color:'#fff', border:'none', borderRadius:8, padding:'11px', fontWeight:700, fontSize:14, cursor:'pointer' }}>Entrar</button>
      </div>
    </div>
  )

  // ─── PAINEL ───
  return (
    <div style={{ minHeight:'100vh', background:'#0f1117', color:'#fff', fontFamily:'sans-serif' }}>

      {/* HEADER */}
      <div style={{ background:'#1c2030', borderBottom:'2px solid #1E4FA8', padding:'13px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:'#1E4FA8', width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📦</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>Gestão de Produtos</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>Assistente — acesso restrito</div>
          </div>
        </div>
        <button onClick={() => setAutenticado(false)} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.5)', borderRadius:6, padding:'6px 12px', cursor:'pointer', fontSize:12 }}>Sair</button>
      </div>

      <div style={{ padding:24, maxWidth:1000, margin:'0 auto' }}>

        {/* MENSAGEM */}
        {msg && (
          <div style={{ background: msg.includes('✅') ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border:`1px solid ${msg.includes('✅')?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}`, borderRadius:8, padding:'12px 16px', marginBottom:20, fontSize:13, color: msg.includes('✅')?'#22c55e':'#ef4444', fontWeight:600 }}>
            {msg}
          </div>
        )}

        {/* FORM */}
        {formAberto && (
          <div style={{ background:'#1c2030', borderRadius:12, padding:22, marginBottom:24, border:'1px solid rgba(30,79,168,.4)' }}>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:18, color:'#60a5fa' }}>{editando ? `✏️ Editar: ${editando.nome}` : '➕ Novo Produto'}</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { label:'Nome do produto *', key:'nome', type:'text', placeholder:'Ex: Cimento CP2 50kg' },
                { label:'Preço (R$) *', key:'preco', type:'number', placeholder:'0.00' },
                { label:'Estoque (unidades)', key:'estoque', type:'number', placeholder:'0' },
                { label:'Promoção / Badge', key:'promocao', type:'text', placeholder:'Ex: Oferta' },
                { label:'URL da Foto', key:'imagem_url', type:'text', placeholder:'https://...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:12, color:'rgba(255,255,255,.5)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'#fff', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, color:'rgba(255,255,255,.5)', display:'block', marginBottom:5 }}>Categoria *</label>
                <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
                  style={{ width:'100%', background:'#1c2030', border:'1px solid rgba(255,255,255,.1)', color:'#fff', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none' }}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
              <input type="checkbox" id="dest2" checked={form.destaque} onChange={e => setForm(p => ({ ...p, destaque: e.target.checked }))} />
              <label htmlFor="dest2" style={{ fontSize:13, color:'rgba(255,255,255,.7)', cursor:'pointer' }}>Produto em destaque</label>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button onClick={salvar} disabled={salvando} style={{ background:'#1E4FA8', color:'#fff', border:'none', borderRadius:8, padding:'10px 22px', fontWeight:700, cursor:'pointer', opacity: salvando ? 0.6 : 1 }}>
                {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar produto'}
              </button>
              <button onClick={() => { setFormAberto(false); setEditando(null) }} style={{ background:'rgba(255,255,255,.05)', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'10px 18px', cursor:'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* CONTROLES */}
        <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center' }}>
          <input type="text" placeholder="🔍 Buscar produto ou categoria..." value={busca} onChange={e => setBusca(e.target.value)}
            style={{ flex:1, background:'#1c2030', border:'1px solid rgba(255,255,255,.1)', color:'#fff', borderRadius:8, padding:'10px 14px', fontSize:13, outline:'none' }} />
          <button onClick={() => { setEditando(null); setForm({ nome:'', preco:'', categoria:'Hidráulica', estoque:'', promocao:'', imagem_url:'', destaque:false }); setFormAberto(true) }}
            style={{ background:'#1E4FA8', color:'#fff', border:'none', borderRadius:8, padding:'10px 18px', fontWeight:700, fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>
            + Novo Produto
          </button>
          <button onClick={carregar} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.5)', borderRadius:8, padding:'10px 14px', cursor:'pointer', fontSize:12 }}>↻</button>
        </div>

        {/* STATS */}
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {[
            { label:'Total', valor: produtos.length, cor:'#60a5fa' },
            { label:'Ativos', valor: produtos.filter(p=>p.ativo).length, cor:'#22c55e' },
            { label:'Destaques', valor: produtos.filter(p=>p.destaque).length, cor:'#F5C842' },
            { label:'Inativos', valor: produtos.filter(p=>!p.ativo).length, cor:'#ef4444' },
          ].map((s,i) => (
            <div key={i} style={{ background:'#1c2030', borderRadius:8, padding:'10px 16px', border:'1px solid rgba(255,255,255,.06)', flex:1, textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.cor }}>{s.valor}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* LISTA */}
        {carregando ? (
          <div style={{ textAlign:'center', padding:60, color:'rgba(255,255,255,.4)' }}>Carregando produtos...</div>
        ) : (
          <div style={{ display:'grid', gap:8 }}>
            {produtosFiltrados.map(p => (
              <div key={p.id} style={{ background:'#1c2030', borderRadius:10, padding:'13px 16px', border:`1px solid ${p.ativo?'rgba(255,255,255,.05)':'rgba(239,68,68,.15)'}`, display:'flex', alignItems:'center', gap:14, opacity: p.ativo?1:0.55 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, fontSize:13, color:'#fff' }}>{p.nome}</span>
                    {p.destaque && <span style={{ background:'rgba(245,200,66,.12)', color:'#F5C842', fontSize:10, padding:'1px 7px', borderRadius:4, fontWeight:700 }}>DESTAQUE</span>}
                    {!p.ativo && <span style={{ background:'rgba(239,68,68,.12)', color:'#ef4444', fontSize:10, padding:'1px 7px', borderRadius:4, fontWeight:700 }}>INATIVO</span>}
                  </div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', marginTop:3 }}>{p.categoria} · Estoque: {p.estoque} un.</div>
                </div>
                <div style={{ fontSize:17, fontWeight:700, color:'#E8722A', whiteSpace:'nowrap' }}>{fmt(p.preco)}</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => abrirEditar(p)} style={{ background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.2)', color:'#60a5fa', borderRadius:6, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:700 }}>Editar</button>
                  <button onClick={() => toggleAtivo(p)} style={{ background: p.ativo?'rgba(239,68,68,.08)':'rgba(34,197,94,.08)', border:`1px solid ${p.ativo?'rgba(239,68,68,.2)':'rgba(34,197,94,.2)'}`, color: p.ativo?'#ef4444':'#22c55e', borderRadius:6, padding:'6px 10px', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                    {p.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
            {!produtosFiltrados.length && (
              <div style={{ textAlign:'center', padding:60, color:'rgba(255,255,255,.3)' }}>
                {busca ? `Nenhum produto encontrado para "${busca}"` : 'Nenhum produto cadastrado'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
