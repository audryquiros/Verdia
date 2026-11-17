import db from "../src/models/index.js";
import { env } from "../src/config/env.js";
import { syncGoogleDrive } from "../src/rag/ingestService.js";

const spaceId = process.argv[2] || env.RAG_SPACE_ID;
const folderId = process.argv[3] || env.GOOGLE_DRIVE_FOLDER_ID;

if (!spaceId) throw new Error("Falta RAG_SPACE_ID o el primer argumento spaceId");
if (!folderId) throw new Error("Falta GOOGLE_DRIVE_FOLDER_ID o el segundo argumento folderId");

try {
  const result = await syncGoogleDrive({ db, spaceId, folderId });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("No se pudo sincronizar Google Drive:", error.message);
  process.exitCode = 1;
} finally {
  await db.sequelize.close();
}
