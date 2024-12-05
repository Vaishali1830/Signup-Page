document.getElementById("resetform").addEventListener("submit" , async(e) =>{

    e.preventDefault()

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    const newPassword = document.getElementById("newpassword").value
    const confirmPassword = document.getElementById("confirmpassword").value
    const errorElement = document.getElementById("error")
    const successElement = document.getElementById("success")

    errorElement.textContent = ""
    successElement.textContent = ""

    if(newPassword !== confirmPassword){
        errorElement.textContent = "Passwords do not match"
        return
    }

    try{
        const response = await fetch("http://localhost:5000/api/auth/reset-password" , {
            method : "POST",
            headers : {"content-type" : "application/json"},
            body: JSON.stringify({token , password: newPassword})
        })

        const data = await response.json()

        if(response.ok){
            successElement.textContent = "Password reset successfully"
            setTimeout(() => {
                window.location.href = "login.html"
            } , 3000)
        }
        else{
            errorElement.textContent = data.message
        }
    }
    catch(error){
        errorElement.textContent = "An error occurred. Please try again."
        console.error("Error resetting password:", error);
    }

})