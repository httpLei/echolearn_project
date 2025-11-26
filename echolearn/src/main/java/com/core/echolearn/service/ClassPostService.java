package com.core.echolearn.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.core.echolearn.entity.ClassPost;
import com.core.echolearn.entity.ClassReply;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.ClassPostRepository;
import com.core.echolearn.repository.ClassReplyRepository;
import com.core.echolearn.repository.SubjectRepository;
import com.core.echolearn.repository.UserRepository;

@Service
public class ClassPostService {
    
    @Autowired
    private ClassPostRepository classPostRepository;
    
    @Autowired
    private SubjectRepository subjectRepository; 
    
    @Autowired
    private ClassReplyRepository classReplyRepository;

    @Autowired
    private UserRepository userRepository; 

    public List<ClassPost> getPostsBySubject(Long subjectId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }

        List<ClassPost> posts = classPostRepository.findBySubjectAndIsDeletedFalseOrderByCreatedAtDesc(subjectOpt.get());
        
        for (ClassPost post : posts) {
            long replyCount = classReplyRepository.countByPostAndIsDeletedFalse(post);
        }

        return posts;
    }
    
    public ClassPost createPost(Long subjectId, Long authorId, String content) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }
        Optional<User> authorOpt = userRepository.findById(authorId);
        if (authorOpt.isEmpty()) {
            throw new IllegalArgumentException("Author not found");
        }

        ClassPost post = new ClassPost(subjectOpt.get(), authorOpt.get(), content);
        return classPostRepository.save(post);
    }

        public ClassReply createReply(Long postId, Long authorId, String content) {
            Optional<ClassPost> postOpt = classPostRepository.findById(postId);
            if (postOpt.isEmpty()) {
                throw new IllegalArgumentException("Post not found");
            }

            Optional<User> authorOpt = userRepository.findById(authorId);
            if (authorOpt.isEmpty()) {
                throw new IllegalArgumentException("Author not found");
            }
            
            ClassReply reply = new ClassReply(postOpt.get(), authorOpt.get(), content);
            return classReplyRepository.save(reply);
        }

        public List<ClassReply> getRepliesByPost(Long postId) {
            Optional<ClassPost> postOpt = classPostRepository.findById(postId);
            if (postOpt.isEmpty()) {
                throw new IllegalArgumentException("Post not found");
            }
            return classReplyRepository.findByPostAndIsDeletedFalseOrderByCreatedAtAsc(postOpt.get());
        }

        public boolean deletePost(Long postId) {
        Optional<ClassPost> postOpt = classPostRepository.findById(postId);
        if (postOpt.isPresent()) {
            ClassPost post = postOpt.get();
            post.setIsDeleted(true);
            post.setContent("[Post deleted]");
            classPostRepository.save(post);
            return true;
        }
        return false;
    }

    public ClassPost editPost(Long postId, String newContent) {
        Optional<ClassPost> postOpt = classPostRepository.findById(postId);
        if (postOpt.isPresent()) {
            ClassPost post = postOpt.get();
            post.setContent(newContent);
            classPostRepository.save(post);
            return post;
        }
        return null;
    }

    public boolean deleteReply(Long replyId) {
        Optional<ClassReply> replyOpt = classReplyRepository.findById(replyId);
        if (replyOpt.isPresent()) {
            ClassReply reply = replyOpt.get();
            reply.setIsDeleted(true);
            reply.setContent("[Reply deleted]");
            classReplyRepository.save(reply);
            return true;
        }
        return false;
    }

    public ClassReply editReply(Long replyId, String newContent) {
        Optional<ClassReply> replyOpt = classReplyRepository.findById(replyId);
        if (replyOpt.isPresent()) {
            ClassReply reply = replyOpt.get();
            reply.setContent(newContent);
            classReplyRepository.save(reply);
            return reply;
        }
        return null;
    }
    
}