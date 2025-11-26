import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { classPostAPI, subjectAPI } from '../../services/api.js';
import '../css/ClassPage.css';

function ClassPage({ user, onLogout }) {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    
    const [subject, setSubject] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const postEndRef = useRef(null);

    const [replyTextMap, setReplyTextMap] = useState({});
    const [openReplies, setOpenReplies] = useState({});
    
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isEditingPostId, setIsEditingPostId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    
    const [isEditingReplyId, setIsEditingReplyId] = useState(null);
    const [editingReplyContent, setEditingReplyContent] = useState('');

    useEffect(() => {
        if (!user || !subjectId) return;
        fetchClassData();
    }, [user, subjectId]);

    useEffect(() => {
        postEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [posts]);

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
            } else {
                setError("Failed to load class feed.");
            }
        } catch (err) {
            console.error("Error fetching class data:", err);
            setError("Failed to connect to the class feed service.");
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

        try {
            const response = await classPostAPI.createPost(
                subjectId, 
                newPostContent, 
                user.id
            );

            if (response.data.success) {
                const newPost = response.data.data;
                newPost.author = { username: user.username, id: user.id }; 
                setPosts(prevPosts => [...prevPosts, newPost]);
                setNewPostContent('');
            } else {
                alert(response.data.message || 'Failed to create post.');
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
            const response = await classPostAPI.createReply(
                subjectId,
                postId,
                content,
                user.id
            );

            if (response.data.success) {
                const newReply = response.data.data;
                newReply.author = { username: user.username, id: user.id }; 
                
                setOpenReplies(prev => ({ 
                    ...prev, 
                    [postId]: [...(prev[postId] || []), newReply]
                }));
                
                setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
                
                if (!openReplies[postId]) {
                    fetchReplies(postId);
                }
            } else {
                alert(response.data.message || 'Failed to submit reply.');
            }
        } catch (error) {
            console.error('Error creating reply:', error);
            alert('Failed to submit reply. Check console for details.');
        }
    };
    
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
            } else {
                alert('Failed to update post.');
            }
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Failed to edit post.');
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        try {
            const response = await classPostAPI.deletePost(subjectId, postId);
            if (response.data.success) {
                setPosts(posts.filter(p => p.postId !== postId));
            } else {
                alert('Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post.');
        }
    };
    
    const handleEditReplyStart = (replyId, currentContent) => {
        setIsEditingReplyId(replyId);
        setEditingReplyContent(currentContent);
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
            } else {
                alert('Failed to update reply.');
            }
        } catch (error) {
            console.error('Error editing reply:', error);
            alert('Failed to edit reply.');
        }
    };
    
    const handleDeleteReply = async (postId, replyId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) return;
        
        try {
            const response = await classPostAPI.deleteReply(subjectId, postId, replyId);
            if (response.data.success) {
                setOpenReplies(prev => ({
                    ...prev,
                    [postId]: prev[postId].filter(r => r.replyId !== replyId)
                }));
            } else {
                alert('Failed to delete reply.');
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
            alert('Failed to delete reply.');
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    };

    const getAuthorName = (postOrReply) => {
        return postOrReply.author?.username || 'Unknown User';
    };
    
    const getAuthorAvatar = (postOrReply) => {
        return postOrReply.author?.username?.charAt(0).toUpperCase() || '?';
    };

    const isOwnPost = (authorId) => authorId === user.id;

    if (loading && !subject) {
        return <Layout user={user} onLogout={onLogout} activePage="dashboard"><div className="loading-message">Loading Class...</div></Layout>;
    }

    if (error) {
        return <Layout user={user} onLogout={onLogout} activePage="dashboard"><div className="error-message">{error}</div></Layout>;
    }

    return (
        <Layout user={user} onLogout={onLogout} activePage="dashboard">
            <div className="class-page-container">
                <div className="class-header">
                    <h1 className="class-title">{subject.subjectCode}: {subject.subjectName}</h1>
                    <p className="class-subtitle">Teacher: {subject.teacherUsername}</p>
                    <div className="class-nav">
                        <span className="nav-item active">Posts</span>
                        <span className="nav-item">Assignments</span>
                        <span className="nav-item">Grades</span>
                        <span className="nav-item">Files</span>
                    </div>
                </div>

                <div className="class-feed-content">
                    <div className="feed-posts-area">
                        {posts.map((post) => (
                            <div key={post.postId} className="post-and-reply-wrapper"> 
                                <div className="post-card">
                                    <div className="post-header">
                                        <div className="post-avatar">{getAuthorAvatar(post)}</div> 
                                        <div className="post-meta">
                                            <span className="post-author">{getAuthorName(post)}</span>
                                            <span className="post-time">{formatTime(post.createdAt)}</span>
                                        </div>
                                        {isOwnPost(post.author?.id) && (
                                            <div className="post-options-menu">
                                                <button className="menu-btn" onClick={() => setOpenMenuId(openMenuId === post.postId ? null : post.postId)}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                                                    </svg>
                                                </button>
                                                {openMenuId === post.postId && (
                                                    <div className="menu-dropdown">
                                                        <button className="menu-item" onClick={() => handleEditStart(post.postId, post.content)}>Edit</button>
                                                        <button className="menu-item delete-item" onClick={() => handleDelete(post.postId)}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="post-content-area"> 
                                        {isEditingPostId === post.postId ? (
                                            <div className="edit-form-wrapper">
                                                <textarea 
                                                    value={editingContent} 
                                                    onChange={(e) => setEditingContent(e.target.value)} 
                                                    className="edit-textarea"
                                                />
                                                <div className="edit-actions">
                                                    <button className="btn-save" onClick={() => handleEditSave(post.postId)} disabled={!editingContent.trim()}>Save</button>
                                                    <button className="btn-cancel" onClick={() => setIsEditingPostId(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="post-content-text">{post.content}</p>
                                        )}
                                        
                                        <div className="post-reply-actions-bar">
                                            <button 
                                                className="btn-link-action"
                                                onClick={() => handleReplyToggle(post.postId)}
                                            >
                                                {openReplies[post.postId] ? 'Hide Replies' : 'View Replies'}
                                            </button>
                                            <span className="action-separator">•</span>
                                            <span className="reply-count-display">
                                                {openReplies[post.postId]?.length || 0} replies
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <form className="reply-input-wrapper" onSubmit={(e) => handleReplySubmit(post.postId, e)}>
                                    <div className="reply-avatar">{user.username.charAt(0).toUpperCase()}</div>
                                    <input
                                        type="text"
                                        className="reply-input"
                                        placeholder="Add a class comment..."
                                        value={replyTextMap[post.postId] || ''}
                                        onChange={(e) => handleReplyTextChange(post.postId, e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        className="btn-reply-send" 
                                        disabled={!replyTextMap[post.postId]?.trim()}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </form>

                                {openReplies[post.postId] && (
                                    <div className="replies-thread-container">
                                        {openReplies[post.postId].map(reply => (
                                            <div key={reply.replyId} className="reply-card-item">
                                                <div className="reply-card-avatar">{getAuthorAvatar(reply)}</div>
                                                <div className="reply-card-body">
                                                    <div className="reply-card-meta">
                                                        {isEditingReplyId === reply.replyId ? (
                                                            <div className="edit-reply-form">
                                                                <textarea 
                                                                    value={editingReplyContent} 
                                                                    onChange={(e) => setEditingReplyContent(e.target.value)} 
                                                                    className="edit-reply-textarea"
                                                                />
                                                                <div className="edit-reply-actions">
                                                                    <button className="btn-save" onClick={() => handleEditReplySave(post.postId, reply.replyId)} disabled={!editingReplyContent.trim()}>Save</button>
                                                                    <button className="btn-cancel" onClick={() => setIsEditingReplyId(null)}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className="reply-card-author">{getAuthorName(reply)}</span>
                                                                <span className="reply-card-time">{formatTime(reply.createdAt)}</span>
                                                            </>
                                                        )}
                                                        
                                                        {isOwnPost(reply.author?.id) && isEditingReplyId !== reply.replyId && (
                                                            <>
                                                                <button className="edit-reply-btn" onClick={() => handleEditReplyStart(reply.replyId, reply.content)}>Edit</button>
                                                                <button className="delete-reply-btn" onClick={() => handleDeleteReply(post.postId, reply.replyId)}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                    {isEditingReplyId !== reply.replyId && (
                                                        <p className="reply-card-content">{reply.content}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={postEndRef} />
                    </div>

                    <div className="feed-input-area">
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                className="post-textarea"
                                placeholder="Share something with your class..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                rows="3"
                            />
                            <div className="post-actions-bar">
                                <button type="submit" className="btn-post" disabled={!newPostContent.trim()}>
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ClassPage;