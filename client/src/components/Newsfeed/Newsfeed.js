import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Collapse,
  Menu,
  MenuItem, ListItem, ListItemButton, ListItemText, ListItemIcon
} from "@mui/material";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNavigate } from 'react-router-dom';

import Comment from "../../components/Comments/Comments";
import Slider2 from "../Slider2/Slider2";
import PostForm from "../Post/PostForm";
import styles from "./Newsfeed.module.css";

import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { selectNavigation, setCurrentPage } from '../../features/Nav/NavSlice';
import {
  deletePost,
  likePost,
  disLikePost,
  selectPost,
  restSelectPost
} from "../../features/Post/PostSlice";
import { openDrawer, closeDrawer } from '../../features/Home/HomeSlice';
import { reset, setUser } from '../../features/User/UserSlice';
import { toast, Slide } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "38%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

function Newsfeed(post) {  
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLikeLoading } = useSelector((state) => state.post);
  const currentPostID1 = useSelector((state) => state.post.selectedPostId);

  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [isComment, setIsComment] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [toggle, setToggle] = useState(null);
  const [modal, setModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isdisLike, setIsdisLike] = useState(false);  
  const isDrawerOpen = useSelector((state) => state.drawer.isDrawer);
  const [currentPostID, setCurrentPostID] = useState(null); 

  let typographyColor;
  switch (post.post.userId?.type) {
    case 'student':
      typographyColor = '#f7c602';
      break;
    case 'professor':
      typographyColor = '#0aade2';
      break;
    case 'staff':
      typographyColor = '#634db7';
      break;
    case 'other':
      typographyColor = 'black';
      break;
    default:
      typographyColor = 'black';
  }

  // start:: comment toggler 
  const isToggle = Boolean(toggle);
  const showCommentHandler = () => {
    setIsComment(!isComment);
  };

  const readMoreHandler = () => {
    setIsReadMore(!isReadMore);
  };

  const enableToggleHandler = (event) => {
    setToggle(event.currentTarget);
  };

  const hideToggleHandler = (event) => {
    setToggle(null);
    if (event.target.innerText === "Delete Post") {
      console.log("delete the current post", post.post._id);
      setModal(true);
    }
  };

  // start:: dropdown menu
  const toggleDropdown = () =>{
    setDropdown(!dropdown)
  }

  const toggleEditDropdown = (data) => {
    console.log(data)
    // setDropdown(!dropdown)
    dispatch(openDrawer());
    setCurrentPostID(null)
    setTimeout(() => {
      setCurrentPostID(data.post._id)
    }, 100); 

    dispatch(restSelectPost())
    setTimeout(() => {
      dispatch(selectPost(data.post))
    }, 100);
  }

  const handleOutsideClick = (event) => {
      setDropdown(false);
      if (dropdownRef.current) {
          if(dropdown === true){
              setDropdown(false);
          }else{
              dropdownRef.current = null
              setDropdown(true);
          }
      }else{
          setDropdown(false);
      }
  };

  useEffect(() => {
      const handleClickOutside = (event) => {            
          handleOutsideClick(event);
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
  }, []);

  // end:: dropdown menu

  const drawerHandler = (data) => { 
    console.log("hi", isDrawerOpen)  
    dispatch(restSelectPost())
    setTimeout(() => {
      dispatch(selectPost(data))
    }, 100); 
        
    dispatch(openDrawer());
  }

  const modalHandler = (type, data) => {
    console.log(type);
    if (type === "edit") {
      setIsEdit(true);
      console.log(post.post);      
    }
    setModal(true);
    setToggle(null);
    // dispatch(restSelectPost())
    // dispatch(closeDrawer());
  };

  const modalCloseHandler = () => {
    setModal(false);
    setIsEdit(false);
  };

  const deletePostHandler = (event) => {
    setModal(false);
    dispatch(restSelectPost())
    dispatch(closeDrawer());
    dispatch(deletePost(post.post._id));
    toast.success("Post deleted successfully", { position: "bottom-right", hideProgressBar: true, autoClose: 1500, transition:Slide});    
  };

  const likeHandler = (event) => {
    console.log("like handler from post list[newsfeed]");
    const data = {
      id: post.post._id,
      userId: user._id,
    };
    setIsLike(!isLike);
    setIsdisLike(false);
    dispatch(likePost(data));
  };

  const dislikeHandler = (event) => {
    const data = {
      id: post.post._id,
      userId: user._id,
    };
    setIsdisLike(!isdisLike);
    setIsLike(false);
    dispatch(disLikePost(data));
  };

  const renderImageSlider = (data) => {
    if (data.length === 1) {
      return (
        <Box sx={{ paddingX: 2 }}>
          {data.map((sliderImage, index) => {
            return (
              <Box key={index}>
                {/* <img src={sliderImage} /> */}
                <CardMedia
                  component="img"
                  image={sliderImage}
                  alt="rone_image"
                  sx={{ height: "350px" }}
                />
              </Box>
            );
          })}
        </Box>
      );
    }else if(data.length === 2) {
      return (
        <Slider2 media={data} />
      );
    } else {
      return (<Slider2 media={data}/>)
    }
  };

  const goToUserPage = (userData) =>{
    console.log('go to user account')
    console.log(userData)
    dispatch(setUser(userData)) // trigger the current post user's credential
    navigate(`/${userData.name}`)
    dispatch(selectNavigation(''));
    dispatch(closeDrawer())
  }

  const goToPostDetail = (postId) => {
    console.log('go to post detail')
    navigate(`/posts/${postId}`)
    dispatch(selectNavigation(''));
    dispatch(closeDrawer())
  }

  return (
    <>
      {user && (
        <Card
          key={post.post._id}
          sx={{ maxWidth: 570, width: 570, mt: 3, padding: 2, marginBottom: 2 }}
          className={(currentPostID1 === currentPostID) ? `${styles.active} ${styles.card_wrap}` : styles.card_wrap}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box>
                {post.post.userId?.profilePicture?.length != 0 ? (
                  <>
                    <Box
                      sx={{
                        color: "#85868f",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: "#282424",
                        cursor: "pointer"
                      }}
                      onClick={() => goToUserPage(post.post.userId)}
                      className="context_hover"
                    >
                      <img className={styles.user_avatar} src={post.post.userId?.profilePicture} />
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        color: "#85868f",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: "#282424",
                        cursor: "pointer"
                      }}
                      onClick={() => goToUserPage(post.post.userId)}
                    >
                      <PersonOutlineIcon />
                    </Box>
                  </Box>
                )}
              </Box>
              <Box sx={{ paddingLeft: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    onClick={() => goToUserPage(post.post.userId)}
                    className="context_hover"
                    sx={{ color: "#rgba(0, 0, 0, 0.87)", fontSize: "0.875rem", cursor: 'pointer' }}
                  >
                    {post.post.userId?.name}
                  </Typography>
                  <Box sx={{ paddingX: "8px" }}>
                    <Box
                      sx={{
                        width: "3px",
                        height: "3px",
                        background: "#95969c",
                        borderRadius: "50%",
                      }}
                    ></Box>
                  </Box>
                  <Typography
                    sx={{
                      textTransform: "capitalized",
                      background: typographyColor,
                      borderRadius: '25px',
                      padding: '2px 7px',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    {post.post.userId?.type}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "0.875rem" }}
                  >
                    {post.post.createdAt.slice(0, 10)}
                  </Typography>
                  <Typography
                    sx={{
                      paddingX: "3px",
                      color: "#1e6ab5",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                    }}
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "0.875rem" }}
                  >
                    {post.post.createdAt.slice(11, 16)}
                  </Typography>
                  {id === undefined ? <>
                    <Box sx={{ paddingX: "8px" }}>
                    <Box
                      sx={{
                        width: "3px",
                        height: "3px",
                        background: "#95969c",
                        borderRadius: "50%",
                      }}
                    ></Box>
                    </Box>
                    <Typography onClick={() => goToPostDetail(post.post._id)} className="context_link" sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "0.875rem", cursor: 'pointer' }}>Detail</Typography>
                  </> : <></>}
                </Box>
              </Box>
            </Box>

            <Box>
              <IconButton
                aria-label="settings"
                onClick={toggleDropdown}
                style={{
                  display:
                    post.post.userId?._id === user._id ? "flex" : "none",
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {dropdown && 
            <Box ref={dropdownRef} sx={{position: 'absolute', zIndex: 1, top: '75px', right: '20px', background: 'white', width: '150px', border: 1, borderColor: 'rgb(230, 230, 230)', borderRadius: '5px', padding: '5px', boxShadow: 'rgb(230, 230, 230) 0px 1px 4px'}}>                                                  
              <ListItem disablePadding>
                <ListItemButton sx={{paddingLeft: '8px'}} onClick={() => toggleEditDropdown(post)}>
                  <ListItemIcon sx={{minWidth: 'auto', paddingRight: '8px'}}>
                    <EditIcon sx={{fontSize: '1.3rem'}} />
                  </ListItemIcon>
                  <ListItemText sx={{fontSize: '16px', color: 'rgba(117, 117, 117, 1)'}} primary="Edit" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{paddingLeft: '8px'}} onClick={() => modalHandler("delete")}>
                  <ListItemIcon sx={{minWidth: 'auto', paddingRight: '8px'}}>
                    <DeleteOutlineIcon sx={{fontSize: '1.3rem'}} />
                  </ListItemIcon>
                  <ListItemText sx={{fontSize: '16px', color: 'rgba(117, 117, 117, 1)'}} onClick={toggleDropdown} primary="Delete" />
                </ListItemButton>
              </ListItem>
            </Box>
          }

          <Menu
            id="profile-menu"
            anchorEl={toggle}
            open={isToggle}
            onClose={hideToggleHandler}
            MenuListProps={{
              "aria-labelledby": "profile-button",
            }}
            disableScrollLock={true}
          >
            <MenuItem
              name="delete_post"
              onClick={() => modalHandler("delete")}
              sx={{ width: "200px" }}
            >
              <DeleteOutlineIcon name="delete_post" sx={{ paddingRight: 1 }} />{" "}
              Delete Post
            </MenuItem>
            <MenuItem name="edit_post" onClick={() => drawerHandler(post.post)}><EditIcon name="delete_post" sx={{paddingRight: 1}} /> Edit Post</MenuItem>
            <MenuItem name="edit_post" onClick={() => modalHandler('edit', post.post)}> Edit Post</MenuItem>
          </Menu>



          {post.post.title != undefined && 
            <>
              {id === undefined ? (
                <Box onClick={() => goToPostDetail(post.post._id)} sx={{paddingX: 2, paddingBottom: 1}} >
                  <Typography sx={{fontSize: '1.25rem', lineHeight: '1.2', cursor: 'pointer'}} className="title_txt context_link">{post.post.title}</Typography>
                </Box>
              ) : (
                <Box sx={{paddingX: 2, paddingBottom: 1}} >
                  <Typography sx={{fontSize: '1.25rem', lineHeight: '1.2'}} className="title_txt">{post.post.title}</Typography>
                </Box>
              )}
            </>
          }
          {post.post.text && (
            <CardContent sx={{ paddingTop: 0 }}>
              {id != undefined ? (
                <Typography variant="body2" color="text.secondary">
                  {post.post.text}
                </Typography>
              ) : (
                <Box>
                  {post.post.text.length > 250 ? (
                    <>
                      {isReadMore ? (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {post.post.text.slice(0, 250) + `...`}
                            <span
                              onClick={readMoreHandler}
                              className={styles.readmore}
                            >
                              {" "}
                              read more
                            </span>
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {post.post.text}
                            <span
                              onClick={readMoreHandler}
                              className={styles.readmore}
                            >
                              {" "}
                              read less
                            </span>
                          </Typography>
                        </>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {post.post.text}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          )}
          {post.post.image.length != 0 && (
            <>
              {renderImageSlider(post.post.image)}
            </>
          )}

          <CardActions
            disableSpacing
            sx={{
              borderTop: 1,
              borderColor: "#dcdcdc",
              m: 2,
              marginBottom: 0,
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="up-voting"
                onClick={likeHandler}
                style={{
                  color: post.post.likes.includes(user._id)
                    ? "#1976d2"
                    : "",
                }}
              >
                {/* <ThumbUpAltIcon /> */}
                
                {post.post.likes.includes(user._id)? (<ThumbUpIcon />) : (<ThumbUpOffAltIcon />)}
              </IconButton>
              <Box sx={{ width: "50px" }}>
                {post.post.likes.length != 0 && (
                  <Typography sx={{ marginRight: 1 }}>
                    {post.post.likes.length}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="down-voting"
                onClick={dislikeHandler}
                style={{
                  color: post.post.dislikes.includes(user._id)
                    ? "#1976d2"
                    : "",
                }}
              >
                {post.post.dislikes.includes(user._id)? (<ThumbDownIcon />) : (<ThumbDownOffAltIcon />)}
              </IconButton>
              <Box sx={{ width: "50px" }}>
                {(post.post.dislikes.length != 0 && (post.post.userId?._id === user._id) ) && (
                  <Typography sx={{ marginRight: 1 }}>
                    {post.post.dislikes.length}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton aria-label="comment" onClick={showCommentHandler}>
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Box sx={{ width: "50px" }}>
                {post.post.comments.length != 0 && (
                  <Typography sx={{ marginRight: 1 }}>
                    {post.post.comments.length}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardActions>

          <Collapse in={isComment} timeout="auto">
            <CardContent sx={{ paddingTop: 0 }}>
              <Comment comment={post.post} />
            </CardContent>
          </Collapse>
        </Card>
      )}
      <Modal
        open={modal}
        onClose={modalCloseHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="styles.backdrop_wrap"
      >
        {!isEdit ? (
          <Box
            className="modal_wrap"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
            }}
          >
            <Box sx={{ position: "absolute", right: "10px", top: "10px" }}>
              <IconButton aria-label="close" onClick={modalCloseHandler}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "#dfdfdf",
                  padding: 2,
                  alignContent: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6">Delete Post !</Typography>
              </Box>
              <Box sx={{ paddingY: 1 }}>
                <Typography sx={{ paddingY: 2 }}>
                  Are you sure you want to delete your post?
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    onClick={modalCloseHandler}
                    type="submit"
                    variant="outlined"
                    sx={{
                      p: 1,
                      width: "48%",
                      border: 1,
                      borderColor: "#dedede",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={deletePostHandler}
                    variant="contained"
                    color="error"
                    sx={{ width: 1.9 / 4, boxShadow: "none" }}
                  >
                    Yes, Delete Post
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={style}>
              <Box sx={{ position: "absolute", right: "10px", top: "10px" }}>
                <IconButton aria-label="close" onClick={modalCloseHandler}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {/* <PostForm onModalClose={modalCloseHandler} data={post.post} /> */}
              <PostForm activateDrawer={modalCloseHandler} data={post.post} />
            </Box>
          </>
        )}
      </Modal>
    </>
  );
}

export default Newsfeed;
