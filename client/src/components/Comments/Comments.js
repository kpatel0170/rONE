import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, TextField, Avatar, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import styles from "./Comments.module.css";

import { useSelector, useDispatch } from 'react-redux';
import { createComment } from '../../features/Post/PostSlice';

const Comment = (comment) => {  
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth)
    const scrollCommentRef = useRef(null);

    const { isCommentLoading } = useSelector(
        (state) => state.post
    )

    const [commentInput, setCommentInput] = useState('');
    const isEmpty = commentInput.trim().length === 0;
    const [firstTimeDisplay, setFirstTimeDisplay] = useState(true); 
    const [isReadMore, setIsReadMore]= useState(true);

    const commentInputHandler = (event) => {
        setCommentInput(event.target.value)
    }

    const readMoreHandler = () => {
        setIsReadMore(!isReadMore)
    }

    const submitCommentHandler = (event) => {
        event.preventDefault(event);
        console.log(comment.comment)
        console.log(comment.comment.comments)

        const data = {
            'id': comment.comment._id,
            'userId': user.data._id,
            'commentInput': commentInput
        }  
        dispatch(createComment(data))
        setCommentInput("");
        setFirstTimeDisplay(false);
    }

    useEffect(() => {
        if (!firstTimeDisplay && scrollCommentRef.current) { // Scroll after comment success
            scrollCommentRef.current.scrollTop = scrollCommentRef.current.scrollHeight;
        }
      }, [comment.comment.comments, firstTimeDisplay]);

    return(
        <Box sx={{ borderTop: 1, borderColor: '#dcdcdc', paddingTop: 3}}>
            <form onSubmit={submitCommentHandler}>
                <Box sx={{ display: 'flex', position: 'relative' }}>
                    <TextField 
                        id="commentInput" 
                        name="commentInput"
                        type="text"
                        value={commentInput} 
                        onChange={commentInputHandler}
                        placeholder="Write your comment ..."
                        sx={{width:1}}
                        className={styles.form_wrap}
                        />
                    <Button disabled={isEmpty} type="submit" sx={{position: 'absolute', right: '10px', top: '10px'}} className={styles.send_btn_wrap}>                        
                        <SendIcon />
                    </Button>
                </Box>
            </form>
            
            {comment.comment.comments.length != 0 ? (
                <>
                <Box ref={scrollCommentRef} sx={{marginTop: 2, paddingRight: '20px'}} className={styles.comment_container}>
                    {comment.comment.comments.map((data) => (
                        <Box className={styles.comment_items} key={data._id} sx={{marginBottom: 2, borderRadius: 2, padding: 2, background: '#e6e7ee'}}>
                            <Box sx={{marginBottom: 1}}>
                                {data.comment.length > 250 ?
                                    <>
                                    {isReadMore ? (
                                        <>
                                            <Typography sx={{fontSize: '0.875rem', lineHeight: '1.3', color: '#6e6f78'}}>
                                                {data.comment.slice(0, 250) + `...` } 
                                                <span onClick={readMoreHandler} className={styles.readmore}> read more</span>
                                            </Typography>
                                        </>
                                    ) :                                 
                                    (
                                        <>
                                            <Typography sx={{fontSize: '0.875rem', lineHeight: '1.3', color: '#6e6f78'}}>
                                                {data.comment}
                                                <span onClick={readMoreHandler} className={styles.readmore}> read less</span>
                                            </Typography>
                                        </>
                                    )}
                                </> 
                            : 
                                <Typography sx={{fontSize: '0.875rem', lineHeight: '1.3', color: '#6e6f78'}}>
                                    {data.comment}
                                </Typography>
                            } 
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                                {/* <Avatar
                                    alt="Remy Sharp"
                                    src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80"
                                    sx={{ width: 27, height: 27 }}
                                /> */}
                                {data.userId?.profilePicture.length != 0 ?                                     
                                    (
                                        <Avatar sx={{width: 27, height: 27}} alt="profile" src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80" />
                                    ) :
                                    (   <>
                                            <Box sx={{background: '#f3f3f3', width: '27px', height: '27px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
                                                <PersonOutlineIcon />
                                            </Box>
                                        </>
                                    )
                                }
                                <Typography variant="subtitle1" sx={{fontWeight: '500', pr: 1, pl: 1, color: '#5f6069'}}>{data.userId.name}</Typography>
                                <Box sx={{width: '3px', height: '3px', background: '#95969c', borderRadius: '50%'}}></Box>
                                <Typography variant="subtitle1" sx={{fontSize: '0.8rem', lineHeight: '2.2', pl: 1}}>{data.at.slice(0, 10)}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
                {isCommentLoading && <Box> 
                    <Typography variant='caption' sx={{color: '#1976d2'}}> loading ... </Typography>
                </Box>}
                </>
            ) : (
                <Typography sx={{marginTop: 2, textAlign: 'center', fontSize: '0.85rem', color: '#635e5e'}}>
                    <span>Hey {user.data.name}, </span>
                    be the first person to comment the post ...
                </Typography>
            )}
            
        </Box>
    )
}
export default Comment;