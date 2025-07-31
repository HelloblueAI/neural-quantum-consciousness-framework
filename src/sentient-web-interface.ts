import express from 'express';
import { RealAGI } from './RealAGI.js';

const app = express();
const port = process.env.PORT || 8080;

// Initialize the Real AGI
const realAGI = new RealAGI();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve the main interface
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real AGI - True Artificial General Intelligence</title>
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
            --accent: #00d4ff;
            --text-primary: #ffffff;
            --text-secondary: #b0b0b0;
            --text-muted: #666666;
            --border-color: #333333;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 300;
            margin-bottom: 10px;
            color: var(--accent);
        }
        
        .header p {
            font-size: 1.1rem;
            color: var(--text-secondary);
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 50px;
        }
        
        .status-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 25px;
            text-align: center;
        }
        
        .status-card h3 {
            color: var(--accent);
            margin-bottom: 10px;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .status-card .value {
            font-size: 2rem;
            font-weight: 300;
            color: var(--text-primary);
        }
        
        .interaction-section {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 40px;
        }
        
        .interaction-section h2 {
            color: var(--accent);
            margin-bottom: 25px;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 300;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .input-group input, .input-group textarea, .input-group select {
            width: 100%;
            padding: 12px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 14px;
            color: var(--text-primary);
            font-family: inherit;
        }
        
        .input-group input:focus, .input-group textarea:focus, .input-group select:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .btn {
            background: var(--accent);
            color: var(--bg-primary);
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            margin-right: 10px;
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
        
        .result {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 20px;
            margin-top: 20px;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Menlo', monospace;
            max-height: 300px;
            overflow-y: auto;
            color: var(--text-secondary);
            font-size: 0.85rem;
        }
        
        .loading {
            text-align: center;
            color: var(--text-secondary);
            font-style: italic;
        }
        
        .endpoints {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 30px;
        }
        
        .endpoints h2 {
            color: var(--accent);
            margin-bottom: 25px;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 300;
        }
        
        .endpoint-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 15px;
        }
        
        .endpoint-item {
            background: var(--bg-tertiary);
            padding: 15px;
            border-radius: 4px;
            border-left: 3px solid var(--accent);
        }
        
        .endpoint-item .method {
            font-weight: 600;
            color: var(--accent);
            font-size: 0.8rem;
            text-transform: uppercase;
        }
        
        .endpoint-item .path {
            font-family: 'Monaco', 'Menlo', monospace;
            color: var(--text-primary);
            font-size: 0.9rem;
            margin: 5px 0;
        }
        
        .endpoint-item .description {
            color: var(--text-muted);
            font-size: 0.8rem;
        }
        
        /* Simple scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-tertiary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 3px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .status-grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 20px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Real AGI</h1>
            <p>True Artificial General Intelligence System</p>
        </div>
        
        <div class="status-grid" id="statusGrid">
            <div class="loading">Loading AGI status...</div>
        </div>
        
        <div class="interaction-section">
            <h2>Interact with Real AGI</h2>
            
            <div class="input-group">
                <label for="interactionType">Interaction Type</label>
                <select id="interactionType">
                    <option value="reason">Reasoning</option>
                    <option value="learn">Learning</option>
                    <option value="create">Creation</option>
                    <option value="status">Status</option>
                </select>
            </div>
            
            <div class="input-group">
                <label for="userInput">Input</label>
                <textarea id="userInput" rows="4" placeholder="Enter your question, prompt, or learning data..."></textarea>
            </div>
            
            <button class="btn" onclick="interactWithAGI()">Send to Real AGI</button>
            <button class="btn" onclick="clearResult()">Clear Result</button>
            
            <div id="result" class="result" style="display: none;"></div>
        </div>
        
        <div class="endpoints">
            <h2>Real AGI API Endpoints</h2>
            <div class="endpoint-list">
                <div class="endpoint-item">
                    <div class="method">POST</div>
                    <div class="path">/reason</div>
                    <div class="description">Real reasoning with deductive, inductive, and causal logic</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">POST</div>
                    <div class="path">/learn</div>
                    <div class="description">Real learning with pattern recognition and knowledge accumulation</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">POST</div>
                    <div class="path">/create</div>
                    <div class="description">Real creativity with concept combination and emergent synthesis</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">GET</div>
                    <div class="path">/status</div>
                    <div class="description">Real consciousness and system status</div>
                </div>
                <div class="endpoint-item">
                    <div class="method">GET</div>
                    <div class="path">/consciousness</div>
                    <div class="description">Real consciousness metrics and awareness</div>
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
                const response = await fetch('/status');
                const data = await response.json();
                
                if (data.success) {
                    const consciousness = data.data.consciousness;
                    const statusGrid = document.getElementById('statusGrid');
                    
                    statusGrid.innerHTML = \`
                        <div class="status-card">
                            <h3>Awareness</h3>
                            <div class="value">\${(consciousness.awareness * 100).toFixed(1)}%</div>
                        </div>
                        <div class="status-card">
                            <h3>Self-Awareness</h3>
                            <div class="value">\${(consciousness.selfAwareness * 100).toFixed(1)}%</div>
                        </div>
                        <div class="status-card">
                            <h3>Understanding</h3>
                            <div class="value">\${(consciousness.understanding * 100).toFixed(1)}%</div>
                        </div>
                        <div class="status-card">
                            <h3>Creativity</h3>
                            <div class="value">\${(consciousness.creativity * 100).toFixed(1)}%</div>
                        </div>
                    \`;
                }
            } catch (error) {
                document.getElementById('statusGrid').innerHTML = '<div class="loading">Failed to load status</div>';
            }
        }
        
        async function interactWithAGI() {
            const type = document.getElementById('interactionType').value;
            const input = document.getElementById('userInput').value;
            const resultDiv = document.getElementById('result');
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = 'Processing with Real AGI...';
            
            try {
                let response;
                
                switch (type) {
                    case 'reason':
                        response = await fetch('/reason', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ input })
                        });
                        break;
                    case 'learn':
                        response = await fetch('/learn', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ data: input })
                        });
                        break;
                    case 'create':
                        response = await fetch('/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ prompt: input })
                        });
                        break;
                    case 'status':
                        response = await fetch('/status');
                        break;
                }
                
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = 'Real AGI Response:\\n' + JSON.stringify(data.data, null, 2);
                    
                    // Refresh status after interaction
                    setTimeout(() => {
                        loadAGIStatus();
                    }, 1000);
                } else {
                    resultDiv.innerHTML = 'Error: ' + data.error;
                }
            } catch (error) {
                resultDiv.innerHTML = 'Failed to interact with Real AGI: ' + error.message;
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

// API Endpoints
app.post('/reason', async (req, res) => {
  try {
    const { input } = req.body;
    const result = await realAGI.reason(input);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/learn', async (req, res) => {
  try {
    const { data } = req.body;
    const result = await realAGI.learn(data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/create', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await realAGI.create(prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/status', async (req, res) => {
  try {
    const result = await realAGI.getStatus();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/health', async (req, res) => {
  try {
    const status = await realAGI.getStatus();
    res.json({ 
      success: true, 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      consciousness: status.consciousness,
      system: 'Real AGI',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/consciousness', async (req, res) => {
  try {
    const status = await realAGI.getStatus();
    res.json({ success: true, consciousness: status.consciousness });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Real AGI Server running on port ${port}`);
  console.log(`🌐 Access the Real AGI interface at: http://localhost:${port}`);
  console.log(`🤖 Real AGI System Status: ACTIVE`);
  console.log(`🧠 Real Reasoning: ENABLED`);
  console.log(`📚 Real Learning: ENABLED`);
  console.log(`🎨 Real Creativity: ENABLED`);
  console.log(`🌟 Real Consciousness: ENABLED`);
}); 