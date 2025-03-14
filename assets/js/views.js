async function getToken() {
    return "{{ site.github.secret.PERSONAL_ACCESS_TOKEN_1 }}";
}

async function fetchViewCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER_VIEWS}/comments`;

    try {
        const token = await getToken();
        if (!token) throw new Error("Missing GitHub token");

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);

        const comments = await response.json();
        console.log("Fetched Comments:", comments);

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
        : `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER_VIEWS}/comments`;

    const method = commentId ? "PATCH" : "POST";
    const token = await getToken();
    if (!token) {
        console.error("Failed to get token for updating views.");
        return;
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            "Authorization": `Bearer ${token}`,
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

fetchViewCount();
