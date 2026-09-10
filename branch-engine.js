// ── Data shape ──────────────────Yippeee──────────────────
// A branching pitch looks like:
// {
//   name: 'Insurance Pitch (New/Upgrade)',
//   description: 'Use after the device pitch...',
//   type: 'branching',
//   start: 'opener',                 // id of the first node
//   nodes: {
//     opener: {
//       text: `...message with optional [fieldId] placeholders...`,
//       fields: [ { id, label, prefix, suffix, placeholder } ], // optional £ inputs used in THIS node's text
//       branches: {                  // optional - omit for an end node
//         yes: { label: 'Yes', next: 'q2' },
//         no:  { label: 'No',  next: 'declineOffer' }
//       }
//     },
//     q2: { ... },
//     ...
//   }
// }
//
// Every node's `text` can reference its own `fields` via [fieldId], same
// placeholder convention as the rest of the pitch manager. Field values are
// remembered for the whole session so re-visiting a node keeps its inputs.

(function () {
    'use strict';

    let activeBranchPitch = null;     // the branching pitch definition currently shown
    let currentNodeId = null;         // id of node currently on screen
    let nodeHistory = [];             // stack of node ids visited, for "Back"
    let branchFieldValues = {};       // { fieldId: value } across the whole session

    function getNode(nodeId) {
        return activeBranchPitch.nodes[nodeId];
    }

    function fillTemplate(text, fields) {
        let out = text;
        (fields || []).forEach(field => {
            const placeholder = `[${field.id}]`;
            const raw = branchFieldValues[field.id] || '';
            const value = raw ? `${field.prefix || ''}${raw}${field.suffix || ''}` : (field.placeholder || '');
            out = out.split(placeholder).join(value);
        });
        return out;
    }

    function renderBranchPitch(template) {
        activeBranchPitch = template;
        currentNodeId = template.start;
        nodeHistory = [];
        // Keep field values across nodes within the same pitch session,
        // but reset when switching to a *different* branching pitch.
        branchFieldValues = {};

        const container = document.getElementById('branch-content');
        container.innerHTML = `
            <h2 id="template-title">${escapeHtml(template.name)}</h2>
            <p id="template-desc" class="field-description">${escapeHtml(template.description || '')}</p>
            <div id="branch-breadcrumb" class="branch-breadcrumb"></div>
            <div id="branch-node-fields" class="branch-fields"></div>
            <div class="branch-preview" id="branch-preview"></div>
            <div class="branch-actions">
                <button id="branch-copy-button" type="button">Copy to Clipboard</button>
                <button id="branch-back-button" type="button" class="branch-secondary-btn">⟵ Back</button>
                <button id="branch-restart-button" type="button" class="branch-secondary-btn">Restart Pitch</button>
            </div>
            <div id="branch-options" class="branch-options"></div>
        `;

        document.getElementById('branch-copy-button').addEventListener('click', copyCurrentNodeText);
        document.getElementById('branch-back-button').addEventListener('click', goBack);
        document.getElementById('branch-restart-button').addEventListener('click', () => renderBranchPitch(template));

        renderNode();
    }

    function renderNode() {
        const node = getNode(currentNodeId);
        if (!node) {
            console.error('Branch engine: missing node', currentNodeId);
            return;
        }

        renderBreadcrumb();
        renderFields(node);
        renderPreview(node);
        renderOptions(node);

        document.getElementById('branch-back-button').style.display = nodeHistory.length ? 'inline-block' : 'none';
    }

    function renderBreadcrumb() {
        const el = document.getElementById('branch-breadcrumb');
        const steps = [...nodeHistory, currentNodeId].map((id, i) => {
            const label = activeBranchPitch.nodes[id]?.label || `Step ${i + 1}`;
            return label;
        });
        el.textContent = steps.join('  ›  ');
    }

    function renderFields(node) {
        const fieldsContainer = document.getElementById('branch-node-fields');
        fieldsContainer.innerHTML = '';

        if (!node.fields || !node.fields.length) return;

        node.fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `branch-field-${field.id}`;
            input.value = branchFieldValues[field.id] || '';
            input.placeholder = field.placeholder || '';
            input.addEventListener('input', (e) => {
                branchFieldValues[field.id] = e.target.value;
                renderPreview(node);
            });

            fieldsContainer.appendChild(label);
            fieldsContainer.appendChild(input);
        });
    }

    function renderPreview(node) {
        document.getElementById('branch-preview').textContent = fillTemplate(node.text, node.fields);
    }

    function renderOptions(node) {
        const optionsContainer = document.getElementById('branch-options');
        optionsContainer.innerHTML = '';

        const branchKeys = node.branches ? Object.keys(node.branches) : [];

        if (!branchKeys.length) {
            const endLabel = document.createElement('div');
            endLabel.className = 'branch-end-label';
            endLabel.textContent = 'End of pitch.';
            optionsContainer.appendChild(endLabel);
            return;
        }

        branchKeys.forEach(key => {
            const branch = node.branches[key];
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `branch-option-btn branch-option-${key}`;
            btn.textContent = branch.label || key;
            btn.addEventListener('click', () => {
                if (!branch.next || !activeBranchPitch.nodes[branch.next]) {
                    console.error('Branch engine: branch points to missing node', branch.next);
                    return;
                }
                nodeHistory.push(currentNodeId);
                currentNodeId = branch.next;
                renderNode();
            });
            optionsContainer.appendChild(btn);
        });
    }

    function goBack() {
        if (!nodeHistory.length) return;
        currentNodeId = nodeHistory.pop();
        renderNode();
    }

    function copyCurrentNodeText() {
        const node = getNode(currentNodeId);
        const text = fillTemplate(node.text, node.fields);
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('branch-copy-button');
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 2000);
        }).catch(err => console.error('Failed to copy:', err));
    }

    function escapeHtml(unsafe) {
        return (unsafe || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Expose globally so scripts.js can call into it when a branching
    // template is clicked in the sidebar.
    window.BranchEngine = {
        render: renderBranchPitch
    };
})();
