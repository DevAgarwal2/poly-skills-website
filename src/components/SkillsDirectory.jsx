import React, { useState, useMemo } from 'react';
import SkillCard from './SkillCard.jsx';
import Hero from './Hero.jsx';
import skills from '../data/skills.json';

const containerStyle = {
  minHeight: 'calc(100vh - 57px)',
  backgroundColor: '#0a0a0a',
  color: '#e5e5e5',
  paddingBottom: '60px'
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
  maxWidth: '600px',
  margin: '0 auto',
  padding: '0 24px'
};

const searchInputStyle = {
  width: '100%',
  padding: '16px 20px 16px 52px',
  borderRadius: '10px',
  border: '1px solid #2f2f2f',
  backgroundColor: '#141414',
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
  marginBottom: '24px',
  paddingBottom: '16px',
  borderBottom: '1px solid #1f1f1f',
  flexWrap: 'wrap',
  gap: '16px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px'
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
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px 60px'
      }}>
        <div style={searchContainerStyle}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '44px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg style={{ width: '20px', height: '20px', color: '#6f6f6f' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3f3f3f';
              e.target.style.backgroundColor = '#1a1a1a';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#2f2f2f';
              e.target.style.backgroundColor = '#141414';
            }}
          />
        </div>
      </div>

      <div style={contentStyle}>
        <div style={sectionHeaderStyle} id="skills">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              {searchQuery ? 'Search Results' : 'All Skills'}
            </h2>
            <span style={{ fontSize: '14px', color: '#6f6f6f' }}>
              {filteredSkills.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', padding: '4px', backgroundColor: '#141414', borderRadius: '8px', border: '1px solid #2f2f2f' }}>
            <button
              onClick={() => setSortBy('popular')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: sortBy === 'popular' ? '#ffffff' : 'transparent',
                color: sortBy === 'popular' ? '#000' : '#a0a0a0',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('newest')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: sortBy === 'newest' ? '#ffffff' : 'transparent',
                color: sortBy === 'newest' ? '#000' : '#a0a0a0',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Newest
            </button>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: '#141414',
              border: '1px solid #2f2f2f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#6f6f6f' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '15px', marginBottom: '12px' }}>
              No skills found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                color: '#ffffff',
                fontSize: '14px',
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
