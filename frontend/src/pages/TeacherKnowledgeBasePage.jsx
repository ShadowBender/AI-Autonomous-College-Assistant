import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
import Loader from '../components/Loader';
import Icon from '../components/Icon';

export default function TeacherKnowledgeBasePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('Lecture Notes');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/teacher/documents');
      if (response.ok) setDocuments(await response.json());
    } catch (err) {
      setError('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    formData.append('teacher_name', 'Prof. Abizer');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/teacher/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        await fetchDocuments();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error. Is Flask running?');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (id, filename) => {
    if (!window.confirm(`Delete ${filename} from the AI index?`)) return;
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/teacher/documents/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Document removed successfully.');
        fetchDocuments();
      } else {
        setError('Failed to delete document.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Data Manager"
        title="Verified Knowledge Base"
        description="Upload official RGPV materials. The AI Assistant will restrict its answers to these verified documents to prevent hallucinations."
      />

      {error && <StatusMessage type="error" title="Upload Failed">{error}</StatusMessage>}
      {success && <StatusMessage type="success" title="Index Updated">{success}</StatusMessage>}

      <div className="task-layout">
        <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Add to Vector Index</span>
              <h2>Upload Document</h2>
            </div>
          </div>
          
          <div className="form-stack">
            <label className="field">
              <span className="field__label">Document Type</span>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option>Lecture Notes</option>
                <option>Official Syllabus (RGPV)</option>
                <option>Previous Year Questions (PYQ)</option>
                <option>Lab Manual</option>
              </select>
            </label>

            <label className="button button--primary" style={{ width: '100%', textAlign: 'center', display: 'block', cursor: uploading ? 'wait' : 'pointer' }}>
              <Icon name="plus" size={17} /> {uploading ? 'Vectorizing PDF...' : 'Select PDF & Index'}
              <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
            </label>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>PDFs will be parsed, chunked, and embedded into the RAG system instantly.</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Active Context</span>
              <h2>Indexed Documents</h2>
            </div>
          </div>

          {loading ? <Loader label="Fetching index..." /> : (
            documents.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No documents indexed yet. Upload a PDF to prime the AI.</p>
            ) : (
              <div className="task-list">
                {documents.map((doc) => (
                  <article className="task-item" key={doc.id} style={{padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <h3 style={{margin: '0 0 0.25rem 0'}}>{doc.filename}</h3>
                      <div className="task-item__meta" style={{display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                        <span className="status-chip">{doc.doc_type}</span>
                        <span>• Uploaded by {doc.uploaded_by}</span>
                        <span>• {doc.upload_date}</span>
                      </div>
                    </div>
                    
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <a 
                        href={`http://127.0.0.1:5000/api/teacher/documents/${doc.id}/view`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="button button--secondary" 
                        style={{padding: '0.5rem 1rem', display: 'flex', alignItems: 'center'}}
                      >
                        View PDF
                      </a>
                      <button 
                        onClick={() => handleDelete(doc.id, doc.filename)} 
                        className="icon-button icon-button--danger" 
                        aria-label="Delete document"
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )
          )}
        </section>
      </div>
    </>
  );
}