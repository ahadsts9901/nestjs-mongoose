"use client";

import { useRef, RefObject, useEffect, useState } from "react";
import { SiNestjs } from "react-icons/si";
import axios from "axios"
import { Toast, baseUrl } from "@/core";
import Swal from "sweetalert2"
import Post from "./components/Post";

export default function Home() {

  const [posts, setPosts]: any = useState([])

  const titleRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const textRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getPosts()
  }, [])

  const createPost = async (e: any) => {
    e.preventDefault();

    const title = titleRef?.current?.value
    const text = textRef?.current?.value

    if (!title || !text || title.trim() === "" || text.trim() === "") {
      return
    }

    try {

      const resp = await axios.post(`${baseUrl}/posts`, {
        title: title,
        text: text
      })

      console.log(resp);

      Toast.fire({
        icon: "success",
        title: "Post done"
      })

      getPosts()
      e.target.reset()

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Error in posting"
      })
      console.log(error)
    }


  };

  const getPosts = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/posts`)
      setPosts([...resp.data])
    } catch (error) {
      console.log(error);
    }
  }

  const delPost = async (postId: string) => {

    if (!postId) {
      return
    }

    Swal.fire({
      title: 'Delete post ?',
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Delete',
      confirmButtonColor: "#24232c",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const resp = await axios.delete(`${baseUrl}/posts/${postId}`)
          console.log(resp);
          Toast.fire({
            icon: "success",
            title: "Post deleted",
          });
          getPosts()
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "Can't delete post",
          });
        }
      }
    });

  }

  const editPost = async (e: any, postId: string) => {

    let toEditTitle = e.target.parentNode.parentNode.querySelector(".title").innerText
    let toEditText = e.target.parentNode.parentNode.querySelector(".text").innerText

    Swal.fire({
      title: 'Edit Post',
      html: `
        <input type="text" minLength="${2}" maxLength="${20}" id="editTitle" class="swal2-input" placeholder="Post Title" value="${toEditTitle}" required>
        <textarea id="editText" minLength="${2}" maxLength="${1000}" class="swal2-input text" placeholder="Post Text" required>${toEditText}</textarea>
      `,
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Update',
      confirmButtonColor: "#24232c",
      preConfirm: async () => {

        const editedTitleElement = document.getElementById('editTitle')! as HTMLInputElement;
        const editedTextElement = document.getElementById('editText')! as HTMLInputElement;

        const editedTitle = editedTitleElement.value
        const editedText = editedTextElement.value

        if (!editedTitle.trim() || !editedText.trim()) {
          Swal.showValidationMessage('Title and text are required');
          setTimeout(() => {
            Swal.resetValidationMessage();
          }, 1500)
          return false;
        }

        try {
          const resp = await axios.put(`${baseUrl}/posts/${postId}`, {
            title: editedTitle,
            text: editedText
          })
          console.log(resp);
          Toast.fire({
            icon: "success",
            title: "Post updated",
          });
          getPosts()
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "Can't update post",
          });
        }
      }
    });
  }

  return (
    <div className="w-full min-h-[100vh] max-h-fit p-4 flex flex-col items-center gap-4 pt-8 bg-zinc-800">
      <h1 className="text-purple-500 text-3xl w-full flex justify-center items-center flex-wrap gap-4 font-extrabold py-4">
        <SiNestjs /><span className="text-gray-200">Nestjs with</span><span>Mongodb</span>
      </h1>
      <form className="w-[90%] flex flex-col items-center gap-4 font-bold" onSubmit={createPost}>
        <input minLength={2} maxLength={20} ref={titleRef} type="text" placeholder="Enter title ..." className="w-full p-3 rounded-md" />
        <textarea minLength={2} maxLength={1000} ref={textRef} placeholder="Enter text ..." className="w-full p-3 rounded-md h-[12em] resize-none"></textarea>
        <button type="submit" className="bg-purple-600 text-gray-200 p-2 px-6 rounded-md text-lg self-end">Post</button>
      </form>
      <div className="w-full flex justify-center flex-wrap gap-4 p-4">
        {
          posts ?
            posts.map((post: {
              time: string,
              title: string,
              text: string,
              _id: string
            }) => (
              <Post time={post?.time} id={post?._id} title={post?.title} text={post?.text} edit={editPost} del={delPost} />
            ))
            : null
        }
      </div>
    </div>
  );
}