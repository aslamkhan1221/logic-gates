import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  PenTool,
  HelpCircle,
  BookOpen,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTab = 'dashboard' | 'simulator' | 'practice' | 'quiz' | 'exam-notes' | 'previous-papers' | 'settings';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ExamNotesSidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'simulator', label: 'Simulator', icon: <Cpu size={18} /> },
    { id: 'practice', label: 'Practice', icon: <PenTool size={18} /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={18} /> },
    { id: 'exam-notes', label: 'Exam Notes', icon: <BookOpen size={18} />, badge: '⭐ NEW' },
    { id: 'previous-papers', label: 'Previous Papers', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="app-sidebar" style={{
      width: isCollapsed ? '64px' : '230px',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid var(--border-color, rgba(255,255,255,0.1))',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 40,
      flexShrink: 0,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header Brand */}
      <div className="sidebar-header" style={{
        padding: isCollapsed ? '16px 8px' : '16px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(56,189,248,0.4)',
            }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
                Digital Prep
              </div>
              <div style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700 }}>
                Visual Learning Mode
              </div>
            </div>
          </div>
        )}

        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '8px',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav" style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                gap: '10px',
                width: '100%',
                padding: isCollapsed ? '10px 0' : '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(2,132,199,0.35)' : 'none',
              }}
            >
              <div className="sidebar-item-inner" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="sidebar-icon" style={{ color: isActive ? '#fff' : '#94a3b8' }}>{item.icon}</span>
                {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="sidebar-badge" style={{
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  boxShadow: '0 2px 6px rgba(245,158,11,0.4)',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="sidebar-footer" style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.68rem', color: '#64748b', textAlign: 'center' }}>
          Shri Shivaji Polytechnic · ET3K
        </div>
      )}
    </aside>
  );

};
