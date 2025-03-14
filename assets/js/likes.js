async function getToken() {
    return "{{ site.github.secret.PERSONAL_ACCESS_TOKEN_1 }}";
}

async function fetchLikeCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER_LIKES}/comments`;

    try {
        const token = await getToken();
        if (!token) throw new Error("Missing GitHub token");

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);

        const comments = await response.json();
        console.log("Fetched Comments:", comments);

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
        : `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER_LIKES}/comments`;

    const method = commentId ? "PATCH" : "POST";
    const token = await getToken();
    if (!token) {
        console.error("Failed to get token for updating likes.");
        return;
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            "Authorization": `Bearer ${token}`,
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

fetchLikeCount();
