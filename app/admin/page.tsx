'use client'

import { useEffect, useState } from 'react'
import { supabase, registrarLog, type Produto, type Log, type Orcamento } from '@/lib/supabase'

const ADMIN_SENHA = 'Hemerson2832'
const WA_NUMBER = '5568923203049'
const CATEGORIAS = [
  'Hidráulica','Elétrica','Ferramentas','Tintas',
  'Argamassa','EPI','Ferragens','Cobertura',
  'Construção Pesada','Acessórios'
]
const CORES = [
  { label: 'Azul', value: '#1E4FA8' },
  { label: 'Laranja', value: '#E8722A' },
  { label: 'Azul escuro', value: '#14307A' },
  { label: 'Preto', value: '#111318' },
  { label: 'Verde', value: '#166534' },
]

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [aba, setAba] = useState<'dashboard'|'produtos'|'banners'|'orcamentos'|'logs'>('dashboard')

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [metricas, setMetricas] = useState<any>({})
  const [carregando, setCarregando] = useState(false)

  // form produto
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState<Produto|null>(null)
  const [form, setForm] = useState({ nome:'', preco:'', categoria:'Hidráulica', destaque:false, promocao:'', estoque:'', imagem_url:'' })

  // form banner
  const [bannerFormAberto, setBannerFormAberto] = useState(false)
  const [editandoBanner, setEditandoBanner] = useState<any|null>(null)
  const [bannerForm, setBannerForm] = useState({ title:'', subtitle:'', cta:'Ver Produtos', href:'#produtos', imagem_url:'', cor_fundo:'#1E4FA8', ordem:'0' })

  function login() {
    if (senha === ADMIN_SENHA) { setAutenticado(true); setErroSenha(false) }
    else setErroSenha(true)
  }

  async function carregarDados() {
    setCarregando(true)
    const [p, l, o, b, m] = await Promise.all([
      supabase.from('produtos').select('*').order('nome'),
      supabase.from('logs').select('*').order('criado_em', { ascending: false }).limit(100),
      supabase.from('orcamentos').select('*').order('criado_em', { ascending: false }).limit(50),
      supabase.from('banners').select('*').order('ordem'),
      supabase.from('metricas').select('*'),
    ])
    setProdutos(p.data || [])
    setLogs(l.data || [])
    setOrcamentos(o.data || [])
    setBanners(b.data || [])

    const mData = m.data || []
    const hoje = new Date().toDateString()
    const semana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const orcHoje = (o.data || []).filter((x:any) => new Date(x.criado_em).toDateString() === hoje)
    const orcSemana = (o.data || []).filter((x:any) => new Date(x.criado_em) > semana)
    const totalSemana = orcSemana.reduce((s:number, x:any) => s + x.total, 0)
    const cliques: Record<string, number> = {}
    mData.filter((x:any) => x.evento === 'add_produto').forEach((x:any) => {
      if (x.produto_nome) cliques[x.produto_nome] = (cliques[x.produto_nome] || 0) + 1
    })
    const topProdutos = Object.entries(cliques).sort((a,b) => b[1]-a[1]).slice(0,5)
    setMetricas({
      totalProdutos: (p.data||[]).length,
      produtosAtivos: (p.data||[]).filter((x:any) => x.ativo).length,
      orcHoje: orcHoje.length, orcSemana: orcSemana.length,
      totalSemana: totalSemana.toFixed(2), topProdutos,
      totalLogs: (l.data||[]).length,
    })
    setCarregando(false)
  }

  useEffect(() => { if (autenticado) carregarDados() }, [autenticado])

  // ─── PRODUTOS ───
  async function salvarProduto() {
    if (!form.nome || !form.preco) return
    const dados = { nome:form.nome, preco:parseFloat(form.preco), categoria:form.categoria, destaque:form.destaque, promocao:form.promocao||null, estoque:parseInt(form.estoque)||0, imagem_url:form.imagem_url||null, atualizado_em:new Date().toISOString() }
    if (editando) {
      await supabase.from('produtos').update(dados).eq('id', editando.id)
      await registrarLog('Hemerson','admin','EDITAR','produtos',editando.id,`Editou: ${form.nome} — R$${form.preco}`)
    } else {
      const { data } = await supabase.from('produtos').insert({ ...dados, ativo:true }).select().single()
      await registrarLog('Hemerson','admin','CRIAR','produtos',data?.id,`Criou: ${form.nome} — R$${form.preco}`)
    }
    setFormAberto(false); setEditando(null)
    setForm({ nome:'', preco:'', categoria:'Hidráulica', destaque:false, promocao:'', estoque:'', imagem_url:'' })
    carregarDados()
  }

  async function toggleAtivo(p: Produto) {
    await supabase.from('produtos').update({ ativo:!p.ativo }).eq('id', p.id)
    await registrarLog('Hemerson','admin',p.ativo?'DESATIVAR':'ATIVAR','produtos',p.id,`${p.ativo?'Desativou':'Ativou'}: ${p.nome}`)
    carregarDados()
  }

  async function toggleDestaque(p: Produto) {
    await supabase.from('produtos').update({ destaque:!p.destaque }).eq('id', p.id)
    await registrarLog('Hemerson','admin','DESTAQUE','produtos',p.id,`${p.destaque?'Removeu':'Adicionou'} destaque: ${p.nome}`)
    carregarDados()
  }

  async function excluirProduto(p: Produto) {
    if (!confirm(`Excluir "${p.nome}"?`)) return
    await supabase.from('produtos').delete().eq('id', p.id)
    await registrarLog('Hemerson','admin','EXCLUIR','produtos',p.id,`Excluiu: ${p.nome}`)
    carregarDados()
  }

  function abrirEditar(p: Produto) {
    setEditando(p)
    setForm({ nome:p.nome, preco:String(p.preco), categoria:p.categoria, destaque:p.destaque, promocao:p.promocao||'', estoque:String(p.estoque), imagem_url:p.imagem_url||'' })
    setFormAberto(true)
  }

  // ─── BANNERS ───
  async function salvarBanner() {
    if (!bannerForm.title) return
    const dados = { title:bannerForm.title, subtitle:bannerForm.subtitle, cta:bannerForm.cta, href:bannerForm.href, imagem_url:bannerForm.imagem_url||null, cor_fundo:bannerForm.cor_fundo, ordem:parseInt(bannerForm.ordem)||0 }
    if (editandoBanner) {
      await supabase.from('banners').update(dados).eq('id', editandoBanner.id)
      await registrarLog('Hemerson','admin','EDITAR','banners',editandoBanner.id,`Editou banner: ${bannerForm.title}`)
    } else {
      const { data } = await supabase.from('banners').insert({ ...dados, ativo:true }).select().single()
      await registrarLog('Hemerson','admin','CRIAR','banners',data?.id,`Criou banner: ${bannerForm.title}`)
    }
    setBannerFormAberto(false); setEditandoBanner(null)
    setBannerForm({ title:'', subtitle:'', cta:'Ver Produtos', href:'#produtos', imagem_url:'', cor_fundo:'#1E4FA8', ordem:'0' })
    carregarDados()
  }

  async function toggleBanner(b: any) {
    await supabase.from('banners').update({ ativo:!b.ativo }).eq('id', b.id)
    carregarDados()
  }

  async function excluirBanner(b: any) {
    if (!confirm(`Excluir banner "${b.title}"?`)) return
    await supabase.from('banners').delete().eq('id', b.id)
    await registrarLog('Hemerson','admin','EXCLUIR','banners',b.id,`Excluiu banner: ${b.title}`)
    carregarDados()
  }

  function abrirEditarBanner(b: any) {
    setEditandoBanner(b)
    setBannerForm({ title:b.title, subtitle:b.subtitle||'', cta:b.cta||'Ver Produtos', href:b.href||'#produtos', imagem_url:b.imagem_url||'', cor_fundo:b.cor_fundo||'#1E4FA8', ordem:String(b.ordem||0) })
    setBannerFormAberto(true)
  }

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`
  const fmtData = (d: string) => new Date(d).toLocaleString('pt-BR')

  // ─── LOGIN ───
  if (!autenticado) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1117' }}>
      <div style={{ background:'#1c2030', borderRadius:16, padding:40, width:360, boxShadow:'0 20px 60px rgba(0,0,0,.4)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ background:'linear-gradient(135deg,#E8722A,#C45F1F)', width:56, height:56, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:28, fontWeight:700, color:'#fff' }}>G</div>
          <h1 style={{ color:'#fff', fontSize:22, fontWeight:700, margin:0 }}>Painel Admin</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:13, marginTop:6 }}>Gaúcho Material de Construção</p>
        </div>
        <input type="password" placeholder="Senha de acesso" value={senha}
          onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key==='Enter' && login()}
          style={{ width:'100%', padding:'12px 14px', borderRadius:8, border:`1.5px solid ${erroSenha?'#ef4444':'rgba(255,255,255,.1)'}`, background:'rgba(255,255,255,.05)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
        {erroSenha && <p style={{ color:'#ef4444', fontSize:12, marginBottom:12, textAlign:'center' }}>Senha incorreta</p>}
        <button onClick={login} style={{ width:'100%', background:'#E8722A', color:'#fff', border:'none', borderRadius:8, padding:'12px', fontWeight:700, fontSize:14, cursor:'pointer' }}>Entrar</button>
      </div>
    </div>
  )

  const inputStyle = { width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'#fff', borderRadius:8, padding:'10px 12px', fontSize:13, outline:'none', boxSizing:'border-box' as const }
  const labelStyle = { fontSize:12, color:'rgba(255,255,255,.5)', display:'block' as const, marginBottom:6 }

  return (
    <div style={{ minHeight:'100vh', background:'#0f1117', color:'#fff', fontFamily:'sans-serif' }}>

      {/* HEADER */}
      <div style={{ background:'#1c2030', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ background:'linear-gradient(135deg,#E8722A,#C45F1F)', width:38, height:38, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:20 }}>G</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>Gaúcho Admin</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>Bem-vindo, Hemerson · WhatsApp: (68) 9232-0349</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" style={{ background:'rgba(37,211,102,.1)', border:'1px solid rgba(37,211,102,.2)', color:'#25D366', borderRadius:6, padding:'7px 14px', cursor:'pointer', fontSize:12, fontWeight:700, textDecoration:'none' }}>💬 WhatsApp</a>
          <button onClick={() => setAutenticado(false)} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.6)', borderRadius:6, padding:'7px 14px', cursor:'pointer', fontSize:12 }}>Sair</button>
        </div>
      </div>

      {/* ABAS */}
      <div style={{ background:'#161b26', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'0 28px', display:'flex', gap:4 }}>
        {([
          { id:'dashboard', label:'📊 Dashboard' },
          { id:'produtos', label:'📦 Produtos' },
          { id:'banners', label:'🖼️ Banners' },
          { id:'orcamentos', label:'🧾 Orçamentos' },
          { id:'logs', label:'📋 Logs' },
        ] as const).map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ background:'none', border:'none', color:aba===a.id?'#E8722A':'rgba(255,255,255,.5)', borderBottom:aba===a.id?'2px solid #E8722A':'2px solid transparent', padding:'14px 18px', cursor:'pointer', fontWeight:600, fontSize:13, transition:'all .2s' }}>
            {a.label}
          </button>
        ))}
        <button onClick={carregarDados} style={{ marginLeft:'auto', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.6)', borderRadius:6, padding:'6px 12px', cursor:'pointer', fontSize:12, alignSelf:'center' }}>↻ Atualizar</button>
      </div>

      <div style={{ padding:28, maxWidth:1300, margin:'0 auto' }}>

        {/* ── DASHBOARD ── */}
        {aba === 'dashboard' && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:24 }}>Dashboard</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
              {[
                { label:'Produtos ativos', valor:metricas.produtosAtivos||0, icon:'📦', cor:'#E8722A' },
                { label:'Orçamentos hoje', valor:metricas.orcHoje||0, icon:'🧾', cor:'#22c55e' },
                { label:'Orçamentos semana', valor:metricas.orcSemana||0, icon:'📅', cor:'#3b82f6' },
                { label:'Volume semana', valor:`R$ ${metricas.totalSemana||'0,00'}`, icon:'💰', cor:'#f59e0b' },
                { label:'Banners ativos', valor:banners.filter(b=>b.ativo).length, icon:'🖼️', cor:'#8b5cf6' },
              ].map((c,i) => (
                <div key={i} style={{ background:'#1c2030', borderRadius:12, padding:'20px 18px', border:'1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{c.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:c.cor }}>{c.valor}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:4 }}>{c.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div style={{ background:'#1c2030', borderRadius:12, padding:22, border:'1px solid rgba(255,255,255,.06)' }}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>⭐ Produtos mais adicionados</h3>
                {metricas.topProdutos?.length ? metricas.topProdutos.map(([nome, qtd]: [string,number], i:number) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,.8)' }}>{i+1}. {nome}</span>
                    <span style={{ background:'rgba(232,114,42,.15)', color:'#E8722A', padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>{qtd}x</span>
                  </div>
                )) : <p style={{ color:'rgba(255,255,255,.3)', fontSize:13 }}>Nenhum dado ainda</p>}
              </div>
              <div style={{ background:'#1c2030', borderRadius:12, padding:22, border:'1px solid rgba(255,255,255,.06)' }}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>🧾 Últimos orçamentos</h3>
                {orcamentos.slice(0,5).map((o:any,i:number) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                    <div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,.8)' }}>{o.cliente_nome||'Anônimo'}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>{fmtData(o.criado_em)}</div>
                    </div>
                    <span style={{ color:'#22c55e', fontWeight:700, fontSize:14 }}>{fmt(o.total)}</span>
                  </div>
                ))}
                {!orcamentos.length && <p style={{ color:'rgba(255,255,255,.3)', fontSize:13 }}>Nenhum orçamento ainda</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUTOS ── */}
        {aba === 'produtos' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ fontSize:22, fontWeight:700 }}>Produtos ({produtos.length})</h2>
              <button onClick={() => { setEditando(null); setForm({ nome:'', preco:'', categoria:'Hidráulica', destaque:false, promocao:'', estoque:'', imagem_url:'' }); setFormAberto(true) }}
                style={{ background:'#E8722A', color:'#fff', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                + Novo Produto
              </button>
            </div>
            {formAberto && (
              <div style={{ background:'#1c2030', borderRadius:12, padding:24, marginBottom:24, border:'1px solid rgba(232,114,42,.3)' }}>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20, color:'#E8722A' }}>{editando?'Editar Produto':'Novo Produto'}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[
                    { label:'Nome *', key:'nome', type:'text', placeholder:'Ex: Caixa D\'Água 1000L' },
                    { label:'Preço (R$) *', key:'preco', type:'number', placeholder:'0.00' },
                    { label:'Estoque', key:'estoque', type:'number', placeholder:'0' },
                    { label:'Badge/Promoção', key:'promocao', type:'text', placeholder:'Ex: Mais Vendido' },
                    { label:'URL da Foto', key:'imagem_url', type:'text', placeholder:'https://imgbb.com/...' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]:e.target.value }))} style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Categoria *</label>
                    <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria:e.target.value }))} style={{ ...inputStyle, background:'#1c2030' }}>
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10 }}>
                  <input type="checkbox" id="dest" checked={form.destaque} onChange={e => setForm(p => ({ ...p, destaque:e.target.checked }))} />
                  <label htmlFor="dest" style={{ fontSize:13, color:'rgba(255,255,255,.7)', cursor:'pointer' }}>Produto em destaque na home</label>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:20 }}>
                  <button onClick={salvarProduto} style={{ background:'#E8722A', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>{editando?'Salvar':'Criar'}</button>
                  <button onClick={() => setFormAberto(false)} style={{ background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>Cancelar</button>
                </div>
              </div>
            )}
            <div style={{ display:'grid', gap:10 }}>
              {produtos.map(p => (
                <div key={p.id} style={{ background:'#1c2030', borderRadius:10, padding:'14px 18px', border:`1px solid ${p.ativo?'rgba(255,255,255,.06)':'rgba(239,68,68,.2)'}`, display:'flex', alignItems:'center', gap:16, opacity:p.ativo?1:0.6 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{p.nome}</span>
                      {p.destaque && <span style={{ background:'rgba(245,200,66,.15)', color:'#F5C842', fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:700 }}>DESTAQUE</span>}
                      {!p.ativo && <span style={{ background:'rgba(239,68,68,.15)', color:'#ef4444', fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:700 }}>INATIVO</span>}
                    </div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:3 }}>{p.categoria} · Estoque: {p.estoque}</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#E8722A', whiteSpace:'nowrap' }}>{fmt(p.preco)}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => toggleDestaque(p)} style={{ background:'rgba(245,200,66,.1)', border:'1px solid rgba(245,200,66,.2)', color:'#F5C842', borderRadius:6, padding:'6px 10px', cursor:'pointer' }}>⭐</button>
                    <button onClick={() => abrirEditar(p)} style={{ background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.2)', color:'#60a5fa', borderRadius:6, padding:'6px 10px', cursor:'pointer', fontSize:12, fontWeight:700 }}>Editar</button>
                    <button onClick={() => toggleAtivo(p)} style={{ background:p.ativo?'rgba(239,68,68,.1)':'rgba(34,197,94,.1)', border:`1px solid ${p.ativo?'rgba(239,68,68,.2)':'rgba(34,197,94,.2)'}`, color:p.ativo?'#ef4444':'#22c55e', borderRadius:6, padding:'6px 10px', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                      {p.ativo?'Desativar':'Ativar'}
                    </button>
                    <button onClick={() => excluirProduto(p)} style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', color:'#ef4444', borderRadius:6, padding:'6px 10px', cursor:'pointer', fontSize:12 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BANNERS ── */}
        {aba === 'banners' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <h2 style={{ fontSize:22, fontWeight:700 }}>Banners do Carrossel</h2>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', marginTop:4 }}>Gerencie os slides do carrossel da home. Ordem = sequência de exibição.</p>
              </div>
              <button onClick={() => { setEditandoBanner(null); setBannerForm({ title:'', subtitle:'', cta:'Ver Produtos', href:'#produtos', imagem_url:'', cor_fundo:'#1E4FA8', ordem:'0' }); setBannerFormAberto(true) }}
                style={{ background:'#E8722A', color:'#fff', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                + Novo Banner
              </button>
            </div>

            {bannerFormAberto && (
              <div style={{ background:'#1c2030', borderRadius:12, padding:24, marginBottom:24, border:'1px solid rgba(232,114,42,.3)' }}>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20, color:'#E8722A' }}>{editandoBanner?'Editar Banner':'Novo Banner'}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Título principal *</label>
                    <input type="text" placeholder="Ex: Promoção da Semana" value={bannerForm.title} onChange={e => setBannerForm(p => ({ ...p, title:e.target.value }))} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Subtítulo</label>
                    <input type="text" placeholder="Ex: Argamassa AC2 a R$30 o saco" value={bannerForm.subtitle} onChange={e => setBannerForm(p => ({ ...p, subtitle:e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Texto do botão</label>
                    <input type="text" placeholder="Ver Produtos" value={bannerForm.cta} onChange={e => setBannerForm(p => ({ ...p, cta:e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Link do botão</label>
                    <input type="text" placeholder="#produtos ou https://wa.me/..." value={bannerForm.href} onChange={e => setBannerForm(p => ({ ...p, href:e.target.value }))} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>URL da imagem de fundo (opcional — deixe vazio para usar cor sólida)</label>
                    <input type="text" placeholder="https://imgbb.com/sua-imagem.jpg" value={bannerForm.imagem_url} onChange={e => setBannerForm(p => ({ ...p, imagem_url:e.target.value }))} style={inputStyle} />
                    <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:4 }}>Dica: suba a imagem no imgbb.com e cole o link aqui. Tamanho ideal: 1920x500px</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Cor de fundo (quando sem imagem)</label>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:4 }}>
                      {CORES.map(c => (
                        <button key={c.value} onClick={() => setBannerForm(p => ({ ...p, cor_fundo:c.value }))}
                          style={{ width:32, height:32, borderRadius:8, background:c.value, border:`2px solid ${bannerForm.cor_fundo===c.value?'#fff':'transparent'}`, cursor:'pointer', transition:'all .2s' }}
                          title={c.label} />
                      ))}
                      <input type="color" value={bannerForm.cor_fundo} onChange={e => setBannerForm(p => ({ ...p, cor_fundo:e.target.value }))}
                        style={{ width:32, height:32, borderRadius:8, border:'none', cursor:'pointer', background:'none' }} title="Cor personalizada" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Ordem (1 = primeiro)</label>
                    <input type="number" placeholder="1" value={bannerForm.ordem} onChange={e => setBannerForm(p => ({ ...p, ordem:e.target.value }))} style={inputStyle} />
                  </div>
                </div>

                {/* Preview */}
                {(bannerForm.title || bannerForm.imagem_url) && (
                  <div style={{ marginTop:20 }}>
                    <label style={labelStyle}>Preview</label>
                    <div style={{ height:160, borderRadius:10, overflow:'hidden', position:'relative', background:bannerForm.cor_fundo, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {bannerForm.imagem_url && <img src={bannerForm.imagem_url} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.6 }} alt="" />}
                      <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:20 }}>
                        <div style={{ fontSize:20, fontWeight:700, color:'#fff', marginBottom:6 }}>{bannerForm.title}</div>
                        {bannerForm.subtitle && <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', marginBottom:12 }}>{bannerForm.subtitle}</div>}
                        <span style={{ background:'#E8722A', color:'#fff', padding:'6px 16px', borderRadius:6, fontSize:12, fontWeight:700 }}>{bannerForm.cta}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display:'flex', gap:10, marginTop:20 }}>
                  <button onClick={salvarBanner} style={{ background:'#E8722A', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>{editandoBanner?'Salvar':'Criar Banner'}</button>
                  <button onClick={() => setBannerFormAberto(false)} style={{ background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>Cancelar</button>
                </div>
              </div>
            )}

            <div style={{ display:'grid', gap:12 }}>
              {banners.map(b => (
                <div key={b.id} style={{ background:'#1c2030', borderRadius:12, border:`1px solid ${b.ativo?'rgba(255,255,255,.06)':'rgba(239,68,68,.2)'}`, overflow:'hidden', opacity:b.ativo?1:0.6 }}>
                  <div style={{ height:100, background:b.cor_fundo||'#1E4FA8', position:'relative', display:'flex', alignItems:'center', padding:'0 24px' }}>
                    {b.imagem_url && <img src={b.imagem_url} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.5 }} alt="" />}
                    <div style={{ position:'relative', zIndex:2 }}>
                      <div style={{ fontWeight:700, fontSize:16, color:'#fff' }}>{b.title}</div>
                      {b.subtitle && <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', marginTop:2 }}>{b.subtitle}</div>}
                    </div>
                    <div style={{ marginLeft:'auto', position:'relative', zIndex:2, display:'flex', gap:6 }}>
                      <span style={{ background:'rgba(0,0,0,.4)', color:'rgba(255,255,255,.7)', padding:'3px 10px', borderRadius:6, fontSize:11 }}>Ordem: {b.ordem}</span>
                      {!b.ativo && <span style={{ background:'rgba(239,68,68,.3)', color:'#fca5a5', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:700 }}>INATIVO</span>}
                    </div>
                  </div>
                  <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10, justifyContent:'flex-end' }}>
                    <button onClick={() => abrirEditarBanner(b)} style={{ background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.2)', color:'#60a5fa', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:12, fontWeight:700 }}>Editar</button>
                    <button onClick={() => toggleBanner(b)} style={{ background:b.ativo?'rgba(239,68,68,.1)':'rgba(34,197,94,.1)', border:`1px solid ${b.ativo?'rgba(239,68,68,.2)':'rgba(34,197,94,.2)'}`, color:b.ativo?'#ef4444':'#22c55e', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                      {b.ativo?'Desativar':'Ativar'}
                    </button>
                    <button onClick={() => excluirBanner(b)} style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', color:'#ef4444', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:12 }}>✕ Excluir</button>
                  </div>
                </div>
              ))}
              {!banners.length && <div style={{ textAlign:'center', padding:60, color:'rgba(255,255,255,.3)' }}>Nenhum banner cadastrado ainda</div>}
            </div>
          </div>
        )}

        {/* ── ORÇAMENTOS ── */}
        {aba === 'orcamentos' && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:24 }}>Orçamentos ({orcamentos.length})</h2>
            <div style={{ display:'grid', gap:12 }}>
              {orcamentos.map((o:any) => (
                <div key={o.id} style={{ background:'#1c2030', borderRadius:10, padding:'16px 20px', border:'1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{o.cliente_nome||'Cliente anônimo'}</div>
                      {o.cliente_endereco && <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:2 }}>📍 {o.cliente_endereco}</div>}
                      <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:2 }}>🕐 {fmtData(o.criado_em)}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:22, fontWeight:700, color:'#22c55e' }}>{fmt(o.total)}</div>
                      <a href={`https://wa.me/${WA_NUMBER}?text=Olá!%20Sobre%20o%20orçamento%20de%20${o.cliente_nome||'cliente'}%20no%20valor%20de%20${fmt(o.total)}`}
                        target="_blank" style={{ fontSize:11, color:'#25D366', textDecoration:'none', fontWeight:600 }}>💬 Responder no WA</a>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {Array.isArray(o.itens) && o.itens.map((item:any, i:number) => (
                      <span key={i} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:6, padding:'4px 10px', fontSize:12, color:'rgba(255,255,255,.7)' }}>
                        {item.qty||item.quantidade||1}x {item.nm||item.nome||item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {!orcamentos.length && <div style={{ textAlign:'center', padding:60, color:'rgba(255,255,255,.3)' }}>Nenhum orçamento ainda</div>}
            </div>
          </div>
        )}

        {/* ── LOGS ── */}
        {aba === 'logs' && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:24 }}>Log de Auditoria ({logs.length})</h2>
            <div style={{ display:'grid', gap:8 }}>
              {logs.map(l => (
                <div key={l.id} style={{ background:'#1c2030', borderRadius:8, padding:'12px 16px', border:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ background:l.acao==='CRIAR'?'rgba(34,197,94,.15)':l.acao==='EXCLUIR'?'rgba(239,68,68,.15)':l.acao==='EDITAR'?'rgba(59,130,246,.15)':'rgba(245,200,66,.15)', color:l.acao==='CRIAR'?'#22c55e':l.acao==='EXCLUIR'?'#ef4444':l.acao==='EDITAR'?'#60a5fa':'#F5C842', borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:700, minWidth:70, textAlign:'center' as const }}>
                    {l.acao}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,.8)' }}>{l.detalhe||`${l.tabela} — ${l.registro_id}`}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:2 }}>👤 {l.usuario_nome} · {fmtData(l.criado_em)}</div>
                  </div>
                </div>
              ))}
              {!logs.length && <div style={{ textAlign:'center', padding:60, color:'rgba(255,255,255,.3)' }}>Nenhuma ação ainda</div>}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
