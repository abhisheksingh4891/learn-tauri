import React from 'react';
import { useState, useEffect } from "react";
// import reactLogo from "../assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import Database from "@tauri-apps/plugin-sql";
import WebSocket from "@tauri-apps/plugin-websocket";
import { platform } from "@tauri-apps/plugin-os";
import { load } from "@tauri-apps/plugin-store";
import { appDataDir } from "@tauri-apps/api/path"

const AllData = ()=> {

  useEffect(() => {
    async function getDatabasePath() {
      const appDirectory = await appDataDir();
      console.log(`Database path: ${appDirectory}db/my_database.db`);
    }

    getDatabasePath();
  }, []);

  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function dialog() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //setGreetMsg(await invoke("greet", { name }));

    const answer = await ask("This action cannot be reverted. Are you sure?", {
      title: "Tauri",
      kind: "warning",
    });
    setGreetMsg(await invoke("greet", { name }));
    alert(answer);
  }

  async function notification() {
    // 1st way
    // let permissionGranted = await isPermissionGranted();

    // if (!permissionGranted) {
    //   const permission = await requestPermission();
    //   permissionGranted = permission === "granted";

    //   sendNotification({
    //     title: "Tauri",
    //     body: `${await invoke("greet", { name })}`,
    //   });
    // }

    // 2nd way

    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        new Notification(`${await invoke("greet", { name })}`);
      } else {
        new Notification("Permission denied");
      }
    });
  }

  async function sql() {
    const db = await Database.load("sqlite:test.db");

    // await db.execute(
    //   "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT, status TEXT)"
    // );

    // const result = await db.execute(
    //   "INSERT into todos (id, title, status) VALUES ($1, $2, $3)",
    //   [, "aman", "done"]
    // );

    const data = await db.select("SELECT * from todos");
    console.log(data, "hello");
    alert(JSON.stringify(data));
  }

  async function os() {
    const currentPlatform = await platform();
   alert(currentPlatform);
  }

  async function store() {
    const store = await load("store.json", { autoSave: false });

    // Set a value
    await store.set("some-key", { value: 5 });

    // Get a value
    const val = await store.get("some-key");
    alert(JSON.stringify(val)); // Should log: { value: 5 }

    // Manually save the store
    await store.save();
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit" onClick={() => dialog()}>
          Dialog
        </button>
        <button type="submit" onClick={() => notification()}>
          Notification
        </button>
        <button type="submit" onClick={() => sql()}>
          SQL
        </button>
        <button type="submit" onClick={() => os()}>
          Os Info
        </button>
        <button type="submit" onClick={() => store()}>
          Store
        </button>
      </form>
      <p>{greetMsg}</p>
    </div>
  );
}

export default AllData;
