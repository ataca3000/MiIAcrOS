import React, {useState, useEffect, useRef} from 'react';
import {Mic, Send, Square, ChevronDown, ChevronUp, Settings, X, Download, BookOpen, MessageSquare} from 'lucide-react';
import {motion} from 'motion/react';
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const BACKEND_SCRIPT = `
import asyncio
import websockets
import json
import requests
from bs4 import BeautifulSoup
import os

def call_gemini(prompt, api_key):
    # Simplified Gemini call for the router
    return {"action": "analizar_codigo", "params": {"archivo": "main.py"}}

def call_ollama(prompt, model):
    # Call local Ollama API
    response = requests.post(f"http://localhost:11434/api/generate", json={"model": model, "prompt": prompt})
    # Parse response and return JSON action
    return {"action": "refactorizar_funcion", "params": {"archivo": "main.py"}}

async def handler(websocket):
    async for message in websocket:
        try:
            data = json.loads(message)
            action = data.get("command")
            params = data.get("params", {})

            if action == "ejecutar_ai":
                prompt = params.get("prompt")
                model = params.get("model")
                api_key = params.get("api_key")
                
                if model == "gemini":
                    result = call_gemini(prompt, api_key)
                else:
                    result = call_ollama(prompt, model)
                
                await websocket.send(json.dumps({"response": f"Ejecutando: {result['action']}", "action": result}))

            elif action == "resumir_web":
                url = params.get("url")
                if not url:
                    await websocket.send(json.dumps({"response": "Error: URL no proporcionada."}))
                    continue
                
                try:
                    response = requests.get(url, timeout=10)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.text, 'html.parser')
                    for script in soup(["script", "style"]):
                        script.extract()
                    
                    texto = soup.get_text(separator=' ', strip=True)
                    
                    if len(texto) < 100:
                        raise ValueError("Contenido insuficiente para resumir.")

                    resumen = f"Resumen de {url}: {texto[:500]}..."
                    
                    # Send summary back to frontend instead of writing directly
                    await websocket.send(json.dumps({"response": "resumen_listo", "resumen": resumen}))

                except Exception as e:
                    await websocket.send(json.dumps({"response": f"Error: {str(e)}"}))
            
            elif action == "copiar_a_word":
                import pyautogui
                resumen = params.get("resumen")
                pyautogui.write(resumen)
                await websocket.send(json.dumps({"response": "Resumen copiado a Word."}))
            
        except Exception as e:
            print(f"Error: {e}")

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
`;

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [history, setHistory] = useState<{role: string, text: string}[]>([]);
  const [isRetracted, setIsRetracted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const ws = useRef<WebSocket | null>(null);
  const recognition = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        setIsListening(prev => {
          if (prev) {
            recognition.current?.stop();
          } else {
            recognition.current?.start();
          }
          return !prev;
        });
      }
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        setIsRetracted(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [pendingSummary, setPendingSummary] = useState<string | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8765');
    ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.response === 'resumen_listo') {
            setPendingSummary(data.resumen);
        } else {
            setHistory(prev => [...prev, {role: 'ai', text: data.response}]);
        }
    };
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.lang = 'es-ES';
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        processCommand(transcript);
      };
    }
    return () => { ws.current?.close(); recognition.current?.stop(); };
  }, []);

  const copyToWord = () => {
    if (ws.current?.readyState === WebSocket.OPEN && pendingSummary) {
        ws.current.send(JSON.stringify({command: 'copiar_a_word', params: {resumen: pendingSummary}}));
        setPendingSummary(null);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const processCommand = async (cmd: string) => {
    setHistory(prev => [...prev, {role: 'user', text: `> ${cmd}`}]);
    
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        command: 'ejecutar_ai', 
        params: {
            prompt: `Eres un Senior Software Engineer experto en arquitectura, depuración y automatización. Interpreta este comando: "${cmd}".`,
            model: selectedModel,
            api_key: process.env.GEMINI_API_KEY
        }
      }));
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center">
      {/* KITT Pulse Point with Trail */}
      <div className="absolute top-10 w-1/2 h-16 flex items-center justify-center [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <div className="absolute w-[60%] h-0.5 bg-red-900/30"></div>
        <motion.div 
            className={`w-3 h-3 rounded-full bg-red-600 shadow-[0_0_20px_4px_rgba(220,38,38,0.8)] ${isListening ? 'animate-pulse' : ''}`}
            animate={isListening ? { scale: [1, 2, 1], opacity: [0.5, 1, 0.5] } : { x: [-200, 200, -200] }}
            transition={isListening ? { repeat: Infinity, duration: 0.3 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        drag
        dragMomentum={false}
        className="fixed z-50 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 pointer-events-auto mt-20 w-80 h-96 flex flex-col resize overflow-auto min-w-[250px] min-h-[300px]"
        initial={{ y: 100 }}
      >
        {/* Resize handle visual indicator */}
        <div className="absolute bottom-1 right-1 cursor-se-resize">
          <div className="w-2 h-2 border-r-2 border-b-2 border-cyan-400/50"></div>
        </div>
        
        <div className="flex justify-between items-center mb-2 shrink-0">
            <h2 className="text-cyan-400 font-bold text-lg">Karen AI</h2>
            <div className="flex gap-2">
                <button onClick={() => setShowHistory(!showHistory)} className="text-cyan-400/50 hover:text-cyan-400"><MessageSquare size={18}/></button>
                <button onClick={() => setIsSettingsOpen(true)} className="text-cyan-400/50 hover:text-cyan-400"><Settings size={18}/></button>
                <button onClick={() => setIsRetracted(!isRetracted)} className="text-cyan-400">
                    {isRetracted ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                </button>
            </div>
        </div>

        {!isRetracted && (
            <>
                <div className="flex-grow overflow-y-auto mb-4 p-2 text-sm text-cyan-400 font-mono space-y-1">
                    {history.map((msg, i) => (
                        <div key={i} className={msg.role === 'user' ? 'text-white/80' : 'text-cyan-300'}>
                            {msg.text}
                        </div>
                    ))}
                    {pendingSummary && (
                        <div className="bg-cyan-900/20 border border-cyan-400/30 rounded p-2 mt-2">
                            <p className="text-xs text-white mb-2">Resumen obtenido:</p>
                            <p className="text-xs text-cyan-200 mb-2 max-h-32 overflow-y-auto">{pendingSummary}</p>
                            <button onClick={copyToWord} className="w-full text-center text-xs bg-cyan-400 text-black font-bold py-1 rounded">Copiar a Word</button>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-full border border-cyan-400/20 shrink-0">
                    <motion.button 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        onClick={() => { isListening ? recognition.current?.stop() : recognition.current?.start(); setIsListening(!isListening); }} 
                        className={`p-2 ${isListening ? 'text-red-500' : 'text-cyan-400'}`}
                    >
                        {isListening ? <Square size={20} /> : <Mic size={20} />}
                    </motion.button>
                    <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { processCommand(textInput); setTextInput(""); } }} placeholder="Comando..." className="bg-transparent outline-none text-cyan-400 placeholder-cyan-400/50 w-full" />
                    <button onClick={() => { processCommand(textInput); setTextInput(""); }} className="text-cyan-400"><Send size={18} /></button>
                </div>
            </>
        )}
      </motion.div>

      {/* History/Notes Panel */}
      {showHistory && (
        <motion.div 
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="fixed right-10 top-20 z-50 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 w-64 h-96 pointer-events-auto"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-400 font-bold">Historial / Notas</h3>
                <button onClick={() => setShowHistory(false)}><X size={20} className="text-cyan-400"/></button>
            </div>
            <div className="overflow-y-auto h-80 text-xs text-cyan-400/70 font-mono space-y-2">
                {history.map((msg, i) => <p key={i}>{msg.text}</p>)}
            </div>
        </motion.div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
            <div className="bg-black/80 border border-cyan-400/30 p-6 rounded-2xl w-80 text-cyan-400">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Configuración</h3>
                    <button onClick={() => setIsSettingsOpen(false)}><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <button onClick={() => downloadFile(BACKEND_SCRIPT, 'karen_backend.py')} className="flex items-center gap-2 w-full p-2 bg-cyan-400/10 rounded hover:bg-cyan-400/20"><Download size={16}/> Descargar Backend</button>
                    
                    <div className="space-y-2">
                        <label className="text-xs text-cyan-400/70">Seleccionar Modelo IA</label>
                        <select 
                            value={selectedModel} 
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full bg-black/40 border border-cyan-400/30 rounded p-2 text-sm text-cyan-400 outline-none"
                        >
                            <option value="gemini">Gemini (Predeterminado)</option>
                            <option value="llama3">Llama 3 (Local)</option>
                            <option value="mistral">Mistral (Local)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
