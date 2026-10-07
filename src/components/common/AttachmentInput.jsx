import React, { useRef, useState } from 'react';
import { Paperclip, X, FileText, AlertCircle } from 'lucide-react';
import { uploadAttachment, resolveAttachmentUrl } from '../../utils/motherApi';
import './attachments.css';

// Reusable image/PDF picker used by EVERY notes field in the app.
// Uploads immediately when a login token + backend exist; otherwise keeps a
// session-local preview so the flow never blocks. Attachment shape:
// { name, url, file_path?, kind: 'image'|'pdf', size?, local? }
export default function AttachmentInput({ attachments = [], onChange, max = 3, compact = false }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setError('');
    const room = Math.max(0, max - attachments.length);
    if (files.length > room) {
      setError(`You can attach up to ${max} file${max === 1 ? '' : 's'} here.`);
      return;
    }
    setBusy(true);
    const next = [...attachments];
    try {
      for (const f of files) {
        next.push(await uploadAttachment(f));
      }
      onChange(next);
    } catch (err) {
      setError(err.message || 'Could not attach file.');
    } finally {
      setBusy(false);
    }
  };

  const remove = (idx) => onChange(attachments.filter((_, i) => i !== idx));

  return (
    <div className={`attach-wrap ${compact ? 'compact' : ''}`}>
      <div className="attach-row">
        <button
          type="button"
          className="attach-pick-btn"
          onClick={() => inputRef.current?.click()}
          disabled={busy || attachments.length >= max}
          title="Attach image or PDF"
        >
          <Paperclip size={15} />
          <span>{busy ? 'Uploading…' : `Attach image/PDF (${attachments.length}/${max})`}</span>

        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          multiple={max > 1}
          onChange={pick}
          style={{ display: 'none' }}
        />
      </div>

      {attachments.length > 0 && (
        <div className="attach-list">
          {attachments.map((a, i) => {
            const url = resolveAttachmentUrl(a);
            const label = a?.local ? `${a.name} (this session only)` : a?.name || 'attachment';
            return (
              <div key={i} className="attach-item" title={label}>
                {a.kind === 'image' && url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={a.name} className="attach-thumb" />
                  </a>
                ) : (
                  <a href={url || undefined} target="_blank" rel="noopener noreferrer" className="attach-filelink">
                    <FileText size={18} />
                    <span>{a.name}</span>
                  </a>
                )}
                {a.local && <span className="attach-local-tag">session</span>}
                <button type="button" className="attach-remove" onClick={() => remove(i)} aria-label={`Remove ${a.name}`}>
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {error && <div className="attach-error"><AlertCircle size={13} /> {error}</div>}
    </div>
  );
}
