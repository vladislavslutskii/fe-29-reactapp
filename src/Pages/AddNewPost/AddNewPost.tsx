import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";

import Title from "../../Components/Title";
import Input from "../../Components/Input";
import styles from "./AddNewPost.module.scss";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { PathNames } from "../Router";
import { ButtonType } from "../../Components/Button/types";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useDispatch } from "react-redux";
import {
  addNewPost,
  deletePost,
  saveEditedPost,
} from "../../Redux/reducers/postsReducer";
import { CardPostType } from "../../Utils";

type PostLocationState = {
  post: CardPostType;
};

const AddNewPost = () => {
  const location = useLocation();
  const { post } = (location.state as PostLocationState) || {};
  const { id } = useParams();

  const isEdit = !!post;

  const [title, setTitle] = useState("");
  const [lessonNum, setLessonNum] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageListType>([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setImages([{ dataURL: post.image }]);
      setDescription(post.text);
      setLessonNum(post.lesson_num.toString());
    }
  }, [post?.id]);

  const isValid = useMemo(() => {
    return (
      title.length > 0 &&
      lessonNum.length > 0 &&
      description.length > 0 &&
      images.length > 0 &&
      !!images[0].file
    );
  }, [title, lessonNum, description, images]);

  const onImageChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  const onCancel = () => {
    setTitle("");
    setLessonNum("");
    setDescription("");
    setImages([]);
    navigate(PathNames.Home);
  };

  const handleHomeNavigate = () => navigate(PathNames.Home);

  const onSave = () => {
    const formData = new FormData();
    formData.append("image", images[0].file as Blob);
    formData.append("text", description);
    formData.append("title", title);
    formData.append("lesson_num", lessonNum);

    dispatch(addNewPost({ formData, callback: handleHomeNavigate }));
  };

  const onSaveEdit = () => {
    if (post && id) {
      const formData = new FormData();
      formData.append("image", images[0].file as Blob);
      formData.append("text", description);
      formData.append("title", title);
      formData.append("lesson_num", lessonNum);
      formData.append("author", post.author.toString());
      dispatch(saveEditedPost({ id, formData, callback: handleHomeNavigate }));
    }
  };

  const onDeletePost = () => {
    if (id) {
      dispatch(deletePost({ id, callback: handleHomeNavigate }));
    }
  };

  return (
    <div className={styles.container}>
      <Title title={"Add New Post"} />
      <div className={styles.formContainer}>
        <div className={styles.smallInputsContainer}>
          <div className={styles.inputContainer}>
            <Label title={"Title"} required />
            <Input
              value={title}
              onChange={setTitle}
              placeholder={"Enter title"}
            />
          </div>
          <div className={styles.inputContainer}>
            <Label title={"Image"} required />
            <ImageUploading value={images} onChange={onImageChange}>
              {({ onImageUpload, onImageUpdate, onImageRemove }) => (
                <div>
                  <Button
                    title={"Upload"}
                    type={ButtonType.Secondary}
                    onClick={onImageUpload}
                  />
                  {images.map((image, index) => (
                    <div key={index} className={styles.image}>
                      <img
                        src={image.dataURL}
                        alt=""
                        width="100"
                        height={100}
                      />
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)}>
                          Update
                        </button>
                        <button onClick={() => onImageRemove(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
          </div>
          <div className={styles.inputContainer}>
            <Label title={"Lesson Number"} required />
            <Input
              value={lessonNum}
              onChange={setLessonNum}
              placeholder={"Enter your current lesson number"}
            />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <Label title={"Description"} required />
          <Input
            value={description}
            onChange={setDescription}
            placeholder={"Enter description"}
            type={"textarea"}
          />
        </div>
      </div>
      <div
        className={classNames(styles.footerContainer, {
          [styles.deleteFooterContainer]: isEdit,
        })}
      >
        {isEdit && (
          <Button
            type={ButtonType.Error}
            title={"Delete post"}
            className={styles.button}
            onClick={onDeletePost}
          />
        )}
        <div className={styles.saveContainer}>
          <Button
            type={ButtonType.Secondary}
            title={"Cancel"}
            onClick={onCancel}
          />
          <Button
            type={ButtonType.Primary}
            title={isEdit ? "Save" : "Add post"}
            onClick={isEdit ? onSaveEdit : onSave}
            disabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNewPost;
