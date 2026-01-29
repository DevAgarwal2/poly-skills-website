import React, { useState, useMemo } from 'react';
import SkillCard from './SkillCard.jsx';
import skills from '../data/skills.json';

const containerStyle = {
  minHeight: 'calc(100vh - 57px)',
  backgroundColor: '#0a0a0f',
  color: '#e5e5e5',
  paddingBottom: '40px'
};

const headerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '48px 24px 36px',
  textAlign: 'center'
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '5px 12px',
  borderRadius: '20px',
  backgroundColor: 'rgba(59, 130, 246, 0.08)',
  border: '1px solid rgba(59, 130, 246, 0.15)',
  color: '#60a5fa',
  fontSize: '12px',
  marginBottom: '20px',
  fontWeight: '500'
};

const titleStyle = {
  fontSize: 'clamp(28px, 6vw, 42px)',
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: '12px',
  letterSpacing: '-0.04em',
  lineHeight: 1.1
};

const descStyle = {
  fontSize: '15px',
  color: '#71717a',
  maxWidth: '520px',
  margin: '0 auto 28px',
  lineHeight: 1.5
};

const searchContainerStyle = {
  position: 'relative',
  maxWidth: '440px',
  margin: '0 auto',
  padding: '0 24px'
};

const searchInputStyle = {
  width: '100%',
  padding: '14px 16px 14px 48px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.08)',
  backgroundColor: 'rgba(255,255,255,0.03)',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s',
  fontWeight: '400'
};

const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px'
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  flexWrap: 'wrap',
  gap: '12px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '12px'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '60px 0'
};

export default function SkillsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredSkills = useMemo(() => {
    let result = [...skills];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div style={containerStyle} className="skills-directory">
      <div style={headerStyle}>
        <div style={badgeStyle}>
          <span style={{ position: 'relative', display: 'flex', height: '6px', width: '6px' }}>
            <span style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: '#60a5fa',
              opacity: 0.4,
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
            <span style={{
              position: 'relative',
              display: 'flex',
              borderRadius: '50%',
              height: '6px',
              width: '6px',
              backgroundColor: '#60a5fa'
            }} />
          </span>
          Supercharge your AI Agents
        </div>

        <h1 style={titleStyle}>
          <span style={{ color: '#60a5fa' }}>Polymarket</span>
          <span style={{ color: '#52525b', marginLeft: '10px' }}>Skills</span>
        </h1>

        <p style={descStyle}>
          The ultimate directory of MCP servers and tools for real-time prediction market data and trading automation.
        </p>

        <div style={searchContainerStyle}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '40px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg style={{ width: '18px', height: '18px', color: '#52525b' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, tools, and integrations..."
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              e.target.style.backgroundColor = 'rgba(255,255,255,0.03)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div style={contentStyle}>
        <div style={sectionHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#f4f4f5',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              {searchQuery ? 'Results' : 'Featured Skills'}
            </h2>
            <span style={{ fontSize: '11px', color: '#52525b' }}>
              {filteredSkills.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', padding: '3px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <button
              onClick={() => setSortBy('popular')}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: sortBy === 'popular' ? '#3b82f6' : 'transparent',
                color: sortBy === 'popular' ? '#fff' : '#71717a',
                fontWeight: '500',
                transition: 'all 0.15s'
              }}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('newest')}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: sortBy === 'newest' ? '#3b82f6' : 'transparent',
                color: sortBy === 'newest' ? '#fff' : '#71717a',
                fontWeight: '500',
                transition: 'all 0.15s'
              }}
            >
              Newest
            </button>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <svg style={{ width: '18px', height: '18px', color: '#52525b' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p style={{ color: '#71717a', fontSize: '13px', marginBottom: '8px' }}>
              No skills found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                color: '#60a5fa',
                fontSize: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        @media (max-width: 640px) {
          .skills-directory {
            padding-bottom: 32px !important;
          }

          .mobile-search-icon {
            left: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
