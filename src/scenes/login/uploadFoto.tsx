import React, { useState } from "react";

interface UploadFotoProps {
  userId: string | number;
  token: string;
}

const UploadFoto: React.FC<UploadFotoProps> = ({ userId, token }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Selecione uma foto antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("id", userId.toString());

    try {
      const response = await fetch("http://topsistemas.ddns.com.br:9003/uploadfoto", {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatus("Erro ao enviar: " + errorText);
      } else {
        const data = await response.json();
        setStatus("Upload realizado com sucesso: " + data.mensagem);
      }
    } catch (error) {
      setStatus("Erro na requisição: " + (error as Error).message);
    }
  };

  return (
    <div className="upload-foto-container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar Foto</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default UploadFoto;
