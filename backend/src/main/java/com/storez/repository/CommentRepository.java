package com.storez.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.storez.model.Comment;
public interface CommentRepository extends JpaRepository<Comment, Long> {

}
