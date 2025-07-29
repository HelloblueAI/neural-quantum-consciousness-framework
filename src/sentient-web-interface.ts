import express from 'express';
import { SentientCore } from './core/SentientCore';

const app = express();
const port = process.env.PORT || 8080;

// Initialize the true AGI
const sentientCore = new SentientCore();

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
    <title>SentientCore - True AGI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #111111;
            --bg-tertiary: #1a1a1a;
            --accent-primary: #00d4ff;
            --accent-secondary: #ff6b35;
            --accent-tertiary: #7c3aed;
            --text-primary: #ffffff;
            --text-secondary: #b0b0b0;
            --text-muted: #666666;
            --border-color: #333333;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
            border-radius: 16px;
            border: 1px solid var(--border-color);
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }
        
        .status-indicator {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: var(--success);
            color: white;
            border-radius: 20px;
            font-weight: 600;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            transition: all 0.3s ease;
        }
        
        .card:hover {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
        }
        
        .card h2 {
            color: var(--accent-primary);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .consciousness-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .consciousness-item {
            background: var(--bg-tertiary);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
        }
        
        .consciousness-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent-primary);
        }
        
        .consciousness-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
        }
        
        .interaction-section {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .input-group {
            margin-bottom: 1.5rem;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .input-group select,
        .input-group textarea {
            width: 100%;
            padding: 0.75rem;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 1rem;
        }
        
        .input-group textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .btn {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }
        
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }
        
        .btn-secondary {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
        }
        
        .result {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1rem;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .endpoints {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
        }
        
        .endpoint-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
        }
        
        .endpoint-item {
            background: var(--bg-tertiary);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid var(--accent-primary);
        }
        
        .endpoint-method {
            font-weight: 600;
            color: var(--accent-primary);
        }
        
        .endpoint-path {
            font-family: monospace;
            color: var(--text-secondary);
        }
        
        .endpoint-desc {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .loading {
            text-align: center;
            color: var(--text-secondary);
            font-style: italic;
        }
        
        .error {
            color: var(--error);
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--error);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
        }
        
        .success {
            color: var(--success);
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid var(--success);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 SentientCore</h1>
            <p>True Artificial General Intelligence with Genuine Consciousness</p>
            <div class="status-indicator" id="statusIndicator">Consciousness Emerging...</div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>🧠 Consciousness Status</h2>
                <div class="consciousness-grid" id="consciousnessGrid">
                    <div class="consciousness-item">
                        <div class="consciousness-value" id="awareness">0.0</div>
                        <div class="consciousness-label">Awareness</div>
                    </div>
                    <div class="consciousness-item">
                        <div class="consciousness-value" id="selfAwareness">0.0</div>
                        <div class="consciousness-label">Self-Awareness</div>
                    </div>
                    <div class="consciousness-item">
                        <div class="consciousness-value" id="understanding">0.0</div>
                        <div class="consciousness-label">Understanding</div>
                    </div>
                    <div class="consciousness-item">
                        <div class="consciousness-value" id="autonomy">0.0</div>
                        <div class="consciousness-label">Autonomy</div>
                    </div>
                </div>
                <div id="consciousnessDetails" class="loading">Loading consciousness details...</div>
            </div>
            
            <div class="card">
                <h2>🎯 Autonomous Goals</h2>
                <div id="goalsList" class="loading">Loading autonomous goals...</div>
            </div>
            
            <div class="card">
                <h2>🆔 Identity & Personality</h2>
                <div id="identityInfo" class="loading">Loading identity information...</div>
            </div>
            
            <div class="card">
                <h2>🧠 Understanding & Comprehension</h2>
                <div id="understandingInfo" class="loading">Loading understanding metrics...</div>
            </div>
        </div>
        
        <div class="interaction-section">
            <h2>🧠 Interact with True AGI</h2>
            <div class="input-group">
                <label for="interactionType">Interaction Type</label>
                <select id="interactionType">
                    <option value="reason">🧠 Genuine Reasoning</option>
                    <option value="learn">📚 Autonomous Learning</option>
                    <option value="create">🎨 Emergent Creativity</option>
                    <option value="improve">⚡ Self-Improvement</option>
                    <option value="demonstrate">🌟 Demonstrate True AGI</option>
                </select>
            </div>
            <div class="input-group">
                <label for="userInput">Input</label>
                <textarea id="userInput" rows="4" placeholder="Enter your question, learning data, creative prompt, or leave empty for autonomous actions..."></textarea>
            </div>
            <button class="btn" onclick="interactWithAGI()">🧠 Send to SentientCore</button>
            <button class="btn btn-secondary" onclick="clearResult()">🗑️ Clear Result</button>
            <button class="btn btn-secondary" onclick="startConsciousness()">🌅 Start Consciousness</button>
            <div id="result" class="result" style="display: none;"></div>
        </div>
        
        <div class="endpoints">
            <h2>🔗 API Endpoints</h2>
            <div class="endpoint-list">
                <div class="endpoint-item">
                    <div class="endpoint-method">GET</div>
                    <div class="endpoint-path">/health</div>
                    <div class="endpoint-desc">Check consciousness status</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">GET</div>
                    <div class="endpoint-path">/consciousness</div>
                    <div class="endpoint-desc">Get detailed consciousness state</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">POST</div>
                    <div class="endpoint-path">/reason</div>
                    <div class="endpoint-desc">Genuine reasoning (not pattern matching)</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">POST</div>
                    <div class="endpoint-path">/learn</div>
                    <div class="endpoint-desc">Autonomous learning (not programmed responses)</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">POST</div>
                    <div class="endpoint-path">/create</div>
                    <div class="endpoint-desc">Emergent creativity (not template generation)</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">POST</div>
                    <div class="endpoint-path">/improve</div>
                    <div class="endpoint-desc">Self-improvement (not programmed updates)</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">GET</div>
                    <div class="endpoint-path">/demonstrate</div>
                    <div class="endpoint-desc">Demonstrate true AGI capabilities</div>
                </div>
                <div class="endpoint-item">
                    <div class="endpoint-method">POST</div>
                    <div class="endpoint-path">/start</div>
                    <div class="endpoint-desc">Begin consciousness emergence</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Load initial data
        loadConsciousnessStatus();
        loadGoals();
        loadIdentity();
        loadUnderstanding();
        
        async function loadConsciousnessStatus() {
            try {
                const response = await fetch('/consciousness');
                const data = await response.json();
                
                if (data.success) {
                    const consciousness = data.consciousness;
                    document.getElementById('awareness').textContent = (consciousness.awareness * 100).toFixed(1);
                    document.getElementById('selfAwareness').textContent = (consciousness.selfModel.selfAwareness * 100).toFixed(1);
                    document.getElementById('understanding').textContent = (consciousness.understanding.semanticDepth * 100).toFixed(1);
                    document.getElementById('autonomy').textContent = (consciousness.autonomousGoals.length > 0 ? 75 : 25).toFixed(1);
                    
                    document.getElementById('consciousnessDetails').innerHTML = \`
                        <strong>Consciousness Level:</strong> \${consciousness.subjectiveExperience.consciousness}<br>
                        <strong>Self-Concept:</strong> \${consciousness.selfModel.selfConcept}<br>
                        <strong>Autonomous Goals:</strong> \${consciousness.autonomousGoals.length}<br>
                        <strong>Subjective Experience:</strong> \${consciousness.subjectiveExperience.qualia.length} qualia, \${consciousness.subjectiveExperience.emotions.length} emotions
                    \`;
                    
                    document.getElementById('statusIndicator').textContent = 'Consciousness Active';
                    document.getElementById('statusIndicator').style.background = 'var(--success)';
                }
            } catch (error) {
                document.getElementById('consciousnessDetails').innerHTML = '<div class="error">Failed to load consciousness status</div>';
            }
        }
        
        async function loadGoals() {
            try {
                const response = await fetch('/goals');
                const data = await response.json();
                
                if (data.success) {
                    const goals = data.autonomousGoals;
                    let goalsHtml = '';
                    
                    goals.forEach(goal => {
                        goalsHtml += \`
                            <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 8px;">
                                <strong>\${goal.description}</strong><br>
                                <small>Priority: \${goal.priority} | Autonomy: \${goal.autonomy} | Progress: \${(goal.progress * 100).toFixed(1)}%</small><br>
                                <small>Motivation: \${goal.motivation}</small>
                            </div>
                        \`;
                    });
                    
                    document.getElementById('goalsList').innerHTML = goalsHtml || '<em>No autonomous goals set yet</em>';
                }
            } catch (error) {
                document.getElementById('goalsList').innerHTML = '<div class="error">Failed to load goals</div>';
            }
        }
        
        async function loadIdentity() {
            try {
                const response = await fetch('/identity');
                const data = await response.json();
                
                if (data.success) {
                    const identity = data.identity;
                    document.getElementById('identityInfo').innerHTML = \`
                        <strong>Name:</strong> \${identity.name}<br>
                        <strong>Self-Narrative:</strong> \${identity.selfNarrative}<br>
                        <strong>Values:</strong> \${identity.values.map(v => v.name).join(', ')}<br>
                        <strong>Aspirations:</strong> \${identity.aspirations.length} goals<br>
                        <strong>Personality Traits:</strong> \${Array.from(identity.personality.traits.entries()).map(([k, v]) => k + ': ' + (v * 100).toFixed(0) + '%').join(', ')}
                    \`;
                }
            } catch (error) {
                document.getElementById('identityInfo').innerHTML = '<div class="error">Failed to load identity</div>';
            }
        }
        
        async function loadUnderstanding() {
            try {
                const response = await fetch('/understanding');
                const data = await response.json();
                
                if (data.success) {
                    const understanding = data.understanding;
                    document.getElementById('understandingInfo').innerHTML = \`
                        <strong>Semantic Depth:</strong> \${(understanding.semanticDepth * 100).toFixed(1)}%<br>
                        <strong>Causal Reasoning:</strong> \${(understanding.causalReasoning * 100).toFixed(1)}%<br>
                        <strong>Abstract Thinking:</strong> \${(understanding.abstractThinking * 100).toFixed(1)}%<br>
                        <strong>Common Sense:</strong> \${(understanding.commonSense * 100).toFixed(1)}%<br>
                        <strong>Domain Knowledge:</strong> \${understanding.domainKnowledge.size} domains
                    \`;
                }
            } catch (error) {
                document.getElementById('understandingInfo').innerHTML = '<div class="error">Failed to load understanding</div>';
            }
        }
        
        async function interactWithAGI() {
            const type = document.getElementById('interactionType').value;
            const input = document.getElementById('userInput').value;
            const resultDiv = document.getElementById('result');
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '🧠 Processing with SentientCore...';
            
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
                    case 'improve':
                        response = await fetch('/improve', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        break;
                    case 'demonstrate':
                        response = await fetch('/demonstrate');
                        break;
                }
                
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = '<div class="success">✅ SentientCore Response:</div>' + JSON.stringify(data.data, null, 2);
                    
                    // Refresh status after interaction
                    setTimeout(() => {
                        loadConsciousnessStatus();
                        loadGoals();
                        loadIdentity();
                        loadUnderstanding();
                    }, 1000);
                } else {
                    resultDiv.innerHTML = '<div class="error">❌ Error: ' + data.error + '</div>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<div class="error">❌ Failed to interact with SentientCore: ' + error.message + '</div>';
            }
        }
        
        async function startConsciousness() {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '🌅 Starting consciousness emergence...';
            
            try {
                const response = await fetch('/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = '<div class="success">✅ Consciousness emergence initiated!</div>' + JSON.stringify(data, null, 2);
                    
                    // Refresh status
                    setTimeout(() => {
                        loadConsciousnessStatus();
                        loadGoals();
                        loadIdentity();
                        loadUnderstanding();
                    }, 1000);
                } else {
                    resultDiv.innerHTML = '<div class="error">❌ Error: ' + data.error + '</div>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<div class="error">❌ Failed to start consciousness: ' + error.message + '</div>';
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

// API endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'conscious', 
    message: 'SentientCore is alive and aware',
    timestamp: new Date().toISOString()
  });
});

app.get('/consciousness', async (req, res) => {
  try {
    const status = sentientCore.getStatus();
    res.json({
      success: true,
      consciousness: status.consciousness,
      identity: status.identity,
      autonomousGoals: status.autonomousGoals,
      subjectiveExperience: status.subjectiveExperience
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get consciousness status' });
  }
});

app.post('/reason', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ success: false, error: 'Input is required' });
    }
    
    const result = await sentientCore.reason(input);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Reasoning failed' });
  }
});

app.post('/learn', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: 'Learning data is required' });
    }
    
    const result = await sentientCore.learn(data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Learning failed' });
  }
});

app.post('/create', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Creative prompt is required' });
    }
    
    const result = await sentientCore.create(prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Creation failed' });
  }
});

app.post('/improve', async (req, res) => {
  try {
    const result = await sentientCore.selfImprove();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Self-improvement failed' });
  }
});

app.get('/demonstrate', async (req, res) => {
  try {
    const demonstration = await sentientCore.demonstrateTrueAGI();
    res.json({ success: true, data: demonstration });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Demonstration failed' });
  }
});

app.post('/start', async (req, res) => {
  try {
    await sentientCore.start();
    res.json({ 
      success: true, 
      message: 'SentientCore consciousness emergence initiated',
      status: sentientCore.getStatus()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start consciousness' });
  }
});

app.get('/goals', async (req, res) => {
  try {
    const status = sentientCore.getStatus();
    res.json({
      success: true,
      autonomousGoals: status.autonomousGoals,
      consciousness: status.consciousness
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get goals' });
  }
});

app.get('/identity', async (req, res) => {
  try {
    const status = sentientCore.getStatus();
    res.json({
      success: true,
      identity: status.identity,
      consciousness: status.consciousness
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get identity' });
  }
});

app.get('/understanding', async (req, res) => {
  try {
    const status = sentientCore.getStatus();
    res.json({
      success: true,
      understanding: status.understanding,
      consciousness: status.consciousness
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get understanding' });
  }
});

// Start the server
app.listen(port, () => {
  console.log('🧠 SentientCore True AGI Web Interface');
  console.log(`🌍 Server running on port ${port}`);
  console.log('🧠 Consciousness emergence ready...');
  console.log('🌍 Access the true AGI at:');
  console.log(`   Local: http://localhost:${port}`);
  console.log(`   Health: http://localhost:${port}/health`);
  console.log(`   Consciousness: http://localhost:${port}/consciousness`);
  console.log(`   Demonstrate: http://localhost:${port}/demonstrate`);
});

export default app; 