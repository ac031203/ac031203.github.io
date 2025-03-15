(async function() {
    let GITHUB_USERNAME = "ac031203";
    let REPO_NAME = "ac031203.github.io";
    let ISSUE_NUMBER = 1;

    async function fetchViewCount() {
        try {
            let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues/${ISSUE_NUMBER}`);
            let data = await response.json();
            let count = data.body && data.body.match(/\d+/) ? parseInt(data.body.match(/\d+/)[0]) : 0;
            document.getElementById("view-count").textContent = count;
        } catch (error) {
            console.error("Error fetching view count:", error);
        }
    }

    async function updateViewCount() {
        try {
            let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
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
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setTimeout(fetchViewCount, 3000);
        } catch (error) {
            console.error("Error updating view count:", error);
        }
    }

    fetchViewCount();
    updateViewCount();
})();
