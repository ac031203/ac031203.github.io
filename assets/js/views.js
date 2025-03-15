const GITHUB_USERNAME = "ac031203";
const REPO_NAME = "ac031203.github.io";
const ISSUE_NUMBER = 1;

async function fetchViewCount() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues/${ISSUE_NUMBER}`);
        const data = await response.json();
        const count = data.body.match(/\d+/) ? parseInt(data.body.match(/\d+/)[0]) : 0;
        document.getElementById("view-count").textContent = count;
    } catch (error) {
        console.error("Error fetching view count:", error);
    }
}

async function updateViewCount() {
    try {
        await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.everest-preview+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event_type: "update-views",
                client_payload: { issue: ISSUE_NUMBER }
            })
        });
        setTimeout(fetchViewCount, 3000);  // Fetch new count after 3 seconds
    } catch (error) {
        console.error("Error updating view count:", error);
    }
}

fetchViewCount();
updateViewCount();
