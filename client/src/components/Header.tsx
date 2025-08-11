import { useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoImage from "@/assets/618819.jpg";

interface HeaderProps {
  onShowTutorial: () => void;
}

export default function Header({ onShowTutorial }: HeaderProps) {
  const [selectedPort, setSelectedPort] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (data) => {
      if (data.type === "upload_status") {
        setUploadStatus(data.status);
        if (data.status === "success") {
          setTimeout(() => setUploadStatus("idle"), 3000);
        }
      }
    },
  });

  const handleUpload = () => {
    if (!selectedPort) {
      alert("Por favor, selecione uma porta primeiro!");
      return;
    }

    setUploadStatus("uploading");
    sendMessage({
      type: "upload_code",
      port: selectedPort,
      boardType: "Arduino Uno",
      code: "// Generated code would go here",
    });
  };

  const scanPorts = () => {
    sendMessage({ type: "scan_ports" });
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-kid-blue">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-xl shadow-playful">
              <img
                src={logoImage}
                alt="Oficina do Amanhã"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">
                Arduino Blocks Kids
              </h1>
              <p className="text-sm text-gray-600 font-semibold">
                Programe com blocos coloridos!
              </p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="flex items-center space-x-3">
            {/* Arduino Connection */}
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 shadow-block">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-kid-green" : "bg-kid-red animate-pulse"}`}
              ></div>
              <span className="text-sm font-semibold text-gray-700">
                {isConnected ? "Conectado" : "Desconectado"}
              </span>
              <Select value={selectedPort} onValueChange={setSelectedPort}>
                <SelectTrigger className="ml-2 bg-transparent border-none text-sm font-semibold text-gray-700 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Selecione a porta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COM3">COM3 (Arduino Uno)</SelectItem>
                  <SelectItem value="COM4">COM4 (Arduino Nano)</SelectItem>
                  <SelectItem value="/dev/ttyUSB0">
                    /dev/ttyUSB0 (Linux)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={uploadStatus === "uploading"}
              className="bg-gradient-to-r from-kid-green to-green-400 hover:from-kid-green hover:to-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-playful transform hover:scale-105 transition-all duration-200"
            >
              {uploadStatus === "uploading" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : uploadStatus === "success" ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Sucesso!
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Enviar pro Arduino
                </>
              )}
            </Button>

            {/* Menu */}
            <Button
              variant="ghost"
              onClick={onShowTutorial}
              className="bg-gray-200 hover:bg-gray-300 p-3 rounded-xl shadow-block transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
