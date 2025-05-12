<script>
        fetch(`http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/projects`,{
        method: "POST",
        body: {
            "projectName": "Projeдct Alpаha",
            "desc": "This is a sample project description.",
            "status": "active",
            "owner": ["alice"],
            "manager": ["bob"],
            "participants": ["charlie", "dave"]
        },
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Received JSON:", data); //we log passed data
        return data;
    })
    .catch(error => {
        console.error("Fetch error:", error);
        return null;
    });
</script>