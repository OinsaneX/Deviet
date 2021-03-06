import { useEffect, useState } from "react";
import Avatar from "../../../components/Avatar";
import { useUser } from "../../../context/useUser";
import ReactPlayer from "react-player";
import Link from "next/link";
import Head from "next/head";
import Back from "../../../icons/Back";
import AddVideo from "../../../icons/AddVideo";
import Add from "../../../icons/Add";
import Send from "../../../icons/Send";
import axios from "axios";
import { useRouter } from "next/router";

export default function Compoose() {
  const [deveet, setdeveet] = useState({
    idUser: "",
    username: "",
    avatar: "",
    content: "",
    img: null,
    video: null,
  });
  const [loading, setloading] = useState(undefined);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user !== undefined && user !== null) {
      setdeveet((deveet) => ({
        ...deveet,
        idUser: user.googleId,
        username: user.username,
        avatar: user.avatar,
      }));
    }
  }, [user]);

  function handleTextArea(e) {
    setdeveet({ ...deveet, content: e.target.value });
    console.log(deveet);
  }
  function onAddImage(e) {
    e.preventDefault();
    var file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_API_CLOUDINARY_SECRET
    );
    setloading(null);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_API_CLOUD_SECRET}/image/upload`,
        formData
      )
      .then((response) => {
        setloading(1);

        setdeveet({ ...deveet, img: response.data.secure_url });
      });
  }
  function onAddVideo(e) {
    e.preventDefault();
    var file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_API_CLOUDINARY_SECRET
    );
    setloading(null);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_API_CLOUD_SECRET}/video/upload`,
        formData
      )
      .then((response) => {
        setloading(1);
        setdeveet({ ...deveet, video: response.data.secure_url });
      });
  }
  function createDeveet(e) {
    e.preventDefault();

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deveet`, deveet)
      .then((res) => {
        router.push("/timeline");
      })
      .catch((err) => {});
  }

  function DeleteImage() {
    setdeveet({ ...deveet, img: null });
  }

  function DeleteVideo() {
    setdeveet({ ...deveet, video: null });
  }

  return (
    <>
      <Head>
        <title>Crear Deveet / Devit</title>
      </Head>
      <header>
        <Link href="/timeline">
          <a>
            <Back width={32} height={32} />
          </a>
        </Link>
        <div className="buttons">
          <div>
            <label htmlFor="addFile">
              <Add width={32} height={32} />
            </label>
            <input
              type="file"
              onChange={(e) => onAddImage(e)}
              id="addFile"
              accept="image/*"
            />
          </div>
          <div>
            <label htmlFor="addVideo">
              <AddVideo width={32} height={32} />
            </label>
            <input
              type="file"
              onChange={(e) => onAddVideo(e)}
              id="addVideo"
              accept="video/*"
            />
          </div>
        </div>
      </header>
      <section className="form-container">
        <section className="avatar-container">
          {user !== undefined && user !== null && (
            <Avatar
              avatar={user.avatar}
              alt={user.username}
              width="45"
              height="45"
            />
          )}
        </section>
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <textarea
            name="message"
            id=""
            value={deveet.content}
            onChange={(e) => handleTextArea(e)}
            placeholder="Que estas pensando"
          ></textarea>
          {loading === null && <div className="loader"></div>}
          {deveet.img && (
            <section className="remove-image">
              <button className="close" onClick={() => DeleteImage()}>
                x
              </button>
              <img src={deveet.img}></img>
            </section>
          )}
          {deveet.video !== null && (
            <section className="remove-image">
              <button className="close" onClick={() => DeleteVideo()}>
                x
              </button>
              <ReactPlayer
                url={deveet.video}
                controls={true}
                width="100%"
                height="400px"
              />
            </section>
          )}
          <div className="btn">
            <button
              className="send"
              disabled={
                deveet.content.length < 1 && !deveet.img && !deveet.video
              }
              onClick={(e) => createDeveet(e)}
            >
              <div className="buttonContent">
                <p>Publicar</p>
                <Send />
              </div>
            </button>
          </div>
        </form>
      </section>

      <style jsx>
        {`
          form {
            padding: 10px;
          }
          textarea {
            border: 0;
            width: 100%;
            font-size: 18px;
            padding: 15px;
            resize: none;
            outline: 0;
            min-height: 200px;
          }
          .form-container {
            display: flex;
            align-items: flex-start;
          }

          label {
            cursor: pointer;
            margin-right: 20px;
          }
          .close {
            position: absolute;
            right: 15px;
            top: 15px;
            border: 0;
            color: #fff;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 999px;
            width: 36px;
            height: 36px;
            z-index: 10;
          }
          button[disabled] {
            opacity: 0.2;
            pointer-events: none;
          }
          button:hover {
            opacity: 1;
          }
          .buttons {
            display: flex;
          }
          input[type="file"] {
            display: none;
          }
          .send {
            border: 1px solid black;
            background-color: white;
            font-weight: 900;
            box-shadow: 3px 4px grey;
            margin-top: 10px;
            transition: opacity 0.8s ease-in;
            opacity: 0.8;
            border-radius: 4px;
          }
          .buttonContent {
            display: flex;
            align-items: center;
          }

          .send[disabled] {
            opacity: 0.2;
            pointer-events: none;
          }
          .send:hover {
            opacity: 0.9;
          }
          .avatar-container {
            margin-top: 10px;
            margin-left: 10px;
          }
          .remove-image {
            position: relative;
          }
          img {
            width: 100%;
            height: auto;
            border-radius: 10px;
          }
          header {
            display: flex;
            justify-content: space-between;

            align-items: center;
            background: #ffffffaa;
            backdrop-filter: blur(5px);
            height: 49px;
            width: 100%;
            position: sticky;
            top: 0;
            border-bottom: 1px solid #eee;
            z-index: 10;
          }
          a {
            margin-left: 20px;
          }
          header a:hover {
            background: radial-gradient(#0099ff22 15%, transparent 16%);
            background-size: 180px 180px;
            background-position: center;
          }
          .btn {
            display: flex;
            justify-content: center;
          }
        `}
      </style>
    </>
  );
}
