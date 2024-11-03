export async function GetMemories() {
    try {
        const response = await fetch('http://127.0.0.1:3003/memories', {
            method: "GET",
            //body: { googleToken: token}
        });
        return await response.json();
    } catch(err) {
        console.log("fetch failed")
        console.log(err)
    }
    return "N/A"
}