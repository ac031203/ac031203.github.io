const GITHUB_REPO = "ac031203/ac031203.github.io";
const ISSUE_NUMBER = 2; // Ensure this is correct

async function fetchLikeCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        
        const comments = await response.json();
        console.log("Fetched Comments:", comments);  // Debugging
        
        let likeComment = comments.find(comment => comment.body.startsWith("Likes:"));
        let likes = likeComment ? parseInt(likeComment.body.split(":")[1].trim()) : 0;

        document.getElementById("like-count").textContent = likes;

        document.getElementById("like-icon").addEventListener("click", async () => {
            await updateLikeCount(likes + 1, likeComment ? likeComment.id : null);
        });
    } catch (error) {
        console.error("Error fetching likes:", error);
    }
}

async function updateLikeCount(newLikes, commentId) {
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
        body: JSON.stringify({ body: `Likes: ${newLikes}` })
    });

    if (!response.ok) {
        console.error("Failed to update likes:", await response.text());
    } else {
        document.getElementById("like-count").textContent = newLikes;
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
fetchLikeCount();
