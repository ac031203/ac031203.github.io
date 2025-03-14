const GITHUB_REPO = "ac031203/ac031203.github.io"; // Your GitHub repo
const ISSUE_NUMBER = 2; // Replace with the issue number for likes
const GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN_1; // Securely access the token

if (!GITHUB_TOKEN) {
    console.error("Error: GitHub token is missing. Set the environment variable PERSONAL_ACCESS_TOKEN_1.");
}

async function fetchLikeCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        const comments = await response.json();
        let likeComment = comments.find(comment => comment.body.startsWith("Likes:"));
        let likes = likeComment ? parseInt(likeComment.body.split(":")[1].trim(), 10) : 0;

        document.getElementById("like-count").textContent = likes;

    } catch (error) {
        console.error("Error fetching likes:", error);
    }
}

async function updateLikeCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        const comments = await response.json();
        let likeComment = comments.find(comment => comment.body.startsWith("Likes:"));
        let likes = likeComment ? parseInt(likeComment.body.split(":")[1].trim(), 10) : 0;
        let newLikes = likes + 1;

        // Update the UI immediately
        document.getElementById("like-count").textContent = newLikes;
        document.getElementById("like-icon").style.color = "red";

        const apiUrl = likeComment
            ? `https://api.github.com/repos/${GITHUB_REPO}/issues/comments/${likeComment.id}`
            : url;

        const method = likeComment ? "PATCH" : "POST";

        await fetch(apiUrl, {
            method: method,
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                body: `Likes: ${newLikes}`
            })
        });

    } catch (error) {
        console.error("Error updating likes:", error);
    }
}

// Add event listener for like button
document.addEventListener("DOMContentLoaded", function () {
    fetchLikeCount();
    document.getElementById("like-container").addEventListener("click", updateLikeCount);
});
