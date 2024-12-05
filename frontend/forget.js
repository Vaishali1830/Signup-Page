document.querySelector(".container").addEventListener("submit" , async(e) => {

    e.preventDefault()

    const email = document.querySelector(".email").value.trim()

    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }

    try{
        const response = await fetch("http://localhost:5000/api/auth/forget" , {
            method : "POST",
            headers : {"content-type" : "application/json"},
            body : JSON.stringify({email})
        })

        const data = await response.json()

        alert(data.message)
    }
    catch(e){
        console.error("Error logging in:", e);
        alert("Error performing action")
    }
})