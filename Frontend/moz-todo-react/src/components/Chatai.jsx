import { useState } from "react";
import axios from "axios";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Send, ExternalLink, Youtube, Globe, BookOpen } from "lucide-react";


const Chatai = ({token}) => {
    const [input, setInput] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError(null);
        try {
        const response = await axios.post(
            "http://localhost:5000/api/chat/message",
            { message: input },
            {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            }
        );
        setReply(response.data.reply);
        setInput("");
        } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch response");
        }
        setLoading(false);
    };

  const customComponents = {
    a: ({ href, children }) => {
      const isYoutube = href?.includes('youtube.com') || href?.includes('youtu.be');
      const isWebsite = href?.startsWith('http');
      
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 underline transition"
        >
          {isYoutube && <Youtube className="w-4 h-4" />}
          {isWebsite && !isYoutube && <Globe className="w-4 h-4" />}
          {children}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-green-500 mb-4 border-b border-gray-700 pb-2">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-green-400 mb-3 mt-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium text-white mb-2 mt-4">{children}</h3>
    ),
    ul: ({ children }) => (
      <ul className="list-none space-y-2 ml-4">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-2">
        <span className="text-green-500 mt-1">•</span>
        <span>{children}</span>
      </li>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-300">{children}</ol>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
    ),
    code: ({ children, className }) => {
      const isBlock = className?.includes('language-');
      return isBlock ? (
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
          <code className="text-green-400 text-sm">{children}</code>
        </pre>
      ) : (
        <code className="bg-gray-800 px-2 py-1 rounded text-green-400 text-sm">{children}</code>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-green-500 pl-4 py-2 bg-gray-800/50 rounded-r-lg mb-4 italic">
        {children}
      </blockquote>
    )
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            AI Career Assistant
          </h2>
          
          <div className="space-y-4">
            <textarea
              className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 outline-none resize-none"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about career guidance, roadmaps, resources, or any tech-related questions..."
            />
            
            <button
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={!input.trim() || loading}
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {reply && (
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                components={customComponents}
              >
                {reply}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatai