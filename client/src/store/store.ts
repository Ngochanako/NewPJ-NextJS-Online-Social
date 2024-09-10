import { configureStore } from "@reduxjs/toolkit";
import UsersReducer from "./reducers/UsersReducer";
import UserReducer from "./reducers/UserReducer";
import ModalReducer from "./reducers/ModalReducer";
import PreviewImagesReducer from "./reducers/PreviewImagesReducer";
import ImagesPostReducer from "./reducers/ImagesPostReducer";
import PostsReducer from "./reducers/PostsReducer";
import postReducer from "./reducers/PostReducer";
import PostReducer from "./reducers/PostReducer";
import LoadingReducer from "./reducers/LoadingReducer";
import CommentsParentReducer from "./reducers/CommentsParentReducer";
import CommentsChildReducer from "./reducers/CommentsChildReducer";

export const store=configureStore({
    reducer:{
        users:UsersReducer,
        user:UserReducer,
        modal:ModalReducer,
        previewImages:PreviewImagesReducer,
        imagesPost:ImagesPostReducer,
        posts:PostsReducer,
        post:PostReducer,
        loading:LoadingReducer,
        commentsParent:CommentsParentReducer,
        commentsChild:CommentsChildReducer
    }
})