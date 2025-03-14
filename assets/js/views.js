const GITHUB_REPO = "ac031203/ac031203.github.io"; // Your GitHub repo
const ISSUE_NUMBER = 1; // Issue number for storing views
const GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN_1; // Securely access the token
//const GITHUB_TOKEN = "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"; // TEMP for local testing

if (!GITHUB_TOKEN) {
    console.error("Error: GitHub token is missing. Set the environment variable PERSONAL_ACCESS_TOKEN_1.");
}

// Function to fetch the current view count
async function fetchViewCount() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        const text = await response.text(); // Debugging
        console.log("GitHub API Response:", text);

        if (!response.ok) {
            console.error("Error fetching views:", text);
            return;
        }

        const comments = JSON.parse(text);
        let viewComment = comments.find(comment => comment.body.startsWith("Views:"));
        let views = viewComment ? parseInt(viewComment.body.split(":")[1].trim(), 10) : 0;

        document.getElementById("view-count").textContent = views;

        await updateViewCount(views + 1, viewComment ? viewComment.id : null);
    } catch (error) {
        console.error("Error fetching views:", error);
    }
}


// Function to update the view count
async function updateViewCount(newViews, commentId) {
    const url = commentId
        ? `https://api.github.com/repos/${GITHUB_REPO}/issues/comments/${commentId}`
        : `https://api.github.com/repos/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

    const method = commentId ? "PATCH" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                body: `Views: ${newViews}`
            })
        });

        if (!response.ok) {
            console.error("Failed to update views:", await response.text());
            return;
        }

        document.getElementById("view-count").textContent = newViews;
    } catch (error) {
        console.error("Error updating views:", error);
    }
}

// Run on page load
fetchViewCount();
