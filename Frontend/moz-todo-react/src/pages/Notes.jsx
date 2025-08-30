import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Trash2 } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get('https://placement-records.onrender.com/api/notes');
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(token && adminStatus === 'true');

    fetchNotes();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`https://placement-records.onrender.com/notes/${noteId}`);
        setNotes(notes.filter(note => note._id !== noteId));
        showToast('Note deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Failed to delete note', 'error');
      }
    }
  };

  const handleDownload = (pdfUrl, title) => {
    const link = document.createElement('a');
    link.href = `https://placement-records.onrender.com${pdfUrl}`;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-green-500 mb-6 text-left">Study Notes</h1>

        {loading ? (
          <div className="text-center text-gray-400">Loading notes...</div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative">

                {/* Delete Button - Top Right Corner */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Note Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">{note.title}</h3>
                </div>

                {/* Upload Date */}
                <div className="text-gray-400 text-sm mb-4">
                  Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(note.pdfUrl, note.title)}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>No notes available at the moment.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notes;
