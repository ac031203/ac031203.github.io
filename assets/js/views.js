const GITHUB_REPO = "ac031203/ac031203.github.io";
const ISSUE_NUMBER = 1; // Ensure this is correct

async function fetchViewCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        
        const comments = await response.json();
        console.log("Fetched Comments:", comments);  // Debugging
        
        let viewComment = comments.find(comment => comment.body.startsWith("Views:"));
        let views = viewComment ? parseInt(viewComment.body.split(":")[1].trim()) : 0;

        document.getElementById("view-count").textContent = views;
        
        await updateViewCount(views + 1, viewComment ? viewComment.id : null);
    } catch (error) {
        console.error("Error fetching views:", error);
    }
}

async function updateViewCount(newViews, commentId) {
    const url = commentId
        ? `https://api.github.com/repos/${GITHUB_REPO}/issues/comments/${commentId}`
        : `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    const method = commentId ? "PATCH" : "POST";
    const token = await getToken();

    const response = await fetch(url, {
        method: method,
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ body: `Views: ${newViews}` })
    });

    if (!response.ok) {
        console.error("Failed to update views:", await response.text());
    } else {
        document.getElementById("view-count").textContent = newViews;
    }
}

// Function to get token dynamically
async function getToken() {
    try {
        const response = await fetch("/assets/js/token.js");
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}

// Run on page load
fetchViewCount();
