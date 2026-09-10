// knowledge-base.js - Updated version
const KNOWLEDGE_BASE_CONFIG = {
    supabaseUrl: 'https://bbumoufrhnlbhzdgsmym.supabase.co', // Replace with your Supabase URL
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidW1vdWZyaG5sYmh6ZGdzbXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjQ4NDQsImV4cCI6MjA3NjQ0MDg0NH0.yF2EYcGisUj7faooJTcEy6MgeGKe2Y8SYHhFcgVoLDw' // Replace with your Supabase anon key
};

class KnowledgeBase {
    constructor() {
        this.currentIssueId = null;
        this.selectedTags = [];
        this.init();
    }
    hideNewIssueModal() {
        const modal = document.getElementById('new-issue-modal');
        if (modal) {
            modal.style.display = 'none';
        }

        // Reset form
        const form = document.getElementById('new-issue-form');
        if (form) {
            form.reset();
        }

        // Reset selected tags
        this.selectedTags = [];
        this.renderSelectedTags();

        // Uncheck all tag checkboxes
        const checkboxes = document.querySelectorAll('#existing-tags input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Knowledge base navigation
        document.getElementById('knowledge-base-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showKnowledgeBase();
        });
        // Add this to setupEventListeners in knowledge-base.js
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') && e.target.closest('#issue-detail-modal')) {
                this.hideIssueDetail();
            }
        });

        // Search functionality
        document.getElementById('kb-search').addEventListener('input', (e) => {
            this.searchIssues(e.target.value);
        });

        // New issue button
        document.getElementById('new-issue-btn').addEventListener('click', () => {
            this.showNewIssueModal();
        });

        // New issue form
        document.getElementById('new-issue-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitNewIssue();
        });

        // Cancel issue button
        document.getElementById('cancel-issue-btn').addEventListener('click', () => {
            this.hideNewIssueModal();
        });

        // Close modal button (X)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-modal-btn' || e.target.classList.contains('close-btn')) {
                this.hideNewIssueModal();
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.id === 'new-issue-modal') {
                this.hideNewIssueModal();
            }
        });

        // Add tag button
        document.getElementById('add-tag-btn').addEventListener('click', () => {
            this.addNewTag();
        });

        // Close issue detail
        document.getElementById('close-issue-detail-btn').addEventListener('click', () => {
            this.hideIssueDetail();
        });

        // Submit solution
        document.getElementById('submit-solution-btn').addEventListener('click', () => {
            this.submitSolution();
        });
    }

    showKnowledgeBase() {
        // Hide all other content, show knowledge base
        document.getElementById('welcome-content').style.display = 'none';
        document.getElementById('template-content').style.display = 'none';
        const branchContent = document.getElementById('branch-content');
        if (branchContent) branchContent.style.display = 'none';
        document.getElementById('knowledge-base-section').style.display = 'block';

        // Load data
        this.loadIssues();
        this.loadTags();
    }

    // ... rest of your existing KnowledgeBase class methods remain the same
    // (loadIssues, renderIssues, loadTags, etc.)

    async loadIssues() {
        try {
            // Show loading state
            document.getElementById('issues-list').innerHTML = '<p>Loading issues...</p>';

            const response = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/issues?select=*,issue_tags(tags(*)),solutions(*)`, {
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch issues');

            const issues = await response.json();
            this.renderIssues(issues);
        } catch (error) {
            console.error('Error loading issues:', error);
            this.showError('Failed to load issues');
            document.getElementById('issues-list').innerHTML = '<p>Error loading issues. Please try again.</p>';
        }
    }

    renderIssues(issues) {
        const issuesList = document.getElementById('issues-list');
        issuesList.innerHTML = '';

        if (issues.length === 0) {
            issuesList.innerHTML = '<p>No issues found. Be the first to raise one!</p>';
            return;
        }

        issues.forEach(issue => {
            const issueCard = document.createElement('div');
            issueCard.className = 'issue-card';
            issueCard.innerHTML = `
                <h4>${this.escapeHtml(issue.name)}</h4>
                <p>${this.escapeHtml(issue.description || 'No description provided')}</p>
                <div class="issue-tags">
                    ${issue.issue_tags ? issue.issue_tags.map(tag =>
                `<span class="tag">${this.escapeHtml(tag.tags.name)}</span>`
            ).join('') : ''}
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #aaa;">
                    ${issue.solutions ? issue.solutions.length : 0} solutions • 
                    Created: ${new Date(issue.created_at).toLocaleDateString()}
                </div>
            `;

            issueCard.addEventListener('click', () => {
                this.showIssueDetail(issue);
            });

            issuesList.appendChild(issueCard);
        });
    }

    async loadTags() {
        try {
            const response = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/tags`, {
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch tags');

            const tags = await response.json();
            this.renderExistingTags(tags);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    }


    renderExistingTags(tags) {
        const existingTagsContainer = document.getElementById('existing-tags');
        existingTagsContainer.innerHTML = '';

        if (tags.length === 0) {
            existingTagsContainer.innerHTML = '<div style="color: #666; font-style: italic; padding: 0.5rem;">No existing tags available. Create new ones below.</div>';
            return;
        }

        tags.forEach(tag => {
            const tagBubble = document.createElement('div');
            tagBubble.className = 'tag-bubble';
            tagBubble.textContent = tag.name;
            tagBubble.dataset.tagId = tag.id;
            tagBubble.dataset.tagName = tag.name;

            // Check if this tag is already selected
            const isSelected = this.selectedTags.some(selectedTag => selectedTag.id === tag.id);
            if (isSelected) {
                tagBubble.classList.add('selected');
            }

            tagBubble.addEventListener('click', () => {
                this.toggleTagSelection(tag.id, tag.name, tagBubble);
            });

            existingTagsContainer.appendChild(tagBubble);
        });
    }
    toggleTagSelection(tagId, tagName, tagElement) {
        const existingIndex = this.selectedTags.findIndex(tag => tag.id === tagId);

        if (existingIndex === -1) {
            // Add tag to selection
            this.selectedTags.push({ id: tagId, name: tagName });
            tagElement.classList.add('selected');
        } else {
            // Remove tag from selection
            this.selectedTags.splice(existingIndex, 1);
            tagElement.classList.remove('selected');
        }

        this.renderSelectedTags();
    }

    renderSelectedTags() {
        const selectedTagsContainer = document.getElementById('selected-tags');
        selectedTagsContainer.innerHTML = '';

        if (this.selectedTags.length === 0) {
            // The empty state is handled by CSS
            return;
        }

        this.selectedTags.forEach(tag => {
            const tagBubble = document.createElement('div');
            tagBubble.className = 'selected-tag-bubble';
            tagBubble.innerHTML = `
            ${this.escapeHtml(tag.name)}
            <span class="remove-tag-bubble" data-tag-id="${tag.id}">×</span>
        `;

            tagBubble.querySelector('.remove-tag-bubble').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSelectedTag(tag.id);
            });

            selectedTagsContainer.appendChild(tagBubble);
        });
    }
    removeSelectedTag(tagId) {
        this.selectedTags = this.selectedTags.filter(tag => tag.id !== tagId);

        // Update the visual state of existing tag bubbles
        const existingTagBubble = document.querySelector(`.tag-bubble[data-tag-id="${tagId}"]`);
        if (existingTagBubble) {
            existingTagBubble.classList.remove('selected');
        }

        this.renderSelectedTags();
    }
    async addNewTag() {
        const newTagInput = document.getElementById('new-tag-input');
        const tagName = newTagInput.value.trim();

        if (!tagName) {
            this.showError('Please enter a tag name');
            return;
        }

        try {
            const response = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/tags`, {
                method: 'POST',
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ name: tagName })
            });

            if (!response.ok) throw new Error('Failed to create tag');

            const newTag = await response.json();

            // Add the new tag to selection
            this.selectedTags.push({ id: newTag[0].id, name: newTag[0].name });
            this.renderSelectedTags();
            newTagInput.value = '';

            // Reload tags to include the new one in the existing tags bubbles
            this.loadTags();
        } catch (error) {
            console.error('Error creating tag:', error);
            this.showError('Failed to create tag - it may already exist');
        }
    }

    showNewIssueModal() {
        document.getElementById('new-issue-modal').style.display = 'flex';
        this.selectedTags = [];
        this.renderSelectedTags();

        // Reset form fields
        document.getElementById('issue-name').value = '';
        document.getElementById('issue-description').value = '';
        document.getElementById('new-tag-input').value = '';

        // Reset all tag bubbles to unselected state
        const tagBubbles = document.querySelectorAll('.tag-bubble');
        tagBubbles.forEach(bubble => {
            bubble.classList.remove('selected');
        });
    }


    async submitNewIssue() {
        const name = document.getElementById('issue-name').value.trim();
        const description = document.getElementById('issue-description').value.trim();

        if (!name) {
            this.showError('Issue title is required');
            return;
        }

        try {
            // Create the issue
            const issueResponse = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/issues`, {
                method: 'POST',
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            });

            // Check if the response is successful
            if (!issueResponse.ok) {
                const errorText = await issueResponse.text();
                console.error('Server response:', errorText);
                throw new Error(`Failed to create issue: ${issueResponse.status} ${issueResponse.statusText}`);
            }

            const newIssue = await issueResponse.json();

            // Check if we got a valid response
            if (!newIssue || !newIssue[0] || !newIssue[0].id) {
                throw new Error('Invalid response from server - no issue ID returned');
            }

            const issueId = newIssue[0].id;

            // Add tags to the issue (if any)
            if (this.selectedTags.length > 0) {
                try {
                    const tagPromises = this.selectedTags.map(tag =>
                        fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/issue_tags`, {
                            method: 'POST',
                            headers: {
                                'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                                'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                issue_id: issueId,
                                tag_id: tag.id
                            })
                        }).then(response => {
                            if (!response.ok) {
                                console.warn(`Failed to add tag ${tag.name}`);
                            }
                            return response;
                        })
                    );

                    await Promise.allSagPromises;
                } catch (tagError) {
                    console.warn('Some tags could not be added:', tagError);
                    // Continue even if tags fail - the main issue was created
                }
            }

            this.hideNewIssueModal();
            this.loadIssues();
            this.showSuccess('Issue created successfully!');
        } catch (error) {
            console.error('Error creating issue:', error);
            this.showError(`Failed to create issue: ${error.message}`);
        }
    }

    showIssueDetail(issue) {
        this.currentIssueId = issue.id;

        document.getElementById('issue-detail-title').textContent = issue.name;
        document.getElementById('issue-detail-description').textContent = issue.description || 'No description provided';

        // Render tags
        const tagsContainer = document.getElementById('issue-detail-tags');
        tagsContainer.innerHTML = '';
        if (issue.issue_tags && issue.issue_tags.length > 0) {
            issue.issue_tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag.tags.name;
                tagsContainer.appendChild(tagElement);
            });
        } else {
            tagsContainer.innerHTML = '<span style="color: #666; font-style: italic;">No tags</span>';
        }

        // Render solutions
        this.renderSolutions(issue.solutions || []);

        // Update solutions count
        const solutionsCount = document.getElementById('solutions-count');
        solutionsCount.textContent = `(${issue.solutions ? issue.solutions.length : 0})`;

        document.getElementById('issue-detail-modal').style.display = 'flex';

        // Add event listener for sort select
        const sortSelect = document.getElementById('solutions-sort-select');
        sortSelect.addEventListener('change', () => {
            this.sortSolutions();
        });
    }

    hideIssueDetail() {
        document.getElementById('issue-detail-modal').style.display = 'none';
        this.currentIssueId = null;
    }

    renderSolutions(solutions) {
        const solutionsList = document.getElementById('solutions-list');
        const noSolutions = document.getElementById('no-solutions');

        solutionsList.innerHTML = '';

        if (solutions.length === 0) {
            noSolutions.style.display = 'block';
            solutionsList.style.display = 'none';
            return;
        }

        noSolutions.style.display = 'none';
        solutionsList.style.display = 'flex';

        // Sort solutions based on current selection
        const sortedSolutions = this.sortSolutionsBy(solutions, document.getElementById('solutions-sort-select').value);

        sortedSolutions.forEach((solution, index) => {
            const solutionCard = document.createElement('div');
            solutionCard.className = `solution-card ${solution.upvotes >= 3 ? 'high-voted' : ''} ${index === 0 ? 'new-solution' : ''}`;

            const solutionDate = new Date(solution.created_at);
            const formattedDate = solutionDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            solutionCard.innerHTML = `
            <div class="solution-header">
                <div class="solution-content">${this.escapeHtml(solution.solution_text)}</div>
            </div>
            <div class="solution-footer">
                <div class="solution-meta">
                    <span class="solution-date">${formattedDate}</span>
                </div>
                <div class="upvote-section">
                    <button class="upvote-btn ${this.hasUserVoted(solution.id) ? 'voted' : ''}" 
                            data-solution-id="${solution.id}">
                        <span class="upvote-icon">▲</span>
                        This Worked
                        <span class="upvote-count">${solution.upvotes}</span>
                    </button>
                </div>
            </div>
        `;

            solutionCard.querySelector('.upvote-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.upvoteSolution(solution.id);
            });

            solutionsList.appendChild(solutionCard);
        });
    }
    // Add these methods to the KnowledgeBase class

    sortSolutionsBy(solutions, criteria) {
        const sorted = [...solutions];

        switch (criteria) {
            case 'upvotes':
                return sorted.sort((a, b) => b.upvotes - a.upvotes);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            default:
                return sorted.sort((a, b) => b.upvotes - a.upvotes);
        }
    }

    sortSolutions() {
        if (!this.currentIssueId) return;

        // Get current solutions from DOM and re-sort
        const sortValue = document.getElementById('solutions-sort-select').value;
        const solutions = Array.from(document.querySelectorAll('.solution-card')).map(card => {
            return {
                id: card.querySelector('.upvote-btn').dataset.solutionId,
                upvotes: parseInt(card.querySelector('.upvote-count').textContent),
                solution_text: card.querySelector('.solution-content').textContent,
                created_at: card.querySelector('.solution-date').textContent
            };
        });

        const sortedSolutions = this.sortSolutionsBy(solutions, sortValue);
        this.renderSolutions(sortedSolutions);
    }

    hasUserVoted(solutionId) {
        // This is a simplified version - in a real app, you'd track user votes
        // For now, we'll just return false. You can implement proper user session tracking later.
        return false;
    }
    async upvoteSolution(solutionId) {
        try {
            // First get current upvote count
            const response = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/solutions?id=eq.${solutionId}`, {
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch solution');

            const solution = await response.json();
            const currentUpvotes = solution[0].upvotes;

            // Update upvote count
            const updateResponse = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/solutions?id=eq.${solutionId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    upvotes: currentUpvotes + 1
                })
            });

            if (!updateResponse.ok) throw new Error('Failed to upvote solution');

            // Reload the current issue to refresh solutions
            this.loadCurrentIssue();
        } catch (error) {
            console.error('Error upvoting solution:', error);
            this.showError('Failed to upvote solution');
        }
    }

    async loadCurrentIssue() {
        if (!this.currentIssueId) return;

        try {
            const response = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/issues?id=eq.${this.currentIssueId}&select=*,issue_tags(tags(*)),solutions(*)`, {
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch issue');

            const issue = await response.json();
            this.showIssueDetail(issue[0]);
        } catch (error) {
            console.error('Error loading issue:', error);
        }
    }

    async submitSolution() {
        const solutionText = document.getElementById('new-solution-text').value.trim();

        if (!solutionText) {
            this.showError('Solution text is required');
            return;
        }

        if (!this.currentIssueId) {
            this.showError('No issue selected');
            return;
        }

        try {
            const response = await fetch(`${KNOWLEDGE_BASE_CONFIG.supabaseUrl}/rest/v1/solutions`, {
                method: 'POST',
                headers: {
                    'apikey': KNOWLEDGE_BASE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${KNOWLEDGE_BASE_CONFIG.supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    issue_id: this.currentIssueId,
                    solution_text: solutionText,
                    upvotes: 0
                })
            });

            if (!response.ok) throw new Error('Failed to submit solution');

            document.getElementById('new-solution-text').value = '';
            this.loadCurrentIssue();
            this.showSuccess('Solution added successfully!');
        } catch (error) {
            console.error('Error submitting solution:', error);
            this.showError('Failed to submit solution');
        }
    }

    searchIssues(query) {
        const issueCards = document.querySelectorAll('.issue-card');

        issueCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = card.querySelector('.issue-tags').textContent.toLowerCase();

            const matches = title.includes(query.toLowerCase()) ||
                description.includes(query.toLowerCase()) ||
                tags.includes(query.toLowerCase());

            card.style.display = matches ? 'block' : 'none';
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        alert(`Success: ${message}`);
    }
}

// Initialize knowledge base when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KnowledgeBase();
});
