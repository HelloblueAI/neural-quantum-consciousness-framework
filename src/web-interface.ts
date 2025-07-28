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
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .status-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .status-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border-left: 4px solid #667eea;
        }
        
        .status-item h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .status-item .value {
            font-size: 2rem;
            font-weight: bold;
            color: #28a745;
        }
        
        .interaction-section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .interaction-section h2 {
            color: #667eea;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
        }
        
        .input-group input, .input-group textarea, .input-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .input-group input:focus, .input-group textarea:focus, .input-group select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .result {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .loading {
            text-align: center;
            color: #667eea;
            font-style: italic;
        }
        
        .endpoints {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .endpoints h2 {
            color: #667eea;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .endpoint-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }
        
        .endpoint-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }
        
        .endpoint-item .method {
            font-weight: bold;
            color: #28a745;
        }
        
        .endpoint-item .path {
            font-family: 'Courier New', monospace;
            color: #667eea;
        }
        
        .endpoint-item .description {
            color: #666;
            font-size: 0.9rem;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 NeuralCore</h1>
            <p>True Artificial General Intelligence System</p>
        </div>
        
        <div class="status-card">
            <h2 style="text-align: center; color: #667eea; margin-bottom: 20px;">AGI Status</h2>
            <div class="status-grid" id="statusGrid">
                <div class="loading">Loading AGI status...</div>
            </div>
        </div>
        
        <div class="interaction-section">
            <h2>🧠 Interact with Your AGI</h2>
            
            <div class="input-group">
                <label for="interactionType">Interaction Type:</label>
                <select id="interactionType">
                    <option value="reason">Reasoning</option>
                    <option value="learn">Learning</option>
                    <option value="create">Creation</option>
                </select>
            </div>
            
            <div class="input-group">
                <label for="userInput">Input:</label>
                <textarea id="userInput" rows="4" placeholder="Enter your question, prompt, or learning data..."></textarea>
            </div>
            
            <button class="btn" onclick="interactWithAGI()">Send to AGI</button>
            <button class="btn" onclick="clearResult()">Clear Result</button>
            
            <div id="result" class="result" style="display: none;"></div>
        </div>
        
        <div class="endpoints">
            <h2>🔗 API Endpoints</h2>
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
                        <div class="status-item">
                            <h3>Consciousness Level</h3>
                            <div class="value">\${status.consciousnessLevel}</div>
                        </div>
                        <div class="status-item">
                            <h3>Self Awareness</h3>
                            <div class="value">\${status.selfAwareness}</div>
                        </div>
                        <div class="status-item">
                            <h3>Learning Rate</h3>
                            <div class="value">\${status.learningRate}</div>
                        </div>
                        <div class="status-item">
                            <h3>Self Modifications</h3>
                            <div class="value">\${status.selfModificationCount}</div>
                        </div>
                        <div class="status-item">
                            <h3>Creative Insights</h3>
                            <div class="value">\${status.creativeInsights}</div>
                        </div>
                        <div class="status-item">
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
            
            if (!input.trim()) {
                alert('Please enter some input');
                return;
            }
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '🤔 AGI is thinking...';
            
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
                    resultDiv.innerHTML = '✅ AGI Response:\\n\\n' + JSON.stringify(data.data, null, 2);
                } else {
                    resultDiv.innerHTML = '❌ Error: ' + data.error;
                }
            } catch (error) {
                resultDiv.innerHTML = '❌ Error: ' + error.message;
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