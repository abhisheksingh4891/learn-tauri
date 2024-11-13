import React, { useState } from "react";
import { readTextFileLines, open, readFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs";

const FileSystem = () => {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(""); // Added status state to show status messages
  const [imageSrc, setImageSrc] = useState<string>("");

  // Save Image to File Function
  async function saveImageToFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    try {
      const blob = file;
      const arrayBuffer = await blob.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);

      // Use the original file name (ensure it's safe for file systems)
      const fileName = file.name;

      // Save to "images" folder on Desktop
      const fileWriter = await open(`images/${fileName}`, {
        write: true,
        create: true,
        baseDir: BaseDirectory.Desktop,
      });

      // Write image data to file
      await fileWriter.write(byteArray);
      await fileWriter.close();
      setStatus("Image saved successfully!");
      const imageUrl = await getImageUrl(fileName);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error("Error saving image:", error);
      setStatus("Error saving image.");
    }
  }

  async function getImageUrl(fileName: string): Promise<string> {
    try {
      // Read the image file as binary using readFile
      const imageBuffer = await readFile(`images/${fileName}`, {
        baseDir: BaseDirectory.Desktop,
      });

      // Convert the binary data to Base64
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(imageBuffer))
      );
      return `data:image/jpeg;base64,${base64String}`; // Adjust MIME type as needed
    } catch (error) {
      console.error("Error reading image file:", error);
      return "";
    }
  }

  async function displayImage(fileName: string) {
    try {
      // Set the state with the Base64 URL
    } catch (error) {
      console.error("Error reading image file:", error);
      return "";
    }
  }

  // Handle Create File
  const handleCreateFile = async () => {
    try {
      const file = await open("bar.txt", {
        write: true,
        create: true,
        baseDir: BaseDirectory.Desktop,
      });
      await file.write(new TextEncoder().encode("world"));
      await file.close();
      setStatus("File created successfully!");
    } catch (error) {
      console.error("Error creating file:", error);
      setStatus("Error creating file.");
    }
  };

  // Handle Write File
  const handleWriteFile = async () => {
    try {
      const file = await open("bar.txt", {
        write: true,
        baseDir: BaseDirectory.Desktop,
      });
      await file.write(new TextEncoder().encode(content));
      await file.close();
      setStatus("File written successfully!");
    } catch (error) {
      console.error("Error writing file:", error);
      setStatus("Error writing file.");
    }
  };

  // Handle Read File
  const handleReadFile = async () => {
    try {
      const lines = await readTextFileLines("bar.txt", {
        baseDir: BaseDirectory.Desktop,
      });
      for await (const line of lines) {
        setContent(line);
      }
      setStatus("File read successfully!");
    } catch (error) {
      console.error("Error reading file:", error);
      setStatus("Error reading file.");
    }
  };

  return (
    <div>
      {/* <h1>Upload and Save Image</h1>
      <input type="file" accept="image/*" onChange={saveImageToFile} />
      {status && <p>{status}</p>}

      <h1>Tauri File System Example</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter text to write to file..."
      />

      <h2>Saved Image:</h2>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Saved"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )} */}

      <button onClick={handleCreateFile}>Create File</button>
      <button onClick={handleWriteFile}>Write to File</button>
      <button onClick={handleReadFile}>Read from File</button>
      <h2>File Content:</h2>
      <pre>{content}</pre>
    </div>
  );
};

export default FileSystem;
