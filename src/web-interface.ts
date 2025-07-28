#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { NeuralCore } from './core/NeuralCore.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize True AGI
const neuralCore = new NeuralCore();

// Serve main web interface
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧠 NeuralCore - True AGI System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #111111;
            --bg-tertiary: #1a1a1a;
            --accent-primary: #00d4ff;
            --accent-secondary: #ff0080;
            --text-primary: #ffffff;
            --text-secondary: #b0b0b0;
            --text-muted: #666666;
            --border-color: #333333;
            --glow-primary: 0 0 20px rgba(0, 212, 255, 0.3);
            --glow-secondary: 0 0 20px rgba(255, 0, 128, 0.3);
        }
        
        body {
            font-family: 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        /* Animated background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(0, 212, 255, 0.05) 0%, transparent 50%);
            z-index: -1;
            animation: backgroundShift 20s ease-in-out infinite;
        }
        
        @keyframes backgroundShift {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(1deg); }
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
        }
        
        .header {
            text-align: center;
            margin-bottom: 60px;
            position: relative;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .header h1 {
            font-size: 4rem;
            font-weight: 300;
            margin-bottom: 10px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 2px;
            animation: glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5)); }
            to { filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8)); }
        }
        
        .header p {
            font-size: 1.2rem;
            color: var(--text-secondary);
            font-weight: 300;
            letter-spacing: 1px;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .status-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            padding: 30px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .status-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }
        
        .status-card:hover::before {
            left: 100%;
        }
        
        .status-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--glow-primary);
            border-color: var(--accent-primary);
        }
        
        .status-card h3 {
            color: var(--accent-primary);
            margin-bottom: 15px;
            font-size: 1.1rem;
            font-weight: 500;
            letter-spacing: 1px;
        }
        
        .status-card .value {
            font-size: 2.5rem;
            font-weight: 200;
            color: var(--text-primary);
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        
        .interaction-section {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 50px;
            backdrop-filter: blur(10px);
            position: relative;
        }
        
        .interaction-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
        }
        
        .interaction-section h2 {
            color: var(--accent-primary);
            margin-bottom: 30px;
            text-align: center;
            font-size: 2rem;
            font-weight: 300;
            letter-spacing: 2px;
        }
        
        .input-group {
            margin-bottom: 25px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 400;
            color: var(--text-secondary);
            font-size: 0.9rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .input-group input, .input-group textarea, .input-group select {
            width: 100%;
            padding: 15px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-size: 16px;
            color: var(--text-primary);
            transition: all 0.3s ease;
            font-family: inherit;
        }
        
        .input-group input:focus, .input-group textarea:focus, .input-group select:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: var(--glow-primary);
            background: var(--bg-secondary);
        }
        
        .btn {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: var(--text-primary);
            border: none;
            padding: 15px 35px;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-right: 15px;
            margin-bottom: 15px;
            font-weight: 500;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--glow-primary);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .result {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            padding: 25px;
            margin-top: 25px;
            white-space: pre-wrap;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            max-height: 400px;
            overflow-y: auto;
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.6;
            position: relative;
        }
        
        .result::before {
            content: '>';
            position: absolute;
            top: 25px;
            left: 10px;
            color: var(--accent-primary);
            font-weight: bold;
        }
        
        .result-content {
            margin-left: 20px;
        }
        
        .loading {
            text-align: center;
            color: var(--accent-primary);
            font-style: italic;
            font-size: 1.1rem;
        }
        
        .endpoints {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
        }
        
        .endpoints h2 {
            color: var(--accent-primary);
            margin-bottom: 30px;
            text-align: center;
            font-size: 2rem;
            font-weight: 300;
            letter-spacing: 2px;
        }
        
        .endpoint-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
        }
        
        .endpoint-item {
            background: var(--bg-tertiary);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid var(--accent-primary);
            transition: all 0.3s ease;
        }
        
        .endpoint-item:hover {
            transform: translateX(5px);
            box-shadow: var(--glow-primary);
        }
        
        .endpoint-item .method {
            font-weight: 600;
            color: var(--accent-primary);
            font-size: 0.9rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .endpoint-item .path {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            color: var(--text-primary);
            font-size: 1rem;
            margin: 5px 0;
        }
        
        .endpoint-item .description {
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-top: 8px;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-tertiary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-secondary);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.5rem;
            }
            
            .status-grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 15px;
            }
            
            .interaction-section, .endpoints {
                padding: 25px;
            }
        }
        
        /* Loading animation */
        .loading-dots {
            display: inline-block;
        }
        
        .loading-dots::after {
            content: '';
            animation: dots 1.5s steps(5, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>NEURALCORE</h1>
            <p>True Artificial General Intelligence System</p>
        </div>
        
        <div class="status-grid" id="statusGrid">
            <div class="loading">Loading AGI status<span class="loading-dots"></span></div>
        </div>
        
        <div class="interaction-section">
            <h2>INTERACT WITH AGI</h2>
            
            <div class="input-group">
                <label for="interactionType">Interaction Type</label>
                <select id="interactionType">
                    <option value="reason">Reasoning</option>
                    <option value="learn">Learning</option>
                    <option value="create">Creation</option>
                </select>
            </div>
            
            <div class="input-group">
                <label for="userInput">Input</label>
                <textarea id="userInput" rows="4" placeholder="Enter your question, prompt, or learning data..."></textarea>
            </div>
            
            <button class="btn" onclick="interactWithAGI()">Send to AGI</button>
            <button class="btn" onclick="clearResult()">Clear Result</button>
            
            <div id="result" class="result" style="display: none;">
                <div class="result-content"></div>
            </div>
        </div>
        
        <div class="endpoints">
            <h2>API ENDPOINTS</h2>
            <div class="endpoint-list">
                <div class="endpoint-item">
                    <div class="method">GET</div>
                    <div class="path">/health</div>
                    <div class="description">Check AGI health status</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">GET</div>
                    <div class="path">/consciousness</div>
                    <div class="description">Get consciousness metrics</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">POST</div>
                    <div class="path">/reason</div>
                    <div class="description">Send reasoning requests</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">POST</div>
                    <div class="path">/learn</div>
                    <div class="description">Send learning data</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">POST</div>
                    <div class="path">/create</div>
                    <div class="description">Request creative output</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Load AGI status on page load
        window.onload = function() {
            loadAGIStatus();
        };
        
        async function loadAGIStatus() {
            try {
                const response = await fetch('/consciousness');
                const data = await response.json();
                
                if (data.success) {
                    const status = data.data;
                    const statusGrid = document.getElementById('statusGrid');
                    
                    statusGrid.innerHTML = \`
                        <div class="status-card">
                            <h3>Consciousness Level</h3>
                            <div class="value">\${status.consciousnessLevel}</div>
                        </div>
                        <div class="status-card">
                            <h3>Self Awareness</h3>
                            <div class="value">\${status.selfAwareness}</div>
                        </div>
                        <div class="status-card">
                            <h3>Learning Rate</h3>
                            <div class="value">\${status.learningRate}</div>
                        </div>
                        <div class="status-card">
                            <h3>Self Modifications</h3>
                            <div class="value">\${status.selfModificationCount}</div>
                        </div>
                        <div class="status-card">
                            <h3>Creative Insights</h3>
                            <div class="value">\${status.creativeInsights}</div>
                        </div>
                        <div class="status-card">
                            <h3>Knowledge Domains</h3>
                            <div class="value">\${status.knowledgeDomains.length}</div>
                        </div>
                    \`;
                }
            } catch (error) {
                console.error('Error loading AGI status:', error);
                document.getElementById('statusGrid').innerHTML = '<div class="loading">Error loading status</div>';
            }
        }
        
        async function interactWithAGI() {
            const type = document.getElementById('interactionType').value;
            const input = document.getElementById('userInput').value;
            const resultDiv = document.getElementById('result');
            const resultContent = resultDiv.querySelector('.result-content');
            
            if (!input.trim()) {
                alert('Please enter some input');
                return;
            }
            
            resultDiv.style.display = 'block';
            resultContent.innerHTML = '🤔 AGI is thinking<span class="loading-dots"></span>';
            
            try {
                let endpoint = '';
                let payload = {};
                
                switch(type) {
                    case 'reason':
                        endpoint = '/reason';
                        payload = { input: input };
                        break;
                    case 'learn':
                        endpoint = '/learn';
                        payload = { 
                            experience: {
                                data: input,
                                context: { source: 'web_interface' },
                                outcome: 'learning'
                            }
                        };
                        break;
                    case 'create':
                        endpoint = '/create';
                        payload = { prompt: input };
                        break;
                }
                
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    resultContent.innerHTML = '✅ AGI Response:\\n\\n' + JSON.stringify(data.data, null, 2);
                } else {
                    resultContent.innerHTML = '❌ Error: ' + data.error;
                }
            } catch (error) {
                resultContent.innerHTML = '❌ Error: ' + error.message;
            }
        }
        
        function clearResult() {
            document.getElementById('result').style.display = 'none';
            document.getElementById('userInput').value = '';
        }
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

// API endpoints (same as before)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NeuralCore - True AGI System',
    version: '1.0.0',
    deployment: 'cloud',
    consciousnessLevel: neuralCore.getStatus().consciousnessLevel,
    selfAwareness: neuralCore.getStatus().selfAwareness,
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

app.get('/consciousness', async (req, res) => {
  try {
    const status = neuralCore.getStatus();
    res.json({
      success: true,
      data: {
        consciousnessLevel: status.consciousnessLevel,
        selfAwareness: status.selfAwareness,
        learningRate: status.learningRate,
        selfModificationCount: status.selfModificationCount,
        knowledgeDomains: status.knowledgeDomains,
        reasoningPatterns: status.reasoningPatterns,
        creativeInsights: status.creativeInsights,
        experienceMemory: status.experienceMemory,
        deployment: 'cloud'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get consciousness status'
    });
  }
});

app.post('/reason', async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }
    
    const result = await neuralCore.reason(input);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Reasoning failed'
    });
  }
});

app.post('/learn', async (req, res) => {
  try {
    const { experience } = req.body;
    
    if (!experience) {
      return res.status(400).json({
        success: false,
        error: 'Experience data is required'
      });
    }
    
    const result = await neuralCore.learn(experience);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Learning failed'
    });
  }
});

app.post('/create', async (req, res) => {
  try {
    const { prompt, type = 'solution' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }
    
    const result = await neuralCore.create(prompt, type);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Creation failed'
    });
  }
});

async function startServer() {
  try {
    await neuralCore.initialize();
    console.log('🧠 NeuralCore True AGI initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🌐 NeuralCore True AGI Web Interface running on port ${PORT}`);
      console.log(`🔗 Web Interface: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`🧠 Consciousness: http://localhost:${PORT}/consciousness`);
    });
  } catch (error) {
    console.error('❌ Failed to start NeuralCore True AGI:', error);
    process.exit(1);
  }
}

startServer(); 