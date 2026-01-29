import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Menu,
  X,
  Github,
  Download,
  Eye,
  Copy,
  Check,
  ChevronLeft,
  ExternalLink,
  ClipboardCopy,
  Archive,
  Terminal,
  Hash
} from 'lucide-react';
import { marked } from 'marked';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';
import SkillIcon from './SkillIcon';

SyntaxHighlighter.registerLanguage('python', python.default || python);
SyntaxHighlighter.registerLanguage('json', json.default || json);
SyntaxHighlighter.registerLanguage('bash', bash.default || bash);
SyntaxHighlighter.registerLanguage('md', markdown.default || markdown);

marked.setOptions({
  gfm: true,
  breaks: true,
});

const Dropdown = ({ trigger, items, onSelect, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-52 bg-[#12121a] border border-blue-500/20 rounded-lg shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150`}>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(item.action);
                setIsOpen(false);
              }}
              disabled={item.loading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-blue-500/5 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {item.loading ? (
                <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-gray-500">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InstallDropdown = ({ skill }) => {
  const [downloading, setDownloading] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const downloadFile = async (filename, content, isMarkdown = false) => {
    setDownloading(filename);
    try {
      const blob = new Blob([content], { type: isMarkdown ? 'text/markdown' : 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowToast(`${filename} downloaded!`);
    } catch (error) {
      setShowToast('Download failed');
    }
    setDownloading(null);
    setTimeout(() => setShowToast(null), 3000);
  };

  const downloadFullRepo = () => {
    setDownloading('full');
    window.open(`${skill.repository}/archive/refs/heads/main.zip`, '_blank');
    setShowToast('Downloading repository...');
    setTimeout(() => setShowToast(null), 3000);
  };

  const installItems = [
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Download SKILL.md',
      action: 'skillmd',
      loading: downloading === 'SKILL.md'
    },
    {
      icon: <Archive className="w-4 h-4" />,
      label: 'Download Full Directory',
      action: 'full',
      loading: downloading === 'full'
    }
  ];

  return (
    <>
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-blue-900/90 text-white px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 border border-blue-500/30">
          <Check className="w-4 h-4" />
          {showToast}
        </div>
      )}
      <Dropdown
        trigger={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-medium transition-all cursor-pointer shadow-lg shadow-blue-500/20">
            <Download className="w-4 h-4" />
            Download
            <ChevronDown className="w-4 h-4 opacity-70" />
          </button>
        }
        items={installItems}
        onSelect={(type) => {
          if (type === 'skillmd') {
             const skillMdContent = skill.files?.['SKILL.md']?.content; 
             if (skillMdContent) {
                 downloadFile('SKILL.md', skillMdContent, true);
             } else {
                 fetch(skill.repository.replace('github.com', 'raw.githubusercontent.com') + '/main/SKILL.md')
                    .then(r => r.text())
                    .then(t => downloadFile('SKILL.md', t, true));
             }
          } else {
            downloadFullRepo();
          }
        }}
      />
    </>
  );
};

const AICopyDropdown = ({ content, selectedFile }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium border border-blue-500/20 transition-all text-sm cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardCopy className="w-4 h-4" />
          Copy Page
        </>
      )}
    </button>
  );
};

const FileIcon = ({ name }) => {
  if (name.endsWith('.md')) return <FileText className="w-4 h-4 text-blue-400" />;
  if (name.endsWith('.py')) return <FileCode className="w-4 h-4 text-yellow-400" />;
  if (name.endsWith('.json')) return <FileCode className="w-4 h-4 text-green-400" />;
  return <FileText className="w-4 h-4 text-gray-500" />;
};

const useSkillContent = (skill) => {
  const [files, setFiles] = useState(skill.files || {});
  const [fetching, setFetching] = useState({});

  const fetchFile = async (path) => {
    if (files[path]) return;
    if (fetching[path]) return;

    setFetching(prev => ({ ...prev, [path]: true }));
    try {
      const url = skill.repository
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/')
        + `/main/${path}`;

      const response = await fetch(url);
      if (response.ok) {
        const content = await response.text();
        setFiles(prev => ({
          ...prev,
          [path]: { content, path }
        }));
      }
    } catch (err) {
      console.error(`Error fetching ${path}:`, err);
    } finally {
      setFetching(prev => ({ ...prev, [path]: false }));
    }
  };

  return { files, fetching, fetchFile };
};

const FileTreeNode = ({ node, level = 0, onSelect, selectedFile, path = '' }) => {
  const [isOpen, setIsOpen] = useState(level === 0 || (path && selectedFile?.path?.startsWith(path)));
  const currentPath = node.path || (path ? `${path}/${node.name}` : node.name);
  const isSelected = selectedFile?.path === currentPath;

  if (node.type === 'folder') {
    return (
      <div className="mb-0.5">
        <div 
          className="flex items-center gap-1.5 py-1.5 px-3 hover:bg-blue-500/5 cursor-pointer text-gray-500 hover:text-blue-400 transition-colors select-none text-sm group rounded-md mx-2"
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-blue-500/60 group-hover:text-blue-400 transition-colors" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-blue-500/60 group-hover:text-blue-400 transition-colors" />
          )}
          <Folder className="w-4 h-4 text-blue-500/60 group-hover:text-blue-400 transition-colors" />
          <span className="font-medium">{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div className="border-l border-white/5 ml-[22px]">
             {node.children.map((child) => (
              <FileTreeNode 
                key={child.path || child.name} 
                node={child} 
                level={level + 1} 
                onSelect={onSelect}
                selectedFile={selectedFile}
                path={currentPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`
        flex items-center gap-2 py-1.5 px-3 cursor-pointer text-sm transition-all duration-150 rounded-md mx-2 mb-0.5
        ${isSelected 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 border-r-2' 
          : 'border-r-2 border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
        }
      `}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      onClick={() => onSelect(node)}
    >
      <FileIcon name={node.name} />
      <span>{node.name}</span>
    </div>
  );
};

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!content) return;
    
    const lines = content.split('\n');
    const extractedHeadings = lines
      .filter(line => line.startsWith('#'))
      .map((line, index) => {
        const levelMatch = line.match(/^#+/);
        if (!levelMatch) return null;
        const level = levelMatch[0].length;
        const text = line.replace(/^#+\s+/, '').replace(/\*\*/g, '').replace(/`/g, '').trim();
        return { level, text, index };
      })
      .filter(Boolean);
    
    setHeadings(extractedHeadings);
  }, [content]);

  const scrollToHeading = (headingIndex) => {
    const headingEl = document.getElementById(`heading-${headingIndex}`);
    if (headingEl) {
      const offset = 120;
      const elementPosition = headingEl.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveIndex(headingIndex);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-72 flex-shrink-0 border-l border-white/5 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 custom-scrollbar bg-[#0B0C15]/50 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">On This Page</h3>
        <div className="space-y-1 relative">
           <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5"></div>
           
           {headings.map((heading, idx) => (
            <button
              key={idx}
              onClick={() => scrollToHeading(heading.index)}
              className={`
                block w-full text-left text-sm transition-all duration-200 pl-3 border-l-2 -ml-[1px] py-1
                ${activeIndex === heading.index 
                  ? 'border-blue-500 text-blue-400 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }
                ${heading.level > 2 ? 'ml-4' : ''}
              `}
            >
              {heading.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const assignIds = () => {
      const headings = containerRef.current.querySelectorAll('h1, h2, h3');
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
        heading.style.cursor = 'pointer';
        heading.onclick = () => {
          const offset = 120;
          const elementPosition = heading.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        };
      });
    };

    assignIds();
    
    const interval = setInterval(assignIds, 100);
    setTimeout(() => clearInterval(interval), 2000);
    
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="prose prose-invert max-w-none 
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
      prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-0
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-200
      prose-p:leading-7 prose-p:mb-6 prose-p:text-gray-300
      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-a:transition-colors
      prose-strong:text-white prose-strong:font-semibold
      prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-0 prose-pre:shadow-lg prose-pre:my-8
      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-300
      prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:marker:text-blue-500
      prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:marker:text-blue-500
      prose-li:my-2 prose-li:text-gray-300
      prose-img:rounded-xl prose-img:border prose-img:border-white/5 prose-img:shadow-xl prose-img:my-8"
    >
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: marked(content || '') }} />
    </div>
  );
};

const CodeViewer = ({ content, language, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/5 bg-[#0D1117] p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading file content...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/5 shadow-xl bg-[#0D1117] my-8 group">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-white/5">
        <div className="flex items-center gap-2">
           <Terminal className="w-4 h-4 text-gray-500" />
           <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-colors text-xs text-gray-400 hover:text-white cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="text-sm font-mono leading-relaxed">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
          showLineNumbers={true}
          lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#4b5563', textAlign: 'right' }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const HeaderCard = ({ skill }) => {
  return (
    <div className="mb-8 p-1 rounded-lg border border-blue-500/20">
      <div className="rounded-lg p-6 sm:p-7 bg-[#12121a] border border-white/5">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
          <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 flex-shrink-0">
            <SkillIcon name={skill.icon} className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-2">{skill.name}</h1>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-5">
              {skill.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <InstallDropdown skill={skill} />
              <a 
                href={skill.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all cursor-pointer"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-2.5 min-w-[140px] p-4 rounded-lg bg-[#0a0a0f] border border-white/5">
             <div className="flex items-center justify-between text-sm">
               <span className="text-gray-500 flex items-center gap-2">
                 <Eye className="w-4 h-4" /> Views
               </span>
               <span className="text-blue-400 font-mono">{skill.stats?.views?.toLocaleString()}</span>
             </div>
             <div className="flex items-center justify-between text-sm">
               <span className="text-gray-500 flex items-center gap-2">
                 <Download className="w-4 h-4" /> Installs
               </span>
               <span className="text-blue-400 font-mono">{skill.stats?.downloads?.toLocaleString()}</span>
             </div>
             <div className="w-full h-px bg-white/5 my-1"></div>
             <div className="text-xs text-gray-600 text-center">
               Updated recently
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SkillIDE({ skill }) {
  const { files, fetching, fetchFile } = useSkillContent(skill);
  const findFile = (nodes, name) => {
    for (const node of nodes) {
      if (node.name === name) return { ...node, path: node.path || name };
      if (node.children) {
        const found = findFile(node.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  const initialFile = findFile(skill.fileTree, 'SKILL.md') || skill.fileTree[0];
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      fetchFile(selectedFile.path);
    }
  }, [selectedFile]);

  const getFileContent = (file) => {
    if (!file) return '';
    const fileData = files[file.path];
    if (fileData) return fileData.content;
    return null;
  };

  const content = getFileContent(selectedFile);
  const extension = selectedFile?.name.split('.').pop() || '';
  const language = extension === 'py' ? 'python' : extension === 'json' ? 'json' : extension === 'md' ? 'md' : 'bash';
  const isLoadingFile = content === null && fetching[selectedFile?.path];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <button 
        className="lg:hidden fixed top-20 left-6 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-400 transition-colors cursor-pointer"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0a0a0f] border-r border-white/8 transform transition-transform duration-200 ease-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-14 flex items-center px-5 border-b border-white/8 bg-[#0a0a0f]">
          <span className="text-xs font-medium text-blue-500 uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-500" />
            Explorer
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-2 custom-scrollbar">
          {skill.fileTree.map((node) => (
            <FileTreeNode 
              key={node.name} 
              node={node} 
              onSelect={(file) => {
                setSelectedFile(file);
                setIsSidebarOpen(false);
              }}
              selectedFile={selectedFile}
            />
          ))}
        </div>
        
        <div className="p-4 border-t border-white/8 bg-[#0a0a0f]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">
               {skill.author?.substring(0,2).toUpperCase() || 'AU'}
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-sm font-medium text-gray-300 truncate">{skill.author || 'Author'}</div>
               <a href={skill.repository} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-400 truncate block">
                 @GitHub
               </a>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="h-14 border-b border-white/8 flex items-center justify-between px-4 sm:px-5 bg-[#0a0a0f]/95 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap mask-linear-fade">
            <button 
              className="text-gray-500 hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1 font-medium"
              onClick={() => setSelectedFile(findFile(skill.fileTree, 'SKILL.md'))}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{skill.name}</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-blue-400 flex items-center gap-2 font-medium bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 flex-shrink-0">
              <FileIcon name={selectedFile?.name || ''} />
              <span className="truncate max-w-[150px] sm:max-w-[200px]">{selectedFile?.name}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a 
              href={`${skill.repository}/blob/main/${selectedFile?.path}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            {content && <AICopyDropdown content={content} selectedFile={selectedFile} />}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          <div className="max-w-5xl mx-auto px-4 sm:px-5 py-5 sm:py-6">
            {selectedFile?.name === 'SKILL.md' && (
              <HeaderCard skill={skill} />
            )}

            <div className="min-h-[60vh] pb-20">
              {isLoadingFile ? (
                 <div className="flex items-center justify-center py-20">
                   <div className="flex items-center gap-3 text-blue-500">
                     <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                     Fetching from GitHub...
                   </div>
                 </div>
               ) : content ? (
                 <CodeViewer content={content} language={language} />
               ) : (
                 <div className="text-center py-20 text-gray-500">
                   Unable to load file content.
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {content && <TableOfContents content={content} />}
    </div>
  );
}
