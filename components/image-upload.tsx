'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = 'Foto do produto' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const [erro, setErro] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo e tamanho
    if (!file.type.startsWith('image/')) {
      setErro('Selecione uma imagem válida (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErro('Imagem muito grande. Máximo 5MB.')
      return
    }

    setErro('')
    setUploading(true)

    try {
      // Preview imediato
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)

      // Upload para Supabase Storage
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `produtos/${fileName}`

      const { error } = await supabase.storage
        .from('imagens')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      // Pegar URL pública
      const { data } = supabase.storage.from('imagens').getPublicUrl(path)
      onChange(data.publicUrl)
      setPreview(data.publicUrl)
    } catch (err: any) {
      setErro('Erro ao fazer upload. Tente novamente.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  async function remover() {
    setPreview('')
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
  }

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${preview ? 'rgba(34,197,94,.3)' : 'rgba(255,255,255,.15)'}`,
    borderRadius: 10,
    padding: '20px',
    textAlign: 'center',
    cursor: uploading ? 'not-allowed' : 'pointer',
    transition: 'all .2s',
    background: preview ? 'rgba(34,197,94,.04)' : 'rgba(255,255,255,.02)',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <label style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: 8 }}>
          {label}
        </label>
      )}

      <div style={dropZoneStyle} onClick={() => !uploading && inputRef.current?.click()}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
          capture="environment"
        />

        {preview ? (
          // Preview da imagem
          <div>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                style={{ background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.3)', color: '#60a5fa', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Trocar foto
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); remover() }}
                style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Remover
              </button>
            </div>
          </div>
        ) : uploading ? (
          // Loading
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            <div style={{ color: '#E8722A', fontWeight: 600, fontSize: 14 }}>Enviando foto...</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 4 }}>Aguarde um momento</div>
          </div>
        ) : (
          // Empty state
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontWeight: 600, fontSize: 14 }}>
              Clique para adicionar foto
            </div>
            <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginTop: 6 }}>
              JPG, PNG ou WebP · Máximo 5MB
            </div>
            <div style={{ color: 'rgba(255,255,255,.25)', fontSize: 11, marginTop: 4 }}>
              No celular: abre a câmera diretamente
            </div>
          </div>
        )}
      </div>

      {erro && (
        <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 600 }}>
          ⚠️ {erro}
        </div>
      )}
    </div>
  )
}
