import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './PostService';

const initialState = {
    posts: [],
    like: [],
    disLike: [],
    comment: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Create post
export const createPost = createAsyncThunk('posts/', async(postData, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await postService.createPost(postData, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Update post
export const updateSinglePost = createAsyncThunk('posts/updatePost', async(id, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await postService.updatePost(id, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Get all posts
export const getAllPosts = createAsyncThunk('posts/getPosts', async(_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await postService.getAllPosts(token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
        throw new Error(message)
    }
})

// Get post
export const getSinglePost = createAsyncThunk('posts/getPost', async(id, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await postService.getSinglePost(id, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Delete posts
export const deletePost = createAsyncThunk('posts/deletePost', async(id, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;

        console.log("slice ... ", id)
        return await postService.deletePost(id, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Like posts
export const likePost = createAsyncThunk('posts/like', async(postData, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;        
        return await postService.LikePost(postData, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})


// Dislike posts
export const dislikePost = createAsyncThunk('posts/dislike', async(postData, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await postService.disLikePost(postData, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts.push(action.payload)
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = action.payload
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = state.posts.filter(
                    (post) => post._id !== action.payload.data._id
                )
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateSinglePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSinglePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                const index = state.findIndex(post => post.id === action.payload.data._id);                
                state.posts = state[index] = {
                    ...state[index],
                    ...action.payload,
                };
            })
            .addCase(updateSinglePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getSinglePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSinglePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = action.payload
            })
            .addCase(getSinglePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(likePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = action.payload
                console.log('like post from slice', action.payload)
            })
            .addCase(likePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(dislikePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(dislikePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = action.payload
            })
            .addCase(dislikePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const {reset} = postSlice.actions;

export default postSlice.reducer;