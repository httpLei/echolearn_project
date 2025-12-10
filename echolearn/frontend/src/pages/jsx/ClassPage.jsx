import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import ClassAssignments from '../../components/ClassAssignments.jsx';
import { classPostAPI, subjectAPI } from '../../services/api.js';
import '../css/ClassPage.css';

// Helper function to render formatted text
const renderFormattedText = (text) => {
    if (!text) return '';
    
    // Split by newlines to preserve line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
        // Process formatting in order: bold, italic, underline
        const parts = [];
        let remaining = line;
        let key = 0;
        
        while (remaining.length > 0) {
            // Check for bold **text**
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            if (boldMatch && boldMatch.index === 0) {
                parts.push(<strong key={`${lineIndex}-${key++}`}>{boldMatch[1]}</strong>);
                remaining = remaining.slice(boldMatch[0].length);
                continue;
            }
            
            // Check for italic *text*
            const italicMatch = remaining.match(/\*(.+?)\*/);
            if (italicMatch && italicMatch.index === 0) {
                parts.push(<em key={`${lineIndex}-${key++}`}>{italicMatch[1]}</em>);
                remaining = remaining.slice(italicMatch[0].length);
                continue;
            }
            
            // Check for underline __text__
            const underlineMatch = remaining.match(/__(.+?)__/);
            if (underlineMatch && underlineMatch.index === 0) {
                parts.push(<u key={`${lineIndex}-${key++}`}>{underlineMatch[1]}</u>);
                remaining = remaining.slice(underlineMatch[0].length);
                continue;
            }
            
            // Find next formatting marker or take rest of string
            const nextMarker = remaining.search(/\*\*|\*|__/);
            if (nextMarker === -1) {
                parts.push(remaining);
                remaining = '';
            } else {
                parts.push(remaining.slice(0, nextMarker));
                remaining = remaining.slice(nextMarker);
            }
        }
        
        return (
            <React.Fragment key={lineIndex}>
                {parts}
                {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
        );
    });
};

function ClassPage({ user, onLogout }) {
    const { subjectId } = useParams();
    const feedEndRef = useRef(null); 
    
    const [subject, setSubject] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');

    const [replyTextMap, setReplyTextMap] = useState({});
    const [openReplies, setOpenReplies] = useState({});
    
    // UI State
    const [openMenuId, setOpenMenuId] = useState(null);
    const [openReplyMenuId, setOpenReplyMenuId] = useState(null); 
    const [isEditingPostId, setIsEditingPostId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [isEditingReplyId, setIsEditingReplyId] = useState(null);
    const [editingReplyContent, setEditingReplyContent] = useState('');
    const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);
    const [isEditPostExpanded, setIsEditPostExpanded] = useState(false);
    const [isEditReplyExpanded, setIsEditReplyExpanded] = useState(false);

    // ⭐️ NEW: Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ 
        isOpen: false, 
        type: null, // 'post' or 'reply'
        id: null,   // id of item to delete
        postId: null // parent post id (only needed for replies)
    });

    useEffect(() => {
        if (!user || !subjectId) return;
        fetchClassData();
    }, [user, subjectId]);

    useEffect(() => {
        if (activeTab === 'posts') {
            feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [posts, activeTab]);

    const fetchClassData = async () => {
        setLoading(true);
        try {
            const subjectResponse = await subjectAPI.getById(subjectId, user.id, user.role);
            if (subjectResponse.data.success) {
                setSubject(subjectResponse.data.data);
            } else {
                setError("Failed to load class details.");
                return;
            }

            const postsResponse = await classPostAPI.getFeed(subjectId);
            if (postsResponse.data.success) {
                setPosts(postsResponse.data.data.reverse()); 
            }
        } catch (err) {
            console.error("Error fetching class data:", err);
            setError("Failed to connect.");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchReplies = async (postId) => {
        try {
            const response = await classPostAPI.getReplies(subjectId, postId);
            if (response.data.success) {
                setOpenReplies(prev => ({ ...prev, [postId]: response.data.data }));
            }
        } catch (err) {
            console.error('Error fetching replies:', err);
        }
    };

    const handleReplyToggle = (postId) => {
        if (openReplies[postId]) {
            setOpenReplies(prev => {
                const newState = { ...prev };
                delete newState[postId];
                return newState;
            });
        } else {
            fetchReplies(postId);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        const fullContent = newPostTitle.trim() 
            ? `**${newPostTitle.trim()}**\n\n${newPostContent}` 
            : newPostContent;

        try {
            const response = await classPostAPI.createPost(subjectId, fullContent, user.id);
            if (response.data.success) {
                const newPost = response.data.data;
                newPost.author = { username: user.username, id: user.id }; 
                setPosts(prevPosts => [...prevPosts, newPost]); 
                setNewPostContent('');
                setNewPostTitle('');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to submit post.');
        }
    };

    const handleReplyTextChange = (postId, text) => {
        setReplyTextMap(prev => ({ ...prev, [postId]: text }));
    };

    const handleReplySubmit = async (postId, e) => {
        e.preventDefault();
        const content = replyTextMap[postId];
        if (!content || !content.trim()) return;
        
        try {
            const response = await classPostAPI.createReply(subjectId, postId, content, user.id);
            if (response.data.success) {
                const newReply = response.data.data;
                newReply.author = { username: user.username, id: user.id }; 
                
                setOpenReplies(prev => ({ 
                    ...prev, 
                    [postId]: [...(prev[postId] || []), newReply]
                }));
                setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
                
                if (!openReplies[postId]) fetchReplies(postId);
            }
        } catch (error) {
            console.error('Error creating reply:', error);
            alert('Failed to submit reply.');
        }
    };
    
    // --- EDIT HANDLERS ---
    const handleEditStart = (postId, currentContent) => {
        setIsEditingPostId(postId);
        setEditingContent(currentContent);
        setOpenMenuId(null);
    };

    const handleEditSave = async (postId) => {
        if (!editingContent.trim()) return;
        try {
            const response = await classPostAPI.editPost(subjectId, postId, editingContent);
            if (response.data.success) {
                setPosts(posts.map(p => p.postId === postId ? { ...p, content: response.data.data.content } : p));
                setIsEditingPostId(null);
                setEditingContent('');
            }
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Failed to edit post.');
        }
    };

    const handleEditReplyStart = (replyId, currentContent) => {
        setIsEditingReplyId(replyId);
        setEditingReplyContent(currentContent);
        setOpenReplyMenuId(null);
    };

    const handleEditReplySave = async (postId, replyId) => {
        if (!editingReplyContent.trim()) return;
        try {
            const response = await classPostAPI.editReply(subjectId, postId, replyId, editingReplyContent);
            if (response.data.success) {
                setOpenReplies(prev => ({
                    ...prev,
                    [postId]: prev[postId].map(r => r.replyId === replyId ? { ...r, content: response.data.data.content } : r)
                }));
                setIsEditingReplyId(null);
                setEditingReplyContent('');
            }
        } catch (error) {
            console.error('Error editing reply:', error);
            alert('Failed to edit reply.');
        }
    };

    // --- ⭐️ DELETE HANDLERS (Open Modal) ---
    const openDeletePostModal = (postId) => {
        setDeleteModal({ isOpen: true, type: 'post', id: postId });
        setOpenMenuId(null); // Close dropdown
    };

    const openDeleteReplyModal = (postId, replyId) => {
        setDeleteModal({ isOpen: true, type: 'reply', id: replyId, postId: postId });
        setOpenReplyMenuId(null); // Close dropdown
    };

    const confirmDelete = async () => {
        const { type, id, postId } = deleteModal;
        
        try {
            if (type === 'post') {
                const response = await classPostAPI.deletePost(subjectId, id);
                if (response.data.success) {
                    setPosts(posts.filter(p => p.postId !== id));
                }
            } else if (type === 'reply') {
                const response = await classPostAPI.deleteReply(subjectId, postId, id);
                if (response.data.success) {
                    setOpenReplies(prev => ({
                        ...prev,
                        [postId]: prev[postId].filter(r => r.replyId !== id)
                    }));
                }
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert(`Failed to delete ${type}.`);
        } finally {
            setDeleteModal({ isOpen: false, type: null, id: null, postId: null });
        }
    };

    // --- HELPERS ---
    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    };

    const isOwnPost = (authorId) => authorId === user.id;
    const getAuthorAvatar = (p) => p.author?.username?.charAt(0).toUpperCase();
    const getAuthorName = (p) => p.author?.username;

    if (loading && !subject) return <Layout user={user} onLogout={onLogout} activePage="dashboard"><div className="loading-message">Loading Class...</div></Layout>;
    if (error) return <Layout user={user} onLogout={onLogout} activePage="dashboard"><div className="error-message">{error}</div></Layout>;

    return (
        <Layout user={user} onLogout={onLogout} activePage="dashboard">
            <div className="class-page-container">
                
                {/* 1. FIXED HEADER */}
                <div className="class-header-section">
                    <div className="class-title-block">
                        <h1>{subject.subjectCode}: {subject.subjectName}</h1>
                        <p>Teacher: {subject.teacherUsername}</p>
                    </div>
                    
                    <div className="class-nav-tabs">
                        <div className={`nav-tab-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</div>
                        <div className={`nav-tab-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>Assignments</div>
                    </div>
                </div>

                {/* 2. BODY AREA */}
                <div className="class-scrollable-body">
                    
                    {activeTab === 'posts' && (
                        <>
                            <div className="feed-scroll-area">
                                <div className="feed-container">
                                    {posts.map((post) => (
                                        <div key={post.postId} className="post-card">
                                            <div className="post-header">
                                                <div className="post-author-info">
                                                    <div className="post-avatar">{getAuthorAvatar(post)}</div>
                                                    <div className="post-meta-text">
                                                        <span className="post-author-name">{getAuthorName(post)}</span>
                                                        <span className="post-timestamp">{formatTime(post.createdAt)}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* POST MENU */}
                                                {isOwnPost(post.author?.id) && (
                                                    <div className="post-options-wrapper">
                                                        <button className="btn-options" onClick={() => setOpenMenuId(openMenuId === post.postId ? null : post.postId)}>•••</button>
                                                        {openMenuId === post.postId && (
                                                            <div className="options-dropdown">
                                                                <button className="dropdown-item" onClick={() => handleEditStart(post.postId, post.content)}>Edit</button>
                                                                {/* ⭐️ Use Modal Trigger */}
                                                                <button className="dropdown-item delete" onClick={() => openDeletePostModal(post.postId)}>Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* POST CONTENT OR EDIT FORM */}
                                            {isEditingPostId === post.postId ? (
                                                <div className="edit-mode-container">
                                                    <div className="textarea-container">
                                                        <textarea 
                                                            className={`edit-textarea ${isEditPostExpanded ? 'expanded' : ''}`}
                                                            value={editingContent} 
                                                            onChange={(e) => setEditingContent(e.target.value)}
                                                        />
                                                        <button 
                                                            type="button" 
                                                            className="btn-expand-textarea"
                                                            onClick={() => setIsEditPostExpanded(!isEditPostExpanded)}
                                                            title={isEditPostExpanded ? "Collapse" : "Expand"}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                {isEditPostExpanded ? (
                                                                    <path d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7"/>
                                                                ) : (
                                                                    <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"/>
                                                                )}
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <button className="btn-save-edit" onClick={() => handleEditSave(post.postId)}>Save</button>
                                                    <button className="btn-cancel-edit" onClick={() => setIsEditingPostId(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="post-content-text">{renderFormattedText(post.content)}</div>
                                            )}

                                            <div className="post-footer-actions">
                                                <button className="btn-text-action" onClick={() => handleReplyToggle(post.postId)}>
                                                    {openReplies[post.postId] ? 'Hide Replies' : `${openReplies[post.postId]?.length || 'View'} Replies`}
                                                </button>
                                            </div>
                                            
                                            {/* REPLIES AREA */}
                                            {openReplies[post.postId] && (
                                                <div className="replies-section">
                                                    {openReplies[post.postId].map(reply => (
                                                        <div key={reply.replyId} className="reply-item">
                                                            <div className="reply-avatar-small">{getAuthorAvatar(reply)}</div>
                                                            <div className="reply-content-box">
                                                                <div className="reply-header" style={{justifyContent: 'space-between'}}>
                                                                    <div>
                                                                        <span className="reply-author">{getAuthorName(reply)}</span>
                                                                        <span className="reply-time" style={{marginLeft:'8px'}}>{formatTime(reply.createdAt)}</span>
                                                                    </div>
                                                                    
                                                                    {/* REPLY MENU */}
                                                                    {isOwnPost(reply.author?.id) && (
                                                                        <div className="post-options-wrapper">
                                                                            <button className="btn-options" style={{fontSize:'12px'}} onClick={() => setOpenReplyMenuId(openReplyMenuId === reply.replyId ? null : reply.replyId)}>•••</button>
                                                                            {openReplyMenuId === reply.replyId && (
                                                                                <div className="options-dropdown">
                                                                                    <button className="dropdown-item" onClick={() => handleEditReplyStart(reply.replyId, reply.content)}>Edit</button>
                                                                                    {/* ⭐️ Use Modal Trigger */}
                                                                                    <button className="dropdown-item delete" onClick={() => openDeleteReplyModal(post.postId, reply.replyId)}>Delete</button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {isEditingReplyId === reply.replyId ? (
                                                                    <div className="edit-mode-container">
                                                                        <div className="textarea-container">
                                                                            <textarea 
                                                                                className={`edit-textarea ${isEditReplyExpanded ? 'expanded' : ''}`}
                                                                                value={editingReplyContent} 
                                                                                onChange={(e) => setEditingReplyContent(e.target.value)}
                                                                            />
                                                                            <button 
                                                                                type="button" 
                                                                                className="btn-expand-textarea"
                                                                                onClick={() => setIsEditReplyExpanded(!isEditReplyExpanded)}
                                                                                title={isEditReplyExpanded ? "Collapse" : "Expand"}
                                                                            >
                                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                                    {isEditReplyExpanded ? (
                                                                                        <path d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7"/>
                                                                                    ) : (
                                                                                        <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"/>
                                                                                    )}
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                        <button className="btn-save-edit" onClick={() => handleEditReplySave(post.postId, reply.replyId)}>Save</button>
                                                                        <button className="btn-cancel-edit" onClick={() => setIsEditingReplyId(null)}>Cancel</button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="reply-text">{renderFormattedText(reply.content)}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    <form className="reply-input-row" onSubmit={(e) => handleReplySubmit(post.postId, e)}>
                                                        <input 
                                                            type="text" 
                                                            className="reply-input-field" 
                                                            placeholder="Write a reply..."
                                                            value={replyTextMap[post.postId] || ''}
                                                            onChange={(e) => handleReplyTextChange(post.postId, e.target.value)}
                                                        />
                                                        <button type="submit" className="btn-send-icon">➤</button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={feedEndRef} />
                                </div>
                            </div>

                            {/* FIXED INPUT FOOTER */}
                            <div className="feed-input-footer">
                                <form className="feed-input-wrapper" onSubmit={handlePostSubmit}>
                                    <div className="post-input-full">
                                        {/* Title Input */}
                                        <input
                                            type="text"
                                            className="post-title-input"
                                            placeholder="Add a subject (optional)"
                                            value={newPostTitle}
                                            onChange={(e) => setNewPostTitle(e.target.value)}
                                        />
                                        
                                        {/* Formatting Toolbar */}
                                        <div className="formatting-toolbar">
                                            <button 
                                                type="button" 
                                                className="format-btn" 
                                                onClick={() => {
                                                    const textarea = document.querySelector('.post-textarea');
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const selectedText = newPostContent.substring(start, end);
                                                    const newText = newPostContent.substring(0, start) + `**${selectedText}**` + newPostContent.substring(end);
                                                    setNewPostContent(newText);
                                                }}
                                                title="Bold"
                                            >
                                                <strong>B</strong>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="format-btn" 
                                                onClick={() => {
                                                    const textarea = document.querySelector('.post-textarea');
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const selectedText = newPostContent.substring(start, end);
                                                    const newText = newPostContent.substring(0, start) + `*${selectedText}*` + newPostContent.substring(end);
                                                    setNewPostContent(newText);
                                                }}
                                                title="Italic"
                                            >
                                                <em>I</em>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="format-btn" 
                                                onClick={() => {
                                                    const textarea = document.querySelector('.post-textarea');
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const selectedText = newPostContent.substring(start, end);
                                                    const newText = newPostContent.substring(0, start) + `__${selectedText}__` + newPostContent.substring(end);
                                                    setNewPostContent(newText);
                                                }}
                                                title="Underline"
                                            >
                                                <u>U</u>
                                            </button>
                                        </div>
                                        
                                        {/* Textarea Container */}
                                        <div className="textarea-container">
                                            <textarea
                                                className={`post-textarea ${isTextareaExpanded ? 'expanded' : ''}`}
                                                placeholder={`Message ${subject.subjectCode}...`}
                                                value={newPostContent}
                                                onChange={(e) => setNewPostContent(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handlePostSubmit(e);
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="button" 
                                                className="btn-expand-textarea"
                                                onClick={() => setIsTextareaExpanded(!isTextareaExpanded)}
                                                title={isTextareaExpanded ? "Collapse" : "Expand"}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    {isTextareaExpanded ? (
                                                        <path d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7"/>
                                                    ) : (
                                                        <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"/>
                                                    )}
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-send-post" disabled={!newPostContent.trim()}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {activeTab === 'assignments' && (
                        <div style={{padding: '30px', overflowY: 'auto', flex: 1}}>
                            <ClassAssignments user={user} subjectId={subjectId} subjectCode={subject.subjectCode} />
                        </div>
                    )}
                </div>
            </div>

            {deleteModal.isOpen && (
                <div className="delete-modal-overlay" onClick={() => setDeleteModal({...deleteModal, isOpen: false})}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </div>
                        <h3 className="delete-modal-title">Delete {deleteModal.type === 'post' ? 'Post' : 'Reply'}?</h3>
                        <p className="delete-modal-text">
                            Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.
                        </p>
                        <div className="delete-modal-actions">
                            <button className="btn-modal-cancel" onClick={() => setDeleteModal({...deleteModal, isOpen: false})}>Cancel</button>
                            <button className="btn-modal-delete" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default ClassPage;