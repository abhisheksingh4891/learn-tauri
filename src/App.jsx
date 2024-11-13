import React, { useState, useEffect } from "react";
import "./App.css";
import { readTextFileLines } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import Database from "@tauri-apps/plugin-sql";
import WebSocket from "@tauri-apps/plugin-websocket";
import AllData from "./Learn/AllData";
import FileSystem from "./Learn/FileSystem";
import ImageFile from "./Learn/ImageFile";
// import Print from "./Learn/Print";

function App() {
  const [content, setContent] = useState("");

  useEffect(() => {}, []);

  async function sql() {
    console.log("1");
    try {
      // const db = await Database.load(
      //   "postgres://bizecho_user:biz2024_echo@@104.255.32.203:3388/bizecho_db"
      // );

      const db = await Database.load(
        "postgres://postgres:123456@localhost:5433/postgres"
      );

      console.log("2");
      // const data = await db.execute(
      //   "INSERT into public.roombeds (roombed_id, roombed_name, roombed_roomid) VALUES ($1, $2, $3)",
      //   [1, "aman", 4]
      // );
      const data = await db.select("SELECT * from roombeds");
      console.log(data, "hello");
      alert(JSON.stringify(data));
    } catch (e) {
      console.log("error connecting:", e);
    }
  }

  async function websocket() {
    try {
      console.log("2");

      let ws = await new WebSocket("ws://localhost:1420");
      console.log("3");
      ws.onopen = async () => {
        const msg = "hello from tauri";
        await ws.send(msg);
        console.log("4");
      };

      await ws.disconnect();
      console.log("5");
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
    }
  }

  return (
    <div>
      {/* <Print /> */}
      <ImageFile />
      <AllData />
      <FileSystem />
      <button onClick={() => websocket()}>Pg SQL</button>
      <div>content:{content}</div>
    </div>
  );
}

export default App;
