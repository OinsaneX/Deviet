import { useEffect, useState } from "react";
import Link from "next/link";
import Back from "../../icons/Back";
import Avatar from "../../components/Avatar";
import Deveet from "../../components/Deveet";
import axios from "axios";
import { useUser } from "../../context/useUser";
import Delete from "../../icons/Delete";
import Navbar from "../../components/Navbar";

export default function Profile() {
  const [timeLine, settimeLine] = useState([]);
  const { user } = useUser();
  const [loading, setloading] = useState(undefined);
  useEffect(() => {
    if (user) {
      if (user) {
        setloading(null);
        getDeveets();
      }
    }
  }, [user]);

  const deleteDeveet = (id, index) => {
    var aux = deveets;
    aux.splice(index, 1);

    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deveet/${id}`)
      .then((res) => {
        getDeveets();
      });
  };

  const getDeveets = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deveet/user/${user.googleId}`
    );
    settimeLine(data);
    setloading(1);
  };

  return (
    <>
      <Navbar pos={2} />
      {user && (
        <header>
          <Link href="/timeline">
            <a>
              <Back width={32} height={32} />
            </a>
          </Link>
          {user !== undefined && user !== null && (
            <Avatar avatar={user.avatar}></Avatar>
          )}
          {user && (
            <div className="name">
              <h4>{user.username}</h4>
              <p>{timeLine.length} Deveets</p>
            </div>
          )}
        </header>
      )}

      {timeLine && loading ? (
        timeLine.map((deveet, index) => (
          <Deveet key={deveet._id} {...deveet}>
            <label
              className="delete"
              onClick={() => deleteDeveet(deveet._id, index)}
            >
              <Delete width={21} height={21} />
            </label>
          </Deveet>
        ))
      ) : (
        <div className="loader"></div>
      )}

      <style jsx>
        {`
          header {
            display: flex;
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
          .name {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            position: relative;
            margin-left: 20px;
          }
          h4,
          p {
            margin: 0;
          }
          a {
            margin-left: 20px;
            margin-right: 20px;
          }
          label {
            margin-left: 12px;
          }
        `}
      </style>
    </>
  );
}
